import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { SerialPort, ReadlineParser } from "serialport";

let port: SerialPort | null = null;
let parser: ReadlineParser | null = null;

const PORT_PATH = "/tmp/ttyV1"; // sesuaikan dengan socat-mu
const BAUD_RATE = 9600;
const RETRY_INTERVAL_MS = 1000;

let retryTimeout: NodeJS.Timeout | null = null;

const logPath = path.join(app.getPath("userData"), "serial.log");
const logStream = fs.createWriteStream(logPath, { flags: "a" });

function log(msg: string) {
  const line = `[${new Date().toISOString()}] ${msg}\n`;
  console.log(line);
  logStream.write(line);
}

export default function serial(mainWindow: BrowserWindow) {
  const tryConnect = () => {
    if (!fs.existsSync(PORT_PATH)) {
      log(`[SerialHelper] Port ${PORT_PATH} belum tersedia. Retry...`);
      mainWindow.webContents.send("serial-status", "Menunggu port...");
      retryTimeout = setTimeout(tryConnect, RETRY_INTERVAL_MS);
      return;
    }

    port = new SerialPort({
      path: PORT_PATH,
      baudRate: BAUD_RATE,
      autoOpen: false,
    });
    parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

    port.open((err) => {
      if (err) {
        log(`[SerialHelper] Gagal membuka port: ${err.message}`);
        mainWindow.webContents.send("serial-status", `Error: ${err.message}`);
        retryTimeout = setTimeout(tryConnect, RETRY_INTERVAL_MS);
        return;
      }

      log(`[SerialHelper] Serial port ${PORT_PATH} TERBUKA`);
      mainWindow.webContents.send("serial-status", `Terhubung ke ${PORT_PATH}`);
    });

    parser.on("data", (data: string) => {
      log(`[SerialHelper] Data masuk: ${data}`);
      mainWindow.webContents.send("serial-data", data);
    });

    port.on("close", () => {
      log("[SerialHelper] Port serial DITUTUP. Reconnect dalam 1 detik.");
      mainWindow.webContents.send(
        "serial-status",
        "Port ditutup. Coba sambung ulang...",
      );
      retryTimeout = setTimeout(tryConnect, RETRY_INTERVAL_MS);
    });

    port.on("error", (err) => {
      log(`[SerialHelper] Error: ${err.message}`);
      mainWindow.webContents.send(
        "serial-status",
        `Serial error: ${err.message}`,
      );
      retryTimeout = setTimeout(tryConnect, RETRY_INTERVAL_MS);
    });
  };

  tryConnect();

  ipcMain.on("serial-send", (_e, data: string) => {
    if (port?.isOpen) {
      port.write(data + "\n", (err) => {
        if (err) {
          log(`[SerialHelper] Gagal kirim data: ${err.message}`);
        } else {
          log(`[SerialHelper] Data terkirim: ${data}`);
        }
      });
    } else {
      log("[SerialHelper] Port belum terbuka. Tidak bisa kirim.");
    }
  });
}

export function close() {
  if (retryTimeout) clearTimeout(retryTimeout);
  if (port && port.isOpen) port.close();
}
