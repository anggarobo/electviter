type StorageInfo = {
  total: number;
  free: number;
  usage: number;
};

type MemoryInfo = {
  total: number;
  free: number;
  usage: number;
};

type Statistics = {
  cpuUsage: number;
  cpuModel: string;
  platform: NodeJS.Platform;
  arch: string;
  hostname: string;
  storage: StorageInfo;
  memory: MemoryInfo;
  uptime: number;
  mode: "development" | "production";
};

type ViewChangeEvent = "CPU" | "RAM" | "STORAGE";
type FrameWindowAction = "CLOSE" | "MAXIMIZE" | "MINIMIZE";

type EventPayloadMapping = {
  statistics: Statistics;
  getStaticData: Omit<Statistics, "cpuUsage">;
  changeView: ViewChangeEvent;
  sendFrameWindowAction: FrameWindowAction;
};

type UnsubscribeFunction = () => void;

type OsPlatform = {
  platform: Extract<NodeJS.Platform, "win32" | "linux" | "darwin">;
  isMac: boolean;
  isLinux: boolean;
  isWindows: boolean;
  username: string;
  homepath: string;
};

type Dir<N = unknown, I = unknown> = {
  isFile: boolean;
  isDirectory: boolean;
  isBlockDevice: boolean;
  isCharacterDevice: boolean;
  isSymbolicLink: boolean;
  isFIFO: boolean;
  isSocket: boolean;
  name: N | Name | string;
  parentPath?: string;
  path?: string;
  size?: number;
  ext?: string;
  isHidden?: boolean;
  image?: ISizeCalculationResult;
  icon?: I;
};

type ApiEvent<K extends string = unknown, V = unknown> = {
  platform: OsPlatform;
  pane: Dir[];
  openFile: Dir[];
  [key in K]: V;
};

type ContextMenuPayload = {
  src: string;
  dest: string;
};

type ApiEventKey<K = unknown, V = unknown> = keyof ApiEvent<K, V>;

interface SerialApi {
  listPorts: () => Promise<import("serialport").PortInfo[]>;
  connect: (path: string, baudRate?: number) => void;
  onData: (callback: (data: string) => void) => void;
  onStatus: (callback: (data: string) => void) => void;
  sendData: (data: string) => void;
}
interface Window {
  electron: {
    subscribeStatistics: (
      callback: (statistics: Statistics) => void,
    ) => UnsubscribeFunction;
    getStaticData: () => Promise<Omit<Statistics, "cpuUsage">>;
    subscribeChangeView: (
      callback: (view: ViewChangeEvent) => void,
    ) => UnsubscribeFunction;
    sendFrameWindowAction: (action: FrameWindowAction) => void;
  };
  api: {
    ipc: {
      console: () => void;
      readdir: (path: string) => Promise<Dir[] | undefined>;
      showContextMenu: (payload?: ContextMenuPayload) => void;
    };
    platform: OsPlatform;
    pane: Dir[];
    serial: SerialApi;
    virtualTcp: {
      connect: (host: string, port: number) => void;
      sendData: (data: string) => void;
      disconnect: () => void;
      onData: (callback: (data: string) => void) => void;
    };
  };
}
