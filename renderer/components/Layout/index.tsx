import { AppShell } from "@mantine/core";
import Content from "../Contents/index.tsx";
import Pane from "../Pane/index.tsx";
import Toolbar from "../Toolbar/index.tsx";
import { useDisclosure } from "@mantine/hooks";

export default function Layout() {
  const [opened, handler] = useDisclosure();

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
