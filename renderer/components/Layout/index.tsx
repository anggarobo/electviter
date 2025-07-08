import { AppShell } from "@mantine/core";
import Content from "../Contents/index.tsx";
import Pane from "../Pane/index.tsx";
import Toolbar from "../Toolbar/index.tsx";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import { useAppContext } from "../../contexts/app.tsx";

export default function Layout() {
  const [opened, handler] = useDisclosure();
  const { selected, path } = useAppContext();

  useEffect(() => {
    const contextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const content = document.getElementById("id-context-menu-layout");
      if (content && content.contains(target)) {
        e.preventDefault();
        if (selected[0].path) {
          window.api.ipc.showContextMenu({ src: selected[0].path, dest: path });
        }
      } else {
        console.log("Right-clicked outside target — do nothing");
      }
    };

    window.addEventListener("contextmenu", contextMenu);

    return () => window.removeEventListener("contextmenu", contextMenu);
  }, [selected, path]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 240, breakpoint: "xs", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <Toolbar disclosure={[opened, handler]} />
      <Pane />
      <Content />
    </AppShell>
  );
}
