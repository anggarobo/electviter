import {
    ActionIcon,
    AppShell,
    Burger,
    Group,
    TextInput,
    ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState, type PropsWithChildren } from "react";
import type { Directory } from "./type";
import {
    FolderIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    HomeIcon,
} from "@heroicons/react/24/outline";
import { LinksGroup } from "./LinksGroup";

export default function BasicAppShell({ children }: PropsWithChildren) {
    const [opened, { toggle }] = useDisclosure();
    const [panes, setPanes] = useState<Directory[]>([]);

    useEffect(() => {
        const dir = window.api.dir;
        const directories = dir.map((d) => ({
            ...d,
            icon: FolderIcon,
        }));
        setPanes(directories);
    }, []);

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 240, breakpoint: "xs", collapsed: { mobile: !opened } }}
            padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                    <ActionIcon variant="transparent">
                        <ThemeIcon variant="transparent" size={24}>
                            <ChevronLeftIcon />
                        </ThemeIcon>
                    </ActionIcon>
                    <ActionIcon variant="transparent">
                        <ThemeIcon variant="transparent" size={24}>
                            <ChevronRightIcon />
                        </ThemeIcon>
                    </ActionIcon>
                    <ActionIcon variant="transparent">
                        <ThemeIcon variant="transparent" size={24}>
                            <ChevronLeftIcon style={{ transform: "rotate(90deg)" }} />
                        </ThemeIcon>
                    </ActionIcon>
                    <ActionIcon variant="transparent">
                        <ThemeIcon variant="transparent" size={24}>
                            <HomeIcon />
                        </ThemeIcon>
                    </ActionIcon>
                    <TextInput flex={1} size="sm" radius="md" placeholder="/" />
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="xs">
                {panes.map((pane) => (
                    <LinksGroup key={pane.name} icon={pane.icon} label={pane.name} />
                ))}
            </AppShell.Navbar>
            <AppShell.Main>
                {panes.map((pane) => (
                    <LinksGroup key={pane.name} icon={pane.icon} label={pane.name} />
                ))}
                {children}
            </AppShell.Main>
        </AppShell>
    );
}
