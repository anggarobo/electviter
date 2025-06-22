import fs from 'fs';
import osUtils from 'os-utils';
import os from 'os';
import type { BrowserWindow } from 'electron';


const POLLING_INTERVAL = 5000; // Default polling interval in milliseconds

/**
 * @file resourceManager.ts
 * @description This module provides functionality to monitor system resources such as CPU and memory usage.
 * It uses the os-utils library to fetch system information.
 */
export function resourcesManager(mainWindow: BrowserWindow) {
    setInterval(async () => {
        const sysInfo = await getSystemInfo()
        mainWindow.webContents.send('statistics', sysInfo);
        // console.log(cpuUsage);
    }, POLLING_INTERVAL);
}


function getSystemInfo() {
    return new Promise((resolve) => {
        osUtils.cpuUsage((cpuUsage) => {
            const staticData = getStaticData();
            resolve({ cpuUsage, ...staticData });
        });
    });
}

export function getStaticData() {
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
    }
}

function getMemoryInfo() {
    const memoryUsage = 1 - osUtils.freememPercentage();
    const usedMemory = osUtils.totalmem() * memoryUsage;
    const totalMemory = osUtils.totalmem();
    const freeMemory = totalMemory - usedMemory;
    const freeMemoryPercentage = (freeMemory / totalMemory) * 100;
    return {
        total: `${totalMemory.toFixed(2)} MB`,
        used: `${usedMemory.toFixed(2)} MB (${(memoryUsage * 100).toFixed(2)}%)`,
        free: `${freeMemory.toFixed(2)} MB (${freeMemoryPercentage.toFixed(2)}%)`,
    };
    
}

function getStorageInfo() {
    // requires node 18.0 or higher
    const storagePath = process.platform === "win32" ? 'C://' : '/';
    const stats = fs.statSync(storagePath);
    const total = stats.size;
    const free = fs.statSync(storagePath).blksize * fs.statSync(storagePath).blksize;
    const used = total - free; 
    
    return { total, free, used };
} 