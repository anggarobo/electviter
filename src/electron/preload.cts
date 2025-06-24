import electron, { IpcRendererEvent } from "electron";

electron.contextBridge.exposeInMainWorld('electron', {
    subscribeStatistics: (callback) => {
        // electron.ipcRenderer.on('statistics', (_, data) => {
        return ipcOn('statistics', (data) => {
            callback(data);
        })
    },
    // getStaticData: () => electron.ipcRenderer.invoke('getStaticData'),
    getStaticData: () => ipcInvoke('getStaticData'),
} satisfies Window['electron']);

export function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key,
): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key);
}

export function ipcOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void
) {
    const cb = (_: IpcRendererEvent, payload: EventPayloadMapping[Key]) => callback(payload);
    electron.ipcRenderer.on(key, cb);
    return () => electron.ipcRenderer.off(key, cb);
}