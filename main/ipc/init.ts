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

  ipcMain.handle(
    "show-context-menu",
    async (event: IpcMainInvokeEvent, payload: ContextMenuPayload) => {
      if (event.sender) {
        let clipboardCopyPath: string;
        // TODO: fix copy paste context menu below
        const win = BrowserWindow.fromWebContents(event.sender);
        const menu = Menu.buildFromTemplate([
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
        if (win) {
          menu.popup({ window: win });
        } else {
          console.warn("No window found for event.sender");
        }
      } else {
        console.warn("event.sender is undefined");
      }
      return null;
    },
  );
}
