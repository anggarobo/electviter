import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { SerialPort, ReadlineParser } from "serialport";

let port: SerialPort | null = null;
let parser: ReadlineParser | null = null;
let lastPortPaths: string[] = [];

const PORT_PATH = "/tmp/ttyV1"; // sesuaikan dengan socat-mu
const BAUD_RATE = 9600;
const RETRY_INTERVAL_MS = 1000;

let retryTimeout: NodeJS.Timeout | null = null;

const logPath = path.join(app.getPath("userData"), "serial.log");
const logStream = fs.createWriteStream(logPath, { flags: "a" });

function log(msg: string) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  logStream.write(line + "\n");
}

type SerialInstance = {
  port: SerialPort;
  parser: ReadlineParser;
};

const portInstances = new Map<string, SerialInstance>();

export function initMultiSerial(mainWindow: BrowserWindow, paths: string[]) {
  for (const path of paths) {
    if (!fs.existsSync(path)) continue;

    const port = new SerialPort({ path, baudRate: 9600, autoOpen: false });
    const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

    port.open((err) => {
      if (err) {
        console.error(`[${path}] Gagal membuka: ${err.message}`);
        return;
      }

      console.log(`[${path}] TERBUKA`);
      mainWindow.webContents.send("serial-status", `Terhubung ke ${path}`);
    });

    port.on("data", (buf: Buffer) => {
      console.log(`[${path}] 🔸 RAW: ${buf.toString()}`);
    });

    parser.on("data", (data: string) => {
      console.log(`[${path}] ✅ Data masuk: ${data}`);
      mainWindow.webContents.send("serial-data", { path, data });
    });

    port.on("close", () => {
      console.log(`[${path}] DITUTUP`);
    });

    portInstances.set(path, { port, parser });
  }
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
    parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

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

    port.on("data", (buffer) => {
      const raw = buffer.toString();
      log(`[SerialHelper] 🔸 RAW: ${raw}`);
    });
    parser.on("data", (data) => {
      log(`[SerialHelper] ✅ Parsed: ${data}`);
      mainWindow.webContents.send("serial-data", data);
    });
    // parser.on("data", (data: Buffer) => {
    //   log(`[SerialHelper] Data masuk: ${data.toString()}`);
    //   mainWindow.webContents.send("serial-data", data);
    // });

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
      port.write(data, (err) => {
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

  ipcMain.handle("serial-list", async () => {
    try {
      const ports = await serialList();

      return ports;
    } catch (err: any) {
      log(`[SerialHelper] Gagal mendapatkan daftar port: ${err.message}`);
      return [];
    }
  });

  startSerialWatcher(mainWindow);
  initMultiSerial(mainWindow, ["/tmp/ttyV0", "/tmp/ttyV2"]);
}

async function serialList(): Promise<{
  standard: Array<{ path: string; source: string }>;
  manual: Array<{ path: string; source: string }>;
}> {
  const standardPorts = await SerialPort.list();
  const standardList = standardPorts.map((p) => ({
    ...p,
    path: p.path,
    source: "system",
  }));

  const manualPaths = ["/tmp/ttyV0", "/tmp/ttyV1"];
  const validatedManualPorts: Array<{ path: string; source: string }> = [];

  for (const p of manualPaths) {
    const exists = fs.existsSync(p);
    if (!exists) continue;

    // const valid = await isPortValid(p);
    // if (valid) {
    //   validatedManualPorts.push({ path: p, source: "manual" });
    // }
    validatedManualPorts.push({ path: p, source: "manual" });
  }

  return { standard: standardList, manual: validatedManualPorts };
}

function startSerialWatcher(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const ports = await SerialPort.list();
    const currentPaths = ports.map((p) => p.path);

    // Deteksi perubahan
    const added = currentPaths.filter((p) => !lastPortPaths.includes(p));
    const removed = lastPortPaths.filter((p) => !currentPaths.includes(p));

    if (added.length || removed.length) {
      mainWindow.webContents.send("serial-ports-updated", {
        added,
        removed,
        current: currentPaths,
      });
      lastPortPaths = currentPaths;
    }
  }, 1000); // 1 detik polling
}

// async function isPortValid(path: string): Promise<boolean> {
//   return new Promise((resolve) => {
//     const testPort = new SerialPort({
//       path,
//       baudRate: 9600,
//       autoOpen: false,
//     });

//     testPort.open((err) => {
//       if (err) {
//         resolve(false);
//       } else {
//         testPort.close(() => {
//           resolve(true);
//         });
//       }
//     });
//   });
// }

export function close() {
  if (retryTimeout) clearTimeout(retryTimeout);
  if (port && port.isOpen) port.close();
}
