import {
  ipcMain,
  type IpcMainInvokeEvent,
  WebContents,
  WebFrameMain,
} from "electron";
import env from "../utils/env.js";
import { pathToFileURL } from "url";
import { INDEX_PATH } from "../pathResolver.js";
import {
  ArgHandler,
  CondPayload,
  ConResult,
  HandlerInvoke,
  IpcArgHandler,
  IpcHandler,
} from "./types.js";

function handle<K extends string | unknown, P = undefined, I = unknown>(
  key: K extends `${string}` ? K : ApiEventKey,
  // handler: (
  //   // payload?: P extends undefined ? K extends `${string}` ? P : K : P,
  //   payload?: K extends `${string}` ? P extends undefined ? unknown : P : K
  // ) => Promise<ApiEvent[ApiEventKey]> | ApiEvent[ApiEventKey],
  handler: HandlerInvoke<K, P, I>,
) {
  ipcMain.handle(key, async (event, payload) => {
    if (event.senderFrame) {
      validateEventFrame(event.senderFrame);
    }

    return (await handler)(payload);
  });
}

function handler<A, B, C>(
  key: A,
  ipcHandler: IpcArgHandler<A, B, C>,
): IpcHandler<A, B, C> {
  return () => {
    ipcMain.handle(
      String(key),
      async (event: IpcMainInvokeEvent, payload: CondPayload<A, B>) => {
        if (event.senderFrame) validateEventFrame(event.senderFrame);
        return ipcHandler(event, payload);
      },
    );
  };
}

// export function handler<A, B, C>(key: A, handler: IpcArgHandler<A, B, C>): IpcHandler<A, B, C> {
//   ipcMain.handle(key as any, async (event, payload) => {
//     if (event.senderFrame) validateEventFrame(event.senderFrame)
//     return (await handler)(event, payload)
//   });
// }

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
export default { handle, handler };
