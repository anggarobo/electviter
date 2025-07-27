import { createContext, useContext, type PropsWithChildren } from "react";

export interface HistoryPath {
  path: string;
  isActive: boolean;
}

export interface OsPath {
  os: OsPlatform;
}

const initContext: OsPath = {
  os: {
    homepath: "/",
    isLinux: false,
    isMac: false,
    isWindows: false,
    platform: "linux",
    username: "",
  },
};

const AppContext = createContext(initContext);
export const useAppContext = () => useContext(AppContext);
export function AppProvider({
  children,
  platform,
}: PropsWithChildren<{ platform: OsPlatform }>) {
  return (
    <AppContext.Provider
      value={{
        os: platform,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
