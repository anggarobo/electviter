import { app, BrowserWindow } from 'electron';
// import path from 'path';
import { ipcMainHandle, isDev } from './util.js';
import { getStaticData, resourcesManager } from './resourceManager.js';
import { INDEX_PATH, PRELOAD_PATH } from './pathResolver.js';

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: PRELOAD_PATH,
        }
    })
    
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5777");
    } else {
        mainWindow.loadFile(INDEX_PATH)
    }

    // mainWindow.webContents.openDevTools()
    resourcesManager(mainWindow);

    ipcMainHandle("getStaticData", () => {
        return getStaticData();
    })
})