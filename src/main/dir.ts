import fs from 'fs/promises';
import { apiIpcMainHandle } from './utils/ipc.js';

export async function readFolderContents(dirPath: string, platform?: NodeJS.Platform) {
    let items: Dir[] = []
    try {
        items = await fs.readdir(dirPath, { withFileTypes: true })
    } catch (error) {
        console.error(`error reading directory ${dirPath}:`, error)
    }

    apiIpcMainHandle("dir", () => items)
}

export async function readSidePane(platform?: NodeJS.Platform) {
    const panes: Dir[] = []
    try {
        if (platform === "linux") {
            const folders = ["desktop", "documents", "downloads", "music", "pictures", "videos"]
            const [usr] = await fs.readdir("/home", { withFileTypes: true })
            if (usr) {
                panes.push(usr)
                const usrDir = await fs.readdir(`/home/${usr.name}`, { withFileTypes: true })
                usrDir?.forEach(dir => {
                    if (folders.includes(dir.name.toLowerCase())) {
                        panes.push(dir)
                    }
                })
            }
        }
    } catch (error) {
        console.error(`error reading directory`, error)
    }

    apiIpcMainHandle("dir", () => panes)
}