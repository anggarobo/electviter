import { app, BrowserWindow, ipcMain } from "electron";
import fs from "fs";
import path from "path";
import { SerialPort, ReadlineParser } from "serialport";

let lastPortPaths: string[] = [];
const INPUT_PATHS = ["/tmp/ttyV0", "/tmp/ttyV2"];
const OUTPUT_PATHS = ["/tmp/ttyV1", "/tmp/ttyV3"];
const BAUD_RATE = 9600;
const RETRY_INTERVAL_MS = 1000;
let retryTimeout: NodeJS.Timeout | null = null;

const logPath = path.join(app.getPath("userData"), "serial.log");
const logStream = fs.createWriteStream(logPath, { flags: "a" });

function log(msg: string, isError?: boolean) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  if (isError) console.error(line);
  else console.log(line);
  logStream.write(line + "\n");
}

type SerialInstance = {
  port: SerialPort;
  parser: ReadlineParser;
};
const inputPortInstances = new Map<string, SerialInstance>();
const outputPortInstances = new Map<string, SerialPort>();

export function initMultiSerial(mainWindow: BrowserWindow, paths: string[]) {
  for (const p of paths) {
    const retry = (attempt: number = 1) => {
      // if (!fs.existsSync(path)) continue;
      if (!fs.existsSync(p)) {
        log(`[SerialHelper] Port ${p} is unavailable. Retry...`);
        mainWindow.webContents.send("serial-status", "Connecting...");

        if (attempt < 3) {
          setTimeout(() => retry(attempt + 1), RETRY_INTERVAL_MS);
        }
        return;
      }

      const port = new SerialPort({
        path: p,
        baudRate: BAUD_RATE,
        autoOpen: false,
      });
      const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

      port.open((err) => {
        if (err) {
          log(
            `Failed to open Port [${p}]; error: ${err.message}; attempt: ${attempt}`,
            true,
          );

          if (attempt < 3) {
            setTimeout(() => retry(attempt + 1), RETRY_INTERVAL_MS);
          }
          return;
        }

        log(`INPUT Port [${p}] OPEN`);
        mainWindow.webContents.send("serial-status", `Connected to ${p}`);
      });

      port.on("data", (buf: Buffer) => {
        log(`[${p}] 🔸 RAW: ${buf.toString()}`);
      });

      parser.on("data", (data: string) => {
        log(`[${p}] ✅ Data received: ${data}`);
        mainWindow.webContents.send("serial-data", { p, data });
      });

      port.on("close", () => {
        log(`INPUT Port [${p}] CLOSED`);
      });

      port.on("error", (err) => {
        log(`[SerialHelper] Error: ${err.message}; attempt: ${attempt}`, true);
        mainWindow.webContents.send(
          "serial-status",
          `Serial error: ${err.message}`,
        );

        if (attempt < 3) {
          setTimeout(() => retry(attempt + 1), RETRY_INTERVAL_MS);
        }
      });

      inputPortInstances.set(p, { port, parser });
    };

    retry();
  }
}

function initOutputSerial(paths: string[]) {
  for (const p of paths) {
    if (!fs.existsSync(p)) {
      log(`[SerialHelper] OUTPUT Port ${p} is unavailable. Skipping...`);
      continue;
    }

    const port = new SerialPort({
      path: p,
      baudRate: BAUD_RATE,
    });

    port.on("open", () => {
      log(`OUTPUT Port [${p}] OPEN`);
    });

    port.on("error", (err) => {
      log(`[SerialHelper] Error OUTPUT ${p}: ${err.message}`);
    });

    port.on("close", () => {
      log(`OUTPUT Port [${p}] OUTPUT CLOSED`);
    });

    outputPortInstances.set(p, port);
  }
}

export default function serial(mainWindow: BrowserWindow) {
  startSerialWatcher(mainWindow);
  initMultiSerial(mainWindow, INPUT_PATHS);
  initOutputSerial(OUTPUT_PATHS);

  ipcMain.on(
    "serial-send",
    (_e, { path: targetPath, data }: { path: string; data: string }) => {
      const port = outputPortInstances.get(targetPath);

      if (port?.isOpen) {
        port.write(data, (err) => {
          if (err) {
            log(
              `[SerialHelper] failed to send to ${targetPath}: ${err.message}`,
            );
          } else {
            log(`[SerialHelper] Data sent to ${targetPath}: ${data}`);
          }
        });
      } else {
        log(`[SerialHelper] Port OUTPUT ${targetPath} is not open yet.`);
      }
    },
  );

  ipcMain.handle("serial-list", async () => {
    try {
      const ports = await serialList();

      return ports;
    } catch (err: any) {
      log(`[SerialHelper] Failed to get port list: ${err.message}`);
      return [];
    }
  });
}

async function serialList(): Promise<{
  standard: Array<{ path: string; source: string }>;
  input: Array<{ path: string; source: string }>;
  output: Array<{ path: string; source: string }>;
}> {
  const standardPorts = await SerialPort.list();
  const standardList = standardPorts.map((p) => ({
    path: p.path,
    source: "system",
  }));

  const inputList = INPUT_PATHS.filter(fs.existsSync).map((p) => ({
    path: p,
    source: "input",
  }));

  const outputList = OUTPUT_PATHS.filter(fs.existsSync).map((p) => ({
    path: p,
    source: "output",
  }));

  return { standard: standardList, input: inputList, output: outputList };
}

function startSerialWatcher(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const ports = await SerialPort.list();
    const currentPaths = ports.map((p) => p.path);

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
  }, 1000);
}

export function close() {
  for (const [p, instance] of inputPortInstances.entries()) {
    if (instance.port.isOpen) instance.port.close();
  }

  for (const [p, port] of outputPortInstances.entries()) {
    if (port.isOpen) port.close();
  }

  inputPortInstances.clear();
  outputPortInstances.clear();
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
