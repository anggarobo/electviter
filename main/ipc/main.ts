import { ipcMain, WebContents, WebFrameMain } from "electron";
import env from "../utils/env.js";
import { pathToFileURL } from "url";
import { INDEX_PATH } from "../pathResolver.js";

function handle<K extends string | unknown, P = undefined>(
  key: K extends `${string}` ? K : ApiEventKey,
  handler: (
    payload?: P extends undefined ? string : P,
  ) => Promise<ApiEvent[ApiEventKey]> | ApiEvent[ApiEventKey],
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

function send<Key extends keyof EventPayloadMapping>(
  key: Key,
  webContents: WebContents,
  payload: EventPayloadMapping[Key],
) {
  webContents.send(key, payload);
}

function on<Key extends keyof EventPayloadMapping>(
  key: Key,
  handler: (payload: EventPayloadMapping[Key]) => void,
) {
  ipcMain.on(key, (event, payload) => {
    if (event.senderFrame) {
      validateEventFrame(event.senderFrame);
    }
    return handler(payload);
  });
}

export const electron = { on, send };
export default { handle };
