import { useEffect } from "react";
import { useAppContext } from "../contexts/app";

export default function useContextMenu() {
  const { path, selected, setSelected } = useAppContext();
  // TODO: Fix ShowContextMenu
  // - Fix the context menu to show when folders/files are selected
  // - If a non-folder/file area is clicked, deselect all. If right-clicked on a specific item, show context menu with relevant options (e.g., Copy, Paste only)
  useEffect(() => {
    const contextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const content = document.getElementById("id-context-menu-layout");
      if (content) {
        if (!content.contains(target)) {
          e.preventDefault();
          e.stopPropagation();
          window.api.ipc.showContextMenu(e, "close");
        }
      }
    };

    window.addEventListener("contextmenu", contextMenu);

    return () => window.removeEventListener("contextmenu", contextMenu);
  }, [selected, path]);
}
