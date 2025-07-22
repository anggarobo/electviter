import { BrowserWindow, ipcMain, IpcMainInvokeEvent, Menu } from "electron";
import * as fm from "../utils/fm.js";
import ipc from "./main.js";
import os from "../utils/os.js";
import env from "../utils/env.js";
import { getStaticData } from "../resourceManager.js";
import { ReadlineParser, SerialPort } from "serialport";

let port: SerialPort | null = null;
let parser: ReadlineParser | null = null;

export default function (mainWindow: BrowserWindow) {
  ipcMain.removeHandler("file:read");

  ipc.handle<"file:read", string>("file:read", async (_, payload) => {
    if (!payload) return [];
    const result = await fm.read(payload);
    return result;
  });
  ipc.handle("pane", async () => await fm.sidepane());
  ipc.handle("platform", () => os);

  // TODO: Fix case when folders or files are selected
  ipc.handle<"show-context-menu", ContextMenuPayload | undefined>(
    "show-context-menu",
    async (event, payload) => {
      if (event.sender) {
        let clipboardCopyPath: string;
        // TODO: fix copy paste context menu below
        const win = BrowserWindow.fromWebContents(event.sender);
        console.log(payload);

        let menu = Menu.buildFromTemplate([]);
        if (payload) {
          menu = Menu.buildFromTemplate([
            { label: "Copy", click: () => (clipboardCopyPath = payload.src) },
            { label: "Cut", click: () => fm.move(payload.src, payload.dest) },
            {
              label: "Paste",
              click: () => fm.paste(clipboardCopyPath, payload.dest),
            },
            { label: "Delete", click: () => fm.remove(payload.src) },
            {
              label: "Inspect Element",
              click: () => mainWindow.webContents.toggleDevTools(),
              visible: env.isDev,
            },
          ]);
        } else {
          menu = Menu.buildFromTemplate([
            { label: "Copy", click: () => console.log("copied") },
            { label: "Cut", click: () => console.log("cut") },
          ]);
        }
        if (win) {
          menu.popup({ window: win });
        } else {
          console.warn("No window found for event.sender");
        }
      } else {
        console.warn("event.sender is undefined");
      }
    },
  );

  ipc.handle<"getStaticData", Omit<Statistics, "cpuUsage">>(
    "getStaticData",
    () => getStaticData(),
  );

  ipc.on<"sendFrameWindowAction", FrameWindowAction>(
    "sendFrameWindowAction",
    (_, payload) => {
      switch (payload) {
        case "CLOSE":
          mainWindow.close();
          break;
        case "MINIMIZE":
          mainWindow.minimize();
          break;
        case "MAXIMIZE":
          if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
          } else {
            mainWindow.maximize();
          }
          break;
        default:
          console.warn(`Unknown action: ${payload}`);
          break;
      }
    },
  );

  ipcMain.handle("serial-listPorts", async () => {
    return await SerialPort.list();
  });

  ipcMain.handle("serial-connect", (event, path: string, baudRate = 9600) => {
    port = new SerialPort({ path, baudRate });
    parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
  });

  ipcMain.on("serial-sendData", (event, data: string) => {
    if (port && port.isOpen) {
      port.write(data + "\n");
    }
  });

  function setupSerialDataEvents(win: BrowserWindow) {
    if (parser) {
      parser.on("data", (data: string) => {
        win.webContents.send("serial-onData", data);
      });
    }
  }

  // Panggil `setupSerialDataEvents(mainWindow)` setelah `serial-connect`
  ipcMain.handle("serial-setupEvents", (event) => {
    // const window = event.sender;
    setupSerialDataEvents(mainWindow);
  });
}
