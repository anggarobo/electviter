import path from "path";
import { app } from "electron";
import env from "./utils/env.js";

function getPreloadPath() {
  return path.join(
    app.getAppPath(),
    env.isDev ? "." : "..",
    "/dist-main/preload.cjs",
  );
}

function getStaticPath() {
  return path.join(app.getAppPath(), "/dist-ui/index.html");
}

function getAssetPath() {
  return path.join(app.getAppPath(), env.isDev ? "." : "..", "/assets");
}

export const INDEX_PATH = getStaticPath();
export const PRELOAD_PATH = getPreloadPath();
export const ASSETS_PATH = getAssetPath();
