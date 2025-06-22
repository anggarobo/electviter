import electron from "electron";

electron.contextBridge.exposeInMainWorld('electron', {
    subscribeStatistics: (callback: (statistics: any) => void) => {
        electron.ipcRenderer.on('statistics', (_, data) => {
            callback(data);
        })
    },
    getStaticData: () => electron.ipcRenderer.invoke('getStaticData'),
})