import { useCallback } from "react";
import { AppShell } from "@mantine/core";
import Content from "../Contents/index.tsx";
import Pane from "../Pane/index.tsx";
import Toolbar from "../Toolbar/index.tsx";
import { useDisclosure } from "@mantine/hooks";
import { useAppContext } from "../../contexts/app.tsx";
import useContextMenu from "../../hooks/useContextMenu.ts";

export default function Layout() {
  const [opened, handler] = useDisclosure();
  const { setSelected, selected, path } = useAppContext();
  useContextMenu();
  console.log(selected);

  const ref = useCallback(
    (ev: HTMLDivElement) => {
      if (ev) {
        ev.onclick = () => {
          setSelected([]);
        };
        ev.oncontextmenu = (e) => {
          const target = e.target as HTMLElement;
          const content = document.getElementById("id-context-menu-layout");
          if (content && content.contains(target)) {
            // TODO: Fix ShowContextMenu
            // - Fix the context menu to show when folders/files are selected
            // - If a non-folder/file area is clicked, deselect all. If right-click
            // console.log("target", selected, path);
            //   e.preventDefault();
            //   e.stopPropagation();
            //   window.api.ipc.showContextMenu({ src: selected[0]?.path || "", dest: path });
          }
        };
      }
    },
    [selected, path],
  );

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: "xs", collapsed: { mobile: !opened } }}
      padding="md"
      ref={ref}
    >
      <Toolbar disclosure={[opened, handler]} />
      <Pane />
      <Content />
    </AppShell>
  );
}
