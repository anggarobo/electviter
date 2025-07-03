import fs from 'fs';
import osUtils from 'os-utils';
import os from 'os';
import type { BrowserWindow } from 'electron';
import env from './utils/env.js';
import { electron } from './ipc/main.js';


const POLLING_INTERVAL = 1000; // Default polling interval in milliseconds

/**
 * @file resourceManager.ts
 * @description This module provides functionality to monitor system resources such as CPU and memory usage.
 * It uses the os-utils library to fetch system information.
 */
export function pollResources(mainWindow: BrowserWindow) {
    setInterval(async () => {
        const sysInfo = await getSystemInfo()
        electron.send('statistics', mainWindow.webContents, sysInfo);
    }, POLLING_INTERVAL);
}


function getSystemInfo(): Promise<Statistics> {
    return new Promise((resolve) => {
        osUtils.cpuUsage((cpuUsage) => {
            const staticData = getStaticData();
            const sysInfo: Statistics = {
                cpuUsage,
                ...staticData
            }
            resolve(sysInfo);
        });
    });
}

export function getStaticData(): Omit<Statistics, 'cpuUsage'> {
    const storage = getStorageInfo();
    const cpuModel = os.cpus()[0].model;
    const memory = getMemoryInfo();

    return {
        cpuModel,
        platform: os.platform(),
        arch: os.arch(),
        hostname: os.hostname(),
        storage,
        memory,
        uptime: os.uptime(),
        mode: env.mode as Statistics["mode"],
    }
}

function getMemoryInfo(): MemoryInfo {
    const usage = 1 - osUtils.freememPercentage();
    const total = osUtils.totalmem();
    const free = osUtils.freemem()

    return { total, free, usage };
    
}

function getStorageInfo(): StorageInfo {
    // requires node 18.0 or higher
    const storagePath = process.platform === "win32" ? 'C://' : '/';
    const stats = fs.statfsSync(storagePath);
    const total = stats.bsize * stats.blocks;
    const free = stats.bsize * stats.bfree
    
    return { total, free, usage: 1 - free / total };
} 