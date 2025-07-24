type OsPlatform = {
  platform: Extract<NodeJS.Platform, "win32" | "linux" | "darwin">;
  isMac: boolean;
  isLinux: boolean;
  isWindows: boolean;
  username: string;
  homepath: string;
};

interface SerialApi {
  listPorts: () => Promise<import("serialport").PortInfo[]>;
  connect: (path: string, baudRate?: number) => void;
  onData: (callback: (data: any) => void) => void;
  onStatus: (callback: (data: string) => void) => void;
  sendData: (data: { path: string; data: string }) => void;
  onPortListChanged: (
    callback: (info: {
      added: string[];
      removed: string[];
      current: string[];
    }) => void,
  ) => void;
}
interface Window {
  api: {
    platform: () => Promise<OsPlatform>;
    serial: SerialApi;
  };
}
