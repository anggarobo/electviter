import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import {
  ActionIcon,
  AppShell,
  Burger,
  Combobox,
  Flex,
  FocusTrap,
  Group,
  TextInput,
  ThemeIcon,
  useCombobox,
} from "@mantine/core";
import type { UseDisclosureReturnValue } from "@mantine/hooks";
import { useAppContext, type OsPath } from "../../contexts/app";
import { useState } from "react";

export default function ({
  disclosure,
}: {
  disclosure: UseDisclosureReturnValue;
}) {
  const { path, setPath, history, setView, view, ...ctx } = useAppContext();
  const [opened, { toggle }] = disclosure;
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [dirPath, setDirPath] = useState("");

  const views: OsPath["view"][] = ["icon", "list", "compact"];
  const viewIcons: Record<string, React.ElementType> = {
    list: ListBulletIcon,
    icon: Squares2X2Icon,
    compact: TableCellsIcon,
  };
  const ViewIcon = viewIcons[view as keyof typeof viewIcons];

  const options = views.map((item) => {
    const Icon = viewIcons[item as keyof typeof viewIcons];
    return (
      <Combobox.Option value={item} key={item}>
        <Flex gap={4} align="center">
          <ThemeIcon variant="transparent" size={18}>
            <Icon />
          </ThemeIcon>
          {item[0].toUpperCase() + item.slice(1)}
        </Flex>
      </Combobox.Option>
    );
  });

  const onDirChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setDirPath(e.currentTarget.value);
  };

  const onActivateSearch: React.MouseEventHandler<HTMLButtonElement> = () => {
    ctx.setSearch((prev) => ({
      input: "",
      isActive: !prev.isActive,
    }));
  };

  const onSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    ctx.setSearch((prev) => ({ ...prev, input: e.target.value }));
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setPath(dirPath);
    setDirPath("");
  };

  const onBack = () => {
    const f = history.indexOf(path);
    setPath(history[f - 1]);
  };

  return (
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
        {ctx.search.isActive ? (
          <FocusTrap active>
            <TextInput
              flex={1}
              size="sm"
              radius="md"
              value={ctx.search.input}
              onChange={onSearch}
            />
          </FocusTrap>
        ) : (
          <form onSubmit={onSubmit} style={{ flex: 1 }}>
            <TextInput
              size="sm"
              radius="md"
              value={dirPath || path}
              onChange={onDirChange}
            />
          </form>
        )}
        <ActionIcon onClick={onActivateSearch} variant="transparent">
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
            <ActionIcon
              onClick={() => combobox.toggleDropdown()}
              variant="transparent"
            >
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
  );
}
