import { ipcMainHandle } from "../util.js"
import { apiIpcMainHandle } from "./ipc.js"

const platform = {
    platform: process.platform,
    isMac: process.platform === 'darwin',
    isWindows: process.platform === 'win32',
    isLinux: process.platform === 'linux',
}

export default function osx() {
    apiIpcMainHandle("platform", () => platform)
}