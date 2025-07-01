type StorageInfo = {
    total: number;
    free: number;
    usage: number;
}

type MemoryInfo = {
    total: number;
    free: number;
    usage: number;
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

type ViewChangeEvent = 'CPU' | 'RAM' | 'STORAGE'
type FrameWindowAction = 'CLOSE' | 'MAXIMIZE' | 'MINIMIZE';

type EventPayloadMapping = {
    statistics: Statistics;
    getStaticData: Omit<Statistics, 'cpuUsage'>;
    changeView: ViewChangeEvent;
    sendFrameWindowAction: FrameWindowAction;
}

type UnsubscribeFunction = () => void;

type OsPlatform = {
    platform: NodeJS.Platform;
    isMac: boolean
    isLinux: boolean
    isWindows: boolean
}

type Dir = {
    name: string
    path: string
    parentPath: string
}

type ApiEvent = {
    platform: OsPlatform,
    dir: Array<Dir>
}

interface Window {
    electron: {
        subscribeStatistics: (callback: (statistics: Statistics) => void) => UnsubscribeFunction;
        getStaticData: () => Promise<Omit<Statistics, 'cpuUsage'>>;
        subscribeChangeView: (callback: (view: ViewChangeEvent) => void) => UnsubscribeFunction;
        sendFrameWindowAction: (action: FrameWindowAction) => void;
    }
    api: {
        ipc: {
            console: () => void
        },
        platform: OsPlatform,
        dir: Array<Dir>
    },
}