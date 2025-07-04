import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

export interface OsPath {
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
  history: [],
  path: "/home/angga",
  view: initView,
  setHistory: () => {},
  setPath: () => {},
  setView: () => {},
};

const PathContext = createContext(initContext);
export const usePathContext = () => useContext(PathContext);
export function PathProvider({ children }: PropsWithChildren) {
  const [path, setPath] = useState(initContext.path);
  const [history, setHistory] = useState(initContext.history);
  const [view, setView] = useState(initView);

  const setVewExp = (value: OsPath["view"]) => {
    setView(value);
    localStorage.setItem(__VIEW_EXP__, value);
  };

  return (
    <PathContext.Provider
      value={{ history, path, view, setHistory, setPath, setView: setVewExp }}
    >
      {children}
    </PathContext.Provider>
  );
}
