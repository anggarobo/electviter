import { app, BrowserWindow, Menu } from "electron";
import env from "../utils/env.js";

export function createMenu(mainWindow: BrowserWindow) {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      {
        label: process.platform === "darwin" ? undefined : "App",
        type: "submenu",
        submenu: [
          {
            label: "Open",
            accelerator: "CmdOrCtrl+O",
            click: () => {
              console.log("Open clicked!");
            },
          },
          {
            label: "Reload",
            accelerator: "CmdOrCtrl+R",
            click: () => {
              mainWindow.reload();
            },
          },
          {
            accelerator: "CmdOrCtrl+I",
            label: "DevTools",
            click: () => mainWindow.webContents.toggleDevTools(),
            visible: env.isDev,
          },
          {
            label: "Quit",
            accelerator: "CmdOrCtrl+Q",
            click: app.quit,
          },
        ],
      },
      {
        label: "Edit",
        submenu: [
          {
            label: "Cut",
            accelerator: "CmdOrCtrl+X",
            role: "cut",
          },
          {
            label: "Copy",
            accelerator: "CmdOrCtrl+C",
            role: "copy",
          },
          {
            label: "Paste",
            accelerator: "CmdOrCtrl+V",
            role: "paste",
          },
        ],
      },
    ]),
  );

  const ctxMenu = new Menu();
  mainWindow.webContents.on("context-menu", (ev) => {
    ctxMenu.popup({ window: mainWindow });
  });
}
