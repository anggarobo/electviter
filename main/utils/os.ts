const platform: OsPlatform = {
    platform: process.platform as OsPlatform["platform"],
    isMac: process.platform === 'darwin',
    isWindows: process.platform === 'win32',
    isLinux: process.platform === 'linux',
}

export default { ...platform }


// export default function osx() {
//     apiIpcMainHandle("platform", () => os)
// }