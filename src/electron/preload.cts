import electron from "electron";

electron.contextBridge.exposeInMainWorld('electron', {
    subscribeStatistics: (callback: (statistics: Statistics) => void) => {
        // electron.ipcRenderer.on('statistics', (_, data) => {
        ipcOn('statistics', (data) => {
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
    electron.ipcRenderer.on(key, (_, payload) => callback(payload));
}