import {
    ActionIcon,
    AppShell,
    Burger,
    Combobox,
    Flex,
    Group,
    TextInput,
    ThemeIcon,
    useCombobox,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    HomeIcon,
    ListBulletIcon,
    Squares2X2Icon,
    TableCellsIcon,
    MagnifyingGlassIcon,
    FolderIcon
} from "@heroicons/react/24/outline";
import LinksGroup from "../LinksGroup/index.tsx";
import { usePathContext, type OsPath } from "../../contexts/path.tsx";
import Content from "../Contents";
import type { Icon } from "../../types/index.ts";

export default function BasicAppShell() {
    const [opened, { toggle }] = useDisclosure();
    const [panes, setPanes] = useState<Dir<string, Icon>[]>([]);
    const { path, setPath, history, setView, view } = usePathContext()
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const views: OsPath["view"][] = ['icon', 'list', 'compact'];
    const viewIcons: Record<string, React.ElementType> = {
        list: ListBulletIcon,
        icon: Squares2X2Icon,
        compact: TableCellsIcon
    }
    const ViewIcon = viewIcons[view as keyof typeof viewIcons];
    
    const options = views.map((item) => {
        const Icon = viewIcons[item as keyof typeof viewIcons];
        return (
            <Combobox.Option value={item} key={item}>
                <Flex gap={4} align="center" >
                    <ThemeIcon variant="transparent" size={18}>
                        <Icon />
                    </ThemeIcon>
                    {item[0].toUpperCase() + item.slice(1)}
                </Flex>
            </Combobox.Option>
        )
    });

    const onBack = () => {
        const f = history.indexOf(path)
        setPath(history[f - 1])
    }

    useEffect(() => {
        const pane = window?.api?.pane
        if (pane) {
            const directories = pane.map((item) => ({
                ...item,
                icon: FolderIcon,
            }));
            setPanes(directories);
        }
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
                    <ActionIcon onClick={onBack} variant="transparent">
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
                    <ActionIcon onClick={() => setPath("/home")} variant="transparent">
                        <ThemeIcon variant="transparent" size={24}>
                            <HomeIcon />
                        </ThemeIcon>
                    </ActionIcon>
                    <TextInput flex={1} size="sm" radius="md" value={path} onChange={(e) => {
                        setPath(e.currentTarget.value)
                    }} />
                    <ActionIcon variant="transparent">
                        <ThemeIcon variant="transparent" size={24}>
                            <MagnifyingGlassIcon />
                        </ThemeIcon>
                    </ActionIcon>
                    <Combobox
                        store={combobox}
                        width={120}
                        position="bottom-end"
                        withArrow={false}
                        onOptionSubmit={(val) => {
                            setView(val as OsPath["view"]);
                            combobox.closeDropdown();
                        }}
                    >
                        <Combobox.Target>
                            <ActionIcon onClick={() => combobox.toggleDropdown()} variant="transparent">
                                <ThemeIcon variant="transparent" size={24}>
                                    <ViewIcon />
                                </ThemeIcon>
                            </ActionIcon>
                        </Combobox.Target>

                        <Combobox.Dropdown>
                            <Combobox.Options>{options}</Combobox.Options>
                        </Combobox.Dropdown>
                    </Combobox>
                    
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="xs">
                {panes.map((pane) => (
                    <LinksGroup key={pane.name} icon={pane.icon} label={pane.name} />
                ))}
            </AppShell.Navbar>
            <Content />
        </AppShell>
    );
}
