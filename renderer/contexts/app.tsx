import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

export interface OsPath {
  username: string;
  history: string[];
  path: string;
  view: "list" | "icon" | "compact";
  setHistory: React.Dispatch<React.SetStateAction<string[]>>;
  setPath: React.Dispatch<React.SetStateAction<string>>;
  setView: (value: OsPath["view"]) => void;
}

const __VIEW_EXP__ = "__view_exp__";
const VIEW_EXP = localStorage.getItem(__VIEW_EXP__) as OsPath["view"];
const initView: OsPath["view"] = VIEW_EXP || "compact";

const initContext: OsPath = {
  username: "",
  history: [],
  path: "/",
  view: initView,
  setHistory: () => {},
  setPath: () => {},
  setView: () => {},
};

const AppContext = createContext(initContext);
export const useAppContext = () => useContext(AppContext);
export function AppProvider({
  children,
  platform,
}: PropsWithChildren<{ platform: OsPlatform }>) {
  const [path, setPath] = useState(
    [platform.homepath, platform.username].join("/"),
  );
  const [history, setHistory] = useState(initContext.history);
  const [view, setView] = useState(initView);

  const setVewExp = (value: OsPath["view"]) => {
    setView(value);
    localStorage.setItem(__VIEW_EXP__, value);
  };

  return (
    <AppContext.Provider
      value={{
        username: platform.username,
        history,
        path,
        view,
        setHistory,
        setPath,
        setView: setVewExp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
