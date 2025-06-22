import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { isDev } from './util.js';
import { getStaticData, resourcesManager } from './resourceManager.js';
import { getPreloadPath } from './pathResolver.js';

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
        }
    })
    
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5777");
    } else {
        mainWindow.loadFile(path.join(app.getAppPath(), "/dist-react/index.html"))
    }

    // mainWindow.webContents.openDevTools()
    resourcesManager(mainWindow);

    ipcMain.handle("getStaticData", () => {
        return getStaticData();
    })
})