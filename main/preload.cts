import electron, { IpcRendererEvent } from "electron";
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
      showContextMenu: (event, payload) => {
        let contract = payload;
        if (payload === "close") contract = payload;
        else {
          contract = {
            dest: payload?.dest || "",
            src: payload?.src || "",
            event,
          };
        }
        ipc.invoke<"show-context-menu", ContextMenuPayload | "close">(
          "show-context-menu",
          contract,
        );
      },
      closeContextMenu: () => ipc.invoke("close-context-menu"),
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
