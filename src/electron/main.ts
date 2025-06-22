import { app, BrowserWindow } from 'electron';
import path from 'path';
import { ipcMainHandle, isDev } from './util.js';
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

    ipcMainHandle("getStaticData", () => {
        return getStaticData();
    })
})