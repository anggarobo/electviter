import { app, BrowserWindow, dialog, globalShortcut } from "electron";
import { ipcMainHandle, ipcMainOn } from "./util.js";
import { getStaticData, pollResources } from "./resourceManager.js";
import { ASSETS_PATH, INDEX_PATH, PRELOAD_PATH } from "./pathResolver.js";
import { createMenu } from "./menu.js";
import { createTray } from "./tray.js";
import path from "path";
import initIpc from "./ipc/init.js";
import env from "./utils/env.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: PRELOAD_PATH,
    },
    icon: path.join(ASSETS_PATH, "electviter_48x.png"),
    // frame: false,
  });

  if (env.isDev) {
    mainWindow.loadURL("http://localhost:5777");
  } else {
    mainWindow.loadFile(INDEX_PATH);
  }

  // mainWindow.webContents.openDevTools()
  pollResources(mainWindow);

  createTray(mainWindow);
  handleCloseEvents(mainWindow);
  createMenu(mainWindow);
  setTaskbar(mainWindow);

  // Global Keyboard Shortcut
  globalShortcut.register("CmdOrCtrl+R", () => {
    mainWindow.reload();
  });

  globalShortcut.register("CmdOrCtrl+I", () => {
    mainWindow.webContents.toggleDevTools();
  });

  initIpc(mainWindow);
});

app.on("will-quit", () => {
  // unregister all shortcut when app quits
  globalShortcut.unregisterAll();
});

function handleCloseEvents(mainWindow: BrowserWindow) {
  let willClose = false;

  mainWindow.on("close", (event) => {
    if (willClose) return;

    event.preventDefault();
    mainWindow.hide();
    if (app.dock) {
      app.dock.hide();
    }
  });

  app.on("before-quit", () => {
    willClose = true;
  });

  mainWindow.on("show", () => {
    willClose = false;
  });
}

function setTaskbar(mainWindow: BrowserWindow) {
  mainWindow.setIcon(path.join(ASSETS_PATH, "electviter_48x.png"));
}
