import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import { SerialPort, ReadlineParser } from "serialport";

let port: SerialPort | null = null;
let parser: ReadlineParser | null = null;

const PORT_PATH = "/tmp/ttyV1"; // sesuaikan dengan socat-mu
const BAUD_RATE = 9600;
const RETRY_INTERVAL_MS = 1000;

let retryTimeout: NodeJS.Timeout | null = null;

export default function serial(mainWindow: BrowserWindow) {
  const tryConnect = () => {
    if (!fs.existsSync(PORT_PATH)) {
      console.warn(
        `[SerialHelper] Port ${PORT_PATH} belum tersedia. Mencoba ulang...`,
      );
      mainWindow.webContents.send("serial-status", "Menunggu port tersedia...");
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
        console.error("[SerialHelper] Gagal membuka port:", err.message);
        mainWindow.webContents.send("serial-status", `Error: ${err.message}`);
        retryTimeout = setTimeout(tryConnect, RETRY_INTERVAL_MS);
        return;
      }

      console.log(`[SerialHelper] Serial port ${PORT_PATH} terbuka.`);
      mainWindow.webContents.send("serial-status", `Terhubung ke ${PORT_PATH}`);
    });

    parser.on("data", (data: string) => {
      console.log(`[SerialHelper] Data diterima: ${data}`);
      mainWindow.webContents.send("serial-data", data);
    });

    port.on("close", () => {
      console.warn(
        "[SerialHelper] Port serial tertutup. Keluar dari aplikasi.",
      );
      mainWindow.webContents.send("serial-status", "Serial port tertutup");
      app.quit(); // atau restart, sesuai kebutuhan
    });

    port.on("error", (err) => {
      console.error("[SerialHelper] Error serial port:", err.message);
      mainWindow.webContents.send(
        "serial-status",
        `Serial error: ${err.message}`,
      );
      app.quit(); // atau restart ulang serial
    });
  };

  tryConnect();

  ipcMain.on("serial-send", (_e, data: string) => {
    if (port?.isOpen) {
      port.write(data + "\n", (err) => {
        if (err) {
          console.error("[SerialHelper] Gagal kirim data:", err.message);
        } else {
          console.log(`[SerialHelper] Data terkirim: ${data}`);
        }
      });
    } else {
      console.warn("[SerialHelper] Port belum terbuka. Tidak bisa kirim.");
    }
  });
}

export function close() {
  if (retryTimeout) clearTimeout(retryTimeout);
  if (port && port.isOpen) port.close();
}
