import { ipcMain } from "electron";
import * as fm from "../utils/fm.js"
import ipc from './main.js';
import os from '../utils/os.js';

export default function() {
    ipcMain.removeHandler("file:read");
    
    ipc.handle<"file:read">("file:read", async (payload) => {
        if (!payload) return []
        const result = await fm.read(payload)
        return result
    })
    ipc.handle("pane", async () => await fm.sidepane())
    ipc.handle("platform", () => os)
}