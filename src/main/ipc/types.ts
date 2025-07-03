export type IpcApiEventKey<Y> = Y extends `${string}` ? Y : ApiEventKey
export type AsyncInvokeResult<T> = Promise<ApiEvent[IpcApiEventKey<T> extends ApiEventKey ? IpcApiEventKey<T> : ApiEventKey]>
export type SyncInvokeResult<T> = ApiEvent[IpcApiEventKey<T> extends ApiEventKey ? IpcApiEventKey<T> : ApiEventKey]
export type InvokeResult<T, R> = T extends ApiEventKey ? AsyncInvokeResult<T> | SyncInvokeResult<T> : Promise<R> | R
