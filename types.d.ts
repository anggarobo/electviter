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
    mode: 'development' | 'production';
}

type EventPayloadMapping = {
    statistics: Statistics;
    getStaticData: Omit<Statistics, 'cpuUsage'>;
}

type UnsubscribeFunction = () => void;

interface Window {
    electron: {
        subscribeStatistics: (callback: (statistics: Statistics) => void) => UnsubscribeFunction;
        getStaticData: () => Promise<Omit<Statistics, 'cpuUsage'>>;
    }
}