import fs from 'fs/promises';
import { apiIpcMainHandle } from './utils/ipc.js';
import type { Dirent } from 'fs';

export async function readFolderContents(dirPath: string, platform?: NodeJS.Platform) {
    let items: Dirent<string>[] = []
    try {
        items = await fs.readdir(dirPath, { withFileTypes: true })
    } catch (error) {
        console.error(`error reading directory ${dirPath}:`, error)
    }

    apiIpcMainHandle("dir", () => items)
}

export async function openFile(path: string) {
    let dirs: Dir[] = []
    try {
        const res = await fs.readdir(path, { withFileTypes: true })
        dirs = res.map(item => ({
            ...item,
            isDirectory: item.isDirectory(),
            isFile: item.isFile(),
            isBlockDevice: item.isBlockDevice(),
            isCharacterDevice: item.isCharacterDevice(),
            isFIFO: item.isFIFO(),
            isSocket: item.isSocket(),
            isSymbolicLink: item.isSymbolicLink()
        }))
    } catch (error) {
        console.error(`error reading directory`, error)
    }
    return dirs
}

export async function readSidePane(platform?: NodeJS.Platform) {
    const panes: Dirent<string>[] = []
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