import {
  BrowserWindow,
  dialog,
  ipcMain,
  IpcMainInvokeEvent,
  Menu,
} from "electron";
import * as fm from "../utils/fm.js";
import ipc from "./main.js";
import os from "../utils/os.js";
import env from "../utils/env.js";
import path from "path";
import { stat } from "fs/promises";

let clipboardCopyPath: string = "";
export default function (mainWindow: BrowserWindow) {
  ipcMain.removeHandler("file:read");

  ipc.handle<"file:read", string>("file:read", async (payload: string) => {
    if (!payload) return [];
    const result = await fm.read(payload);
    return result;
  });
  ipc.handle("pane", async () => await fm.sidepane());
  ipc.handle("platform", () => os);

  ipc.handle<"show-context-menu", ContextMenuPayload>(
    "show-context-menu",
    (event, payload) => {
      const menu = Menu.buildFromTemplate([
        {
          label: "Copy",
          click: () => {
            clipboardCopyPath = payload.src;
            event.sender.send("context-copy-set", path);
          },
        },
        {
          label: "Paste",
          enabled: !!clipboardCopyPath,
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              properties: ["openDirectory", "createDirectory"],
            });

            if (!result.canceled && result.filePaths[0]) {
              event.sender.send("context-paste-triggered", {
                source: clipboardCopyPath,
                destination: result.filePaths[0],
              });
            }
          },
        },
      ]);
      menu.popup({ window: mainWindow });
    },
  );

  // ipcMain.handle(
  //   "show-context-menu",
  //   async (event: IpcMainInvokeEvent, payload: ContextMenuPayload) => {
  //     if (event.sender) {
  //       // TODO: fix copy paste context menu below
  //       const win = BrowserWindow.fromWebContents(event.sender);
  //       const menu = Menu.buildFromTemplate([
  //         { label: "Copy", click: () => (clipboardCopyPath = payload.src) },
  //         { label: "Cut", click: () => fm.move(payload.src, payload.dest) },
  //         {
  //           label: "Paste",
  //           click: async () => {
  //             if (!clipboardCopyPath) return;

  //             const destPath = path.join(payload.dest, path.basename(clipboardCopyPath));

  //             try {
  //               const srcStat = await stat(clipboardCopyPath);
  //               let destStat = null;
  //               try {
  //                 destStat = await stat(destPath);
  //               } catch (_) {
  //                 // destination doesn't exist — fine
  //               }

  //               if (destStat) {
  //                 const { response } = await dialog.showMessageBox(mainWindow, {
  //                   type: "question",
  //                   buttons: ["Overwrite", "Cancel"],
  //                   defaultId: 0,
  //                   cancelId: 1,
  //                   message: `A file or folder named "${path.basename(destPath)}" already exists. Overwrite?`,
  //                 });

  //               if (response !== 0) return; // Cancelled
  //               }

  //               await fm.paste(clipboardCopyPath, payload.dest);
  //               console.log("Pasted", clipboardCopyPath, "→", payload.dest);
  //             } catch (err) {
  //               console.error("Paste failed:", (err as Error).message);
  //             }
  //           },
  //           enabled: Boolean(clipboardCopyPath)
  //         },
  //         { label: "Delete", click: () => fm.remove(payload.src) },
  //         {
  //           label: "Inspect Element",
  //           click: () => mainWindow.webContents.toggleDevTools(),
  //           visible: env.isDev,
  //         },
  //       ]);
  //       if (win) {
  //         menu.popup({ window: win });
  //       } else {
  //         console.warn("No window found for event.sender");
  //       }
  //     } else {
  //       console.warn("event.sender is undefined");
  //     }
  //     return null;
  //   },
  // );

  // ipc.handle<'select-source'>('select-source', async () => {
  //   const result = await dialog.showOpenDialog(mainWindow, {
  //     properties: ["openFile", "openDirectory"]
  //   })
  //   return result.filePaths[0] || null
  // })

  // ipc.handle<'select-destination'>('select-destination', async () => {
  //   const result = await dialog.showOpenDialog(mainWindow, {
  //     properties: ['openDirectory', 'createDirectory']
  //   });

  //   return result.filePaths[0] || null;
  // })
}
