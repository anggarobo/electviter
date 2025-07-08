import { BrowserWindow, ipcMain, IpcMainInvokeEvent, Menu } from "electron";
import * as fm from "../utils/fm.js";
import ipc from "./main.js";
import os from "../utils/os.js";
import env from "../utils/env.js";
// import { contextMenuItems } from "../menu.js";

export default function (mainWindow: BrowserWindow) {
  ipcMain.removeHandler("file:read");

  ipc.handle<"file:read">("file:read", async (payload) => {
    if (!payload) return [];
    const result = await fm.read(payload);
    return result;
  });
  ipc.handle("pane", async () => await fm.sidepane());
  ipc.handle("platform", () => os);

  ipcMain.handle("show-context-menu", async (event: IpcMainInvokeEvent) => {
    if (event.sender) {
      const win = BrowserWindow.fromWebContents(event.sender);
      const menu = Menu.buildFromTemplate([
        { label: "Copy", click: () => console.log("Copied") },
        { label: "Cur", click: () => console.log("Cut") },
        { label: "Paste", click: () => console.log("Pasted") },
        {
          label: "Inspect Element",
          click: () => mainWindow.webContents.toggleDevTools(),
          visible: env.isDev,
        },
      ]);
      if (win) {
        menu.popup({ window: win });
      } else {
        console.warn("No window found for event.sender");
      }
    } else {
      console.warn("event.sender is undefined");
    }
    return null;
  });
}
