import { app, BrowserWindow, Menu } from "electron";
import env from "./utils/env.js";
import ipc from "./ipc/main.js";

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
      {
        label: "View",
        type: "submenu",
        submenu: [
          {
            label: "CPU",
            click: () => ipc.send("changeView", mainWindow.webContents, "CPU"),
          },
          {
            label: "RAM",
            click: () => ipc.send("changeView", mainWindow.webContents, "RAM"),
          },
          {
            label: "STORAGE",
            click: () =>
              ipc.send("changeView", mainWindow.webContents, "STORAGE"),
          },
        ],
      },
      {
        label: "Settings",
        type: "submenu",
        submenu: [
          {
            label: "CPU",
            click: () => ipc.send("changeView", mainWindow.webContents, "CPU"),
          },
          {
            label: "RAM",
            click: () => ipc.send("changeView", mainWindow.webContents, "RAM"),
          },
          {
            label: "STORAGE",
            click: () =>
              ipc.send("changeView", mainWindow.webContents, "STORAGE"),
          },
        ],
      },
      {
        label: "Arrange",
        type: "submenu",
        submenu: [
          {
            label: "CPU",
            click: () => ipc.send("changeView", mainWindow.webContents, "CPU"),
          },
          {
            label: "RAM",
            click: () => ipc.send("changeView", mainWindow.webContents, "RAM"),
          },
          {
            label: "STORAGE",
            click: () =>
              ipc.send("changeView", mainWindow.webContents, "STORAGE"),
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
