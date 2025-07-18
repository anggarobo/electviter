import { BrowserWindow, ipcMain, IpcMainInvokeEvent, Menu } from "electron";
import * as fm from "../utils/fm.js";
import ipc from "./main.js";
import os from "../utils/os.js";
import env from "../utils/env.js";
import { getStaticData } from "../resourceManager.js";

export default function (mainWindow: BrowserWindow) {
  ipcMain.removeHandler("file:read");

  ipc.handle<"file:read", string>("file:read", async (_, payload) => {
    if (!payload) return [];
    const result = await fm.read(payload);
    return result;
  });
  ipc.handle("pane", async () => await fm.sidepane());
  ipc.handle("platform", () => os);

  ipc.handle("close-context-menu", (e) => {
    const win = BrowserWindow.fromWebContents(e.sender);
    if (win) {
      const menu = Menu.buildFromTemplate([]);
      menu.closePopup();
    }
  });

  // TODO: Fix case when folders or files are selected
  ipc.handle<"show-context-menu", ContextMenuPayload | "close">(
    "show-context-menu",
    async (event, payload) => {
      if (event.sender) {
        let clipboardCopyPath: string;
        // TODO: fix copy paste context menu below
        const win = BrowserWindow.fromWebContents(event.sender);
        console.log(payload);

        let menu = Menu.buildFromTemplate([]);
        console.log("show-context-menu", payload);
        if (payload != "close") {
          menu = Menu.buildFromTemplate([
            { label: "Copy", click: () => (clipboardCopyPath = payload.src) },
            { label: "Cut", click: () => fm.move(payload.src, payload.dest) },
            {
              label: "Paste",
              click: () => fm.paste(clipboardCopyPath, payload.dest),
            },
            { label: "Delete", click: () => fm.remove(payload.src) },
            {
              label: "Properties",
              click: () => console.log("Properties clicked"),
            },
            {
              label: "Inspect Element",
              click: () => mainWindow.webContents.toggleDevTools(),
              visible: env.isDev,
            },
          ]);
        }

        if (win) {
          if (payload === "close") menu.closePopup();
          else {
            menu.popup({
              window: win,
              x: payload.event?.x || 0,
              y: payload.event?.y || 0,
            });
            // If the event is not defined, it will default to the top-left corner of the window
            // 0, 0 is the default position for the context menu
            // If you want to position it based on the event, you can use payload.event.x
            // and payload.event.y, but ensure that these properties are defined
            // in the payload.
            // menu.popup({ x: payload.event?.x || 0, y: payload.event?.y || 0 });
            // Or you can use the event.sender to get the window and
            // position the menu relative to the window.
            menu.popup({ window: win });
          }
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
}
