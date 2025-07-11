import electron, { ipcRenderer, IpcRendererEvent } from "electron";
import ipc from "./ipc/renderer.cjs";

(async () => {
  const platform = await ipc.invoke("platform");
  const pane = await ipc.invoke("pane");
  electron.contextBridge.exposeInMainWorld("api", {
    platform,
    pane,
    ipc: {
      console: function (): void {
        throw new Error("Function not implemented.");
      },
      readdir: async (path) =>
        ipc.invoke<"file:read", string, Dir[]>("file:read", path),
    },
  } satisfies Window["api"]);
})();

export function invoke<Key extends keyof ApiEvent, P = unknown>(
  key: Key,
  payload?: P,
): Promise<ApiEvent[Key]> {
  return electron.ipcRenderer.invoke(key, payload);
}

electron.contextBridge.exposeInMainWorld("electron", {
  subscribeStatistics: (callback) => {
    // electron.ipcRenderer.on('statistics', (_, data) => {
    return ipcOn("statistics", (data) => {
      callback(data);
    });
  },

  // getStaticData: () => electron.ipcRenderer.invoke('getStaticData'),
  getStaticData: () => ipcInvoke("getStaticData"),
  subscribeChangeView: (callback) =>
    ipcOn("changeView", (view) => {
      callback(view);
    }),
  sendFrameWindowAction: (payload) => ipcSend("sendFrameWindowAction", payload),
  // openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  // readFile: (filePath) => ipcRenderer.invoke('file:read', filePath),
  // writeFile: (filePath, content) => ipcRenderer.invoke('file:write', { filePath, content })
} satisfies Window["electron"]);

export function ipcInvoke<Key extends keyof EventPayloadMapping>(
  key: Key,
): Promise<EventPayloadMapping[Key]> {
  return electron.ipcRenderer.invoke(key);
}

export function ipcOn<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void,
) {
  const cb = (_: IpcRendererEvent, payload: EventPayloadMapping[Key]) =>
    callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

export function ipcSend<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key],
) {
  electron.ipcRenderer.send(key, payload);
}
