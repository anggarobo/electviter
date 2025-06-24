import path from 'path';
import { app } from 'electron';
import { isDev } from './util.js';

function getPreloadPath() {
    return path.join(
        app.getAppPath(),
        isDev() ? '.' : '..',
        '/dist-electron/preload.cjs'
    );
}

function getStaticPath() {
    return path.join(app.getAppPath(), "/dist-react/index.html")
}


export const INDEX_PATH = getStaticPath()
export const PRELOAD_PATH = getPreloadPath();
export const ASSETS_PATH = (() => {
    return path.join(
        app.getAppPath(),
        isDev() ? '.' : '..',
        '/src/assets'
    )
})()