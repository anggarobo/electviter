import { app, BrowserWindow } from 'electron';
// import path from 'path';
import { ipcMainHandle, ipcMainOn, isDev } from './util.js';
import { getStaticData, pollResources } from './resourceManager.js';
import { INDEX_PATH, PRELOAD_PATH } from './pathResolver.js';
import { createMenu } from './menu.js';
import { createTray } from './tray.js';

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: PRELOAD_PATH,
        },
        frame: false,
    })
    
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5777");
    } else {
        mainWindow.loadFile(INDEX_PATH)
    }

    // mainWindow.webContents.openDevTools()
    pollResources(mainWindow);

    ipcMainHandle("getStaticData", () => {
        return getStaticData();
    })

    ipcMainOn('sendFrameWindowAction', (payload) => {
        switch (payload) {
            case 'CLOSE':
                mainWindow.close();
                break;
            case 'MINIMIZE':
                mainWindow.minimize();
                break;
            case 'MAXIMIZE':
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
    })

    createTray(mainWindow)
    handleCloseEvents(mainWindow);
    createMenu(mainWindow)
})

function handleCloseEvents(mainWindow: BrowserWindow) {
    let willClose = false;

    mainWindow.on("close", (event) => {
        if (willClose) return

        event.preventDefault();
        mainWindow.hide();
        if (app.dock) {
            app.dock.hide();
        }
    })

    app.on("before-quit", () => {
        willClose = true;
    })

    mainWindow.on("show", () => {
        willClose = false;
    })
}