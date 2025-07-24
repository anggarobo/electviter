import electron, { ipcRenderer, IpcRendererEvent } from "electron";
import type { InvokeResult, IpcApiEventKey } from "./ipc/types";

(async () => {
  const ipc = { invoke, on, send };
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
      showContextMenu: (payload) => {
        void ipc.invoke<"show-context-menu", ContextMenuPayload>(
          "show-context-menu",
          payload,
        );
      },
    },
    serial: {
      // listPorts: () => ipcRenderer.invoke("serial-listPorts"),
      connect: (path: string, baudRate: number = 9600) => {
        return ipcRenderer.invoke("serial-connect", path, baudRate).then(() => {
          ipcRenderer.invoke("serial-setupEvents");
        });
      },
      listPorts: () => ipcRenderer.invoke("serial-list"),
      // Kirim data ke serial port via main process
      sendData: (data: string) => ipcRenderer.send("serial-send", data),
      onData: (callback: (info: { path: string; data: string }) => void) =>
        ipcRenderer.on("serial-data", (_e, info) => callback(info)),
      // onData: (callback: (data: string) => void) =>
      //   ipcRenderer.on("serial-data", (_, data) => callback(data)),
      onStatus: (callback: (status: string) => void) =>
        ipcRenderer.on("serial-status", (_, status) => callback(status)),
      onPortListChanged: (
        callback: (info: {
          added: string[];
          removed: string[];
          current: string[];
        }) => void,
      ) => ipcRenderer.on("serial-ports-updated", (_e, info) => callback(info)),
    },
    virtualTcp: {
      connect: (host: string, port: number) =>
        ipcRenderer.send("serial-connect", host, port),
      sendData: (data: string) => ipcRenderer.send("serial-sendData", data),
      disconnect: () => ipcRenderer.send("serial-disconnect"),
      onData: (callback: (data: string) => void) =>
        ipcRenderer.on("serial-onData", (_event, data: string) => {
          callback(data);
        }),
    },
  } satisfies Window["api"]);
})();

function invoke<K extends string | unknown, P = undefined, R = unknown>(
  key: IpcApiEventKey<K>,
  payload?: P extends undefined ? string : P,
): InvokeResult<K, R> {
  return electron.ipcRenderer.invoke(key, payload) as InvokeResult<K, R>;
}

function on<Key extends keyof EventPayloadMapping>(
  key: Key,
  callback: (payload: EventPayloadMapping[Key]) => void,
) {
  const cb = (_: IpcRendererEvent, payload: EventPayloadMapping[Key]) =>
    callback(payload);
  electron.ipcRenderer.on(key, cb);
  return () => electron.ipcRenderer.off(key, cb);
}

function send<Key extends keyof EventPayloadMapping>(
  key: Key,
  payload: EventPayloadMapping[Key],
) {
  electron.ipcRenderer.send(key, payload);
}
