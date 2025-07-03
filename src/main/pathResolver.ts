import path from 'path';
import { app } from 'electron';
import { isDev } from './util.js';

function getPreloadPath() {
    return path.join(
        app.getAppPath(),
        isDev() ? '.' : '..',
        '/dist-main/preload.cjs'
    );
}

function getStaticPath() {
    return path.join(app.getAppPath(), "/dist-ui/index.html")
}

function getAssetPath() {
    return path.join(
        app.getAppPath(),
        isDev() ? '.' : '..',
        '/src/assets'
    ) 
}

export const INDEX_PATH = getStaticPath()
export const PRELOAD_PATH = getPreloadPath();
export const ASSETS_PATH = getAssetPath()