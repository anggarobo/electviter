import electron, { IpcRendererEvent } from "electron";
import type { InvokeResult, IpcApiEventKey } from "./types";

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

export default { invoke, on, send };
