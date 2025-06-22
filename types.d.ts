type StorageInfo = {
    total: number;
    free: number;
    used: number;
}

type MemoryInfo = {
    total: string;
    free: string;
    used: string;
}

type Statistics = {
    cpuUsage: number;
    cpuModel: string;
    platform: NodeJS.Platform;
    arch: string;
    hostname: string;
    storage: StorageInfo;
    memory: MemoryInfo;
    uptime: number;
}

type EventPayloadMapping = {
    statistics: Statistics;
    getStaticData: Omit<Statistics, 'cpuUsage'>;
}

interface Window {
    electron: {
        subscribeStatistics: (callback: (statistics: Statistics) => void) => void;
        getStaticData: () => Promise<Omit<Statistics, 'cpuUsage'>>;
    }
}