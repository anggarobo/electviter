import electron from "electron";

electron.contextBridge.exposeInMainWorld('electron', {
    subscribeStatistics: (callback: (statistics: Statistics) => void) => {
        electron.ipcRenderer.on('statistics', (_, data) => {
            callback(data);
        })
    },
    getStaticData: () => electron.ipcRenderer.invoke('getStaticData'),
})