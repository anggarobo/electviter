import { app, BrowserWindow, dialog, globalShortcut, ipcMain, nativeImage } from 'electron';
import { ipcMainHandle, ipcMainOn, isDev } from './util.js';
import { getStaticData, pollResources } from './resourceManager.js';
import { ASSETS_PATH, INDEX_PATH, PRELOAD_PATH } from './pathResolver.js';
import { createMenu } from './menu.js';
import { createTray } from './tray.js';
import path from 'path';
// import fs from 'fs';
import { openFile, readSidePane } from './dir.js';
import osx from './utils/os.js';
import { apiIpcMainHandle } from './utils/ipc.js';

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: PRELOAD_PATH,
        },
        icon: path.join(ASSETS_PATH, 'electviter_48x.png')
        // frame: false,
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
    setTaskbar(mainWindow)

    // Global Keyboard Shortcut
    globalShortcut.register('CmdOrCtrl+R', () => {
        mainWindow.reload();
    });

    globalShortcut.register('CmdOrCtrl+I', () => {
        mainWindow.webContents.toggleDevTools();
    });

    // handle select file request
    // ipcMain.handle("dialog:openFile", async () => {
    //     const result = await dialog.showOpenDialog(mainWindow, {
    //         properties: ["openFile"],
    //         filters: [
    //             { name: "Text files", extensions: ["txt", "md"] },
    //             { name: "All files", extensions: ["*"] }
    //         ]
    //     })

    //     return result.filePaths
    // })

    // // handle read file request
    // ipcMain.handle('file:read', async (ev, filePath) => {
    //     try {
    //         return fs.readFileSync(filePath, 'utf-8')
    //     } catch (error) {
    //         dialog.showErrorBox('Error', 'failed to read teh file')
    //         return ''
    //     }
    // })

    // // handle write file request
    // ipcMain.handle('file:write', async (_, { filePath, content }) => {
    //     try {
    //         fs.writeFileSync(filePath, content, 'utf-8')
    //         return 'File writtern succesfully'
    //     } catch (error) {
    //         dialog.showErrorBox('Error', 'failed to read teh file')
    //         return 'Failed to write the file'
    //     }
    // })

    // ipcMainHandle("")
    osx()
    readSidePane(process.platform)

    ipcMain.removeHandler("openFile");
    ipcMain.handle("openFile", async (_, payload) => {
        const response = await openFile(payload)
        return response
    })
})

app.on("will-quit", () => {
    // unregister all shortcut when app quits
    globalShortcut.unregisterAll()
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

function setTaskbar (mainWindow: BrowserWindow) {
    mainWindow.setIcon(path.join(ASSETS_PATH, 'electviter_48x.png'))
}