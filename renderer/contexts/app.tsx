import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

interface HistoryPath {
  path: string;
  isActive: boolean;
}

export interface OsPath {
  username: string;
  history: HistoryPath[];
  path: string;
  selected: Dir<string>[];
  search: {
    input: string;
    isActive: boolean;
  };
  view: "list" | "icon" | "compact";
  setHistory: React.Dispatch<React.SetStateAction<HistoryPath[]>>;
  setPath: React.Dispatch<React.SetStateAction<string>>;
  setSearch: React.Dispatch<React.SetStateAction<OsPath["search"]>>;
  setSelected: React.Dispatch<React.SetStateAction<Dir[]>>;
  setView: (value: OsPath["view"]) => void;
}

const __VIEW_EXP__ = "__view_exp__";
const VIEW_EXP = localStorage.getItem(__VIEW_EXP__) as OsPath["view"];
const initView: OsPath["view"] = VIEW_EXP || "compact";

const initContext: OsPath = {
  username: "",
  history: [],
  path: "/",
  selected: [],
  search: { input: "", isActive: false },
  view: initView,
  setHistory: () => {},
  setPath: () => {},
  setSearch: () => {},
  setSelected: () => {},
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
  const [history, setHistory] = useState<HistoryPath[]>([
    { path: [platform.homepath, platform.username].join("/"), isActive: true },
  ]);
  const [selected, setSelected] = useState(initContext.selected);
  const [search, setSearch] = useState(initContext.search);
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
        search,
        selected,
        view,
        setHistory,
        setPath,
        setSearch,
        setSelected,
        setView: setVewExp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
