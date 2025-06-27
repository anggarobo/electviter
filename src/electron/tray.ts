import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "path";
import { ASSETS_PATH } from "./pathResolver.js";

export function createTray(mainWindow: BrowserWindow) {
    const tray = new Tray(
        path.join(
            ASSETS_PATH,
            "unnamed.png"
        )
    )

    tray.setContextMenu(
        Menu.buildFromTemplate([
            {
                label: "Show",
                click: () => {
                    mainWindow.show();
                    if (app.dock) {
                        app.dock.show();
                    }
                }
            },
            {
                label: "Quit",
                click: () => app.quit()
            }
        ])
    )
}