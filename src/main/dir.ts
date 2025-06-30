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