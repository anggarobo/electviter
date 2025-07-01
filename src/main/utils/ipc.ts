import { ipcMain, WebContents, WebFrameMain } from "electron";
import env from "./env.js";
import { pathToFileURL } from "url";
import { INDEX_PATH } from "../pathResolver.js";

export function apiIpcMainHandle<Key extends keyof ApiEvent, P = unknown>(
  key: Key,
  handler: (payload?: P) => ApiEvent[Key]
) {
  ipcMain.handle(key, (event, payload) => {
    if (event.senderFrame) {
      validateEventFrame(event.senderFrame);
    }
    return handler(payload);
  });
}

// This function validates the event frame to ensure it is safe and not malicious.
export function validateEventFrame(frame: WebFrameMain) {
  if (env.isDev && new URL(frame.url).host === "localhost:5777") {
    return;
  }
  if (frame.url !== pathToFileURL(INDEX_PATH).toString()) {
    throw new Error("Malicious event");
  }
}
