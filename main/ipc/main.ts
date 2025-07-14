import { ipcMain, WebContents, WebFrameMain } from "electron";
import env from "../utils/env.js";
import { pathToFileURL } from "url";
import { INDEX_PATH } from "../pathResolver.js";
import { IpcCallback, IpcHandler, IpcKey } from "./types.js";

/**
 * Registers an IPC handler for a specific key. The handler function can be either
 * synchronous or an async function returned by a Promise. When an IPC message
 * is received with the specified key, the provided callback will be executed.
 *
 * @template K - The type of the IPC key.
 * @template P - The type of the payload sent with the IPC message.
 * @template R - The type of the response returned by the callback. Defaults to unknown.
 *
 * @param {IpcKey<K>} key - The unique identifier used to register and listen for a specific IPC channel.
 * @param {IpcCallback<K, P, R> | Promise<IpcCallback<K, P, R>>} callback - The handler function (or a Promise resolving to it)
 *        that will be invoked when a message is received on the specified IPC channel.
 */
function handle<K, P, R = unknown>(
  key: IpcKey<K>,
  callback: IpcCallback<K, P, R> | Promise<IpcCallback<K, P, R>>,
) {
  ipcMain.handle(key, async (event, payload) => {
    if (event.senderFrame) validateEventFrame(event.senderFrame);
    const invoke = await callback;
    return invoke(event, payload);
  });
}

/**
 * Registers an IPC listener for a specific key. The listener function can be either
 * synchronous or an async function returned by a Promise. When an IPC message
 * is received with the specified key, the provided callback will be executed.
 *
 * @template K - The type of the IPC key.
 * @template P - The type of the payload sent with the IPC message.
 * @template R - The type of the response returned by the callback. Defaults to unknown.
 *
 * @param {IpcKey<K>} key - The unique identifier used to register and listen for a specific IPC channel.
 * @param {IpcCallback<K, P, R> | Promise<IpcCallback<K, P, R>>} callback - The listener function (or a Promise resolving to it)
 *        that will be invoked when a message is received on the specified IPC channel.
 */
function on<K, P, R = unknown>(
  key: IpcKey<K>,
  callback: IpcCallback<K, P, R> | Promise<IpcCallback<K, P, R>>,
) {
  ipcMain.on(key, async (event, payload) => {
    if (event.senderFrame) validateEventFrame(event.senderFrame);
    const invoke = await callback;
    return invoke(event, payload);
  });
}

/**
 * Validates the source of an IPC event to ensure it originates from a trusted frame.
 * In development, it allows requests from localhost; in production, it ensures the URL
 * matches the expected `file://` path to the app's index file.
 *
 * @param {WebFrameMain} frame - The frame from which the IPC event originated.
 *        This is used to inspect the URL and determine if the source is trusted.
 *
 * @throws {Error} Throws an error if the frame URL is considered potentially malicious.
 */
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

// function on<Key extends keyof EventPayloadMapping>(
//   key: Key,
//   handler: (payload: EventPayloadMapping[Key]) => void,
// ) {
//   ipcMain.on(key, (event, payload) => {
//     if (event.senderFrame) {
//       validateEventFrame(event.senderFrame);
//     }
//     return handler(payload);
//   });
// }

export const electron = { on, send };
export default { handle, on };
