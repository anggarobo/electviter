import { useCallback } from "react";
import { useAppContext, type HistoryPath } from "../contexts/app";

export default function useEventFile() {
  const { selected, path, setPath, setHistory, setSearch, ...ctx } =
    useAppContext();

  const openFolder = async (content: Dir) => {
    if (content.isDirectory) {
      const pathName =
        path[-1] === "/" ? path + content.name : path + "/" + content.name;
      setPath(pathName);
      setHistory((prev) => {
        const temp: HistoryPath[] = [];
        let stop = false;

        prev.forEach((item) => {
          if (item.isActive) {
            stop = true;
            temp.push({ ...item, isActive: false });
          }
          if (!stop) temp.push({ ...item, isActive: false });
        });

        return [...temp, { path: pathName, isActive: true }];
      });
      setSearch({ input: "", isActive: false });
    }
  };

  const open = useCallback(
    (payload: Dir) => openFolder(payload),
    [selected, path],
  );
  const select = useCallback(
    (payload: Dir[]) => ctx.setSelected(payload),
    [selected, path],
  );
  const onContextMenu = (e: MouseEvent, payload: Dir) => {
    console.log("onContextMenu", payload);
    ctx.setSelected([payload]);
    window.api.ipc.showContextMenu(e, { src: payload.path || "", dest: path });
  };

  return (payload: Dir) => ({
    onDoubleClick: () => open(payload),
    onClick: () => select([payload]),
    onContextMenu: (e: MouseEvent) => onContextMenu(e, payload),
  });
}
