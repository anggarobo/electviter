import { IpcMainInvokeEvent, IpcMain } from "electron";

export type IpcApiEventKey<Y> = Y extends `${string}` ? Y : ApiEventKey;
export type AsyncInvokeResult<T> = Promise<
  ApiEvent[IpcApiEventKey<T> extends ApiEventKey
    ? IpcApiEventKey<T>
    : ApiEventKey]
>;
export type SyncInvokeResult<T> = ApiEvent[IpcApiEventKey<T> extends ApiEventKey
  ? IpcApiEventKey<T>
  : ApiEventKey];
export type InvokeResult<T, R> = T extends ApiEventKey
  ? AsyncInvokeResult<T> | SyncInvokeResult<T>
  : Promise<R> | R;

export type IpcKey<E> = E extends `${string}` ? E : ApiEventKey;
export type IpcCallback<E, P, R = void> = (
  event: IpcMainInvokeEvent,
  payload: E extends `${string}` ? P : E,
) => R | Promise<R>;
export type IpcHandler<E, P, R = never> = (
  key: IpcKey<E>,
  callback: Promise<IpcCallback<E, P, R>> | IpcCallback<E, P, R>,
) => void;
