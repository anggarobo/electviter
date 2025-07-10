import { AppShell } from "@mantine/core";
import { useEffect, useState } from "react";
import type { Icon } from "renderer/types";
import LinksGroup from "../LinksGroup";
import { FolderIcon } from "@heroicons/react/24/outline";
import { useAppContext, type HistoryPath } from "../../contexts/app";

export default function () {
  const [items, setItems] = useState<Dir<string, Icon>[]>([]);
  const { setPath, setSearch, setHistory } = useAppContext();

  const onNavigate = (path: string) => {
    setPath(path);
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

      return [...temp, { path, isActive: true }];
    });
    setSearch({ input: "", isActive: false });
  };

  useEffect(() => {
    const pane = window?.api?.pane;
    if (pane) {
      const directories = pane.map((item) => ({
        ...item,
        icon: FolderIcon,
      }));
      setItems(directories);
    }
  }, []);

  return (
    <AppShell.Navbar p="xs">
      {items.map((item) => (
        <LinksGroup
          key={item.name}
          icon={item.icon}
          label={item.name}
          onClick={() => item?.path && onNavigate(item.path)}
        />
      ))}
    </AppShell.Navbar>
  );
}
