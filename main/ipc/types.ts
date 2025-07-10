import { IpcMainInvokeEvent } from "electron";

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
export type SyncHandlerInvoke<K, P, I> = (
  payload?: K extends `${string}` ? (P extends undefined ? unknown : P) : K,
) => I | Promise<ApiEvent[ApiEventKey]> | ApiEvent[ApiEventKey];
export type HandlerInvokeWithEvent<K, P, I> = (
  event: IpcMainInvokeEvent,
  payload?: K extends `${string}` ? (P extends undefined ? unknown : P) : K,
) => Promise<SyncHandlerInvoke<K, P, I>> | SyncHandlerInvoke<K, P, I>;
export type HandlerInvoke<K, P, I> =
  | Promise<HandlerInvokeWithEvent<K, P, I>>
  | HandlerInvokeWithEvent<K, P, I>;

export type ArgHandler<S, T> = (
  event: IpcMainInvokeEvent,
  payload: S,
) => T extends undefined ? void : T | Promise<T>;

export type IpcArgHandler<E, F, G> = ArgHandler<
  CondPayload<E, F>,
  ConResult<F, G>
>;

export type CondPayload<E, F> = E extends `${string}` ? F : F | E;
// export type CondPayload<E, F> = F extends undefined ? E extends `${string}` ? any : E : F

export type ConResult<L, M> = M extends undefined
  ? L extends undefined
    ? void
    : L
  : M;

export type IpcHandler<E, F, G> = (
  key: IpcApiEventKey<E>,
  handler: IpcArgHandler<E, F, G>,
) => void;
