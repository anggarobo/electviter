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
import {
  useAppContext,
  type HistoryPath,
  type OsPath,
} from "../../contexts/app";
import { useMemo, useState } from "react";

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

  const toggleSearch: React.MouseEventHandler<HTMLButtonElement> = () => {
    ctx.setSearch((prev) => ({
      input: "",
      isActive: !prev.isActive,
    }));
  };

  const onSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    ctx.setSearch((prev) => ({ ...prev, input: e.target.value }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPath(dirPath);
    setDirPath("");
    ctx.setHistory((prev) => {
      const currId = prev.findIndex((item) => item.path === dirPath);
      const next = currId < 0 ? [{ path: dirPath, isActive: true }] : [];
      const temp = prev.map((item, id) => {
        if (id === currId) return { ...item, isActive: true };
        return { ...item, isActive: false };
      });
      return [...temp, ...next];
    });
  };

  const disable = useMemo(() => {
    const current = history.findIndex((item) => item.isActive);
    return {
      undo: current === 0,
      redo: current === history.length - 1,
      parent: ctx.os.isWindows ? path === ctx.os.homepath : path === "/",
    };
  }, [path, history]);

  const onChangeParentPath = () => {
    ctx.setSearch({ input: "", isActive: false });
    const defaultPath = ctx.os.isWindows ? ctx.os.homepath : "/";
    const parentPath = path.split("/").slice(0, -1).join("/") || defaultPath;
    setPath(parentPath);
    ctx.setHistory((prev) => {
      const temp: HistoryPath[] = [];
      let next = true;

      prev.forEach((item) => {
        if (item.isActive) {
          next = false;
          temp.push({ ...item, isActive: false });
        }
        if (next) temp.push({ ...item, isActive: false });
      });

      return [...temp, { path: parentPath, isActive: true }];
    });
  };

  const onHistoryPath = (event: "undo" | "redo") => {
    ctx.setSearch({ input: "", isActive: false });
    ctx.setHistory((prev) => {
      let currentId = prev.findIndex((item) => item.isActive);
      const nextId = event === "undo" ? currentId - 1 : currentId + 1;
      const next = prev[nextId];
      setPath(next.path);

      return prev.map((item, index) => {
        if (item.isActive) return { ...item, isActive: false };
        if (index === nextId) return { ...item, isActive: true };
        return item;
      });
    });
  };

  return (
    <AppShell.Header>
      <Group h="100%" px="md">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <ActionIcon
          disabled={disable.undo}
          onClick={() => onHistoryPath("undo")}
          variant="transparent"
        >
          <ThemeIcon variant="transparent" size={24}>
            <ChevronLeftIcon />
          </ThemeIcon>
        </ActionIcon>
        <ActionIcon
          disabled={disable.redo}
          onClick={() => onHistoryPath("redo")}
          variant="transparent"
        >
          <ThemeIcon variant="transparent" size={24}>
            <ChevronRightIcon />
          </ThemeIcon>
        </ActionIcon>
        <ActionIcon
          disabled={disable.parent}
          onClick={onChangeParentPath}
          variant="transparent"
        >
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
        <ActionIcon onClick={toggleSearch} variant="transparent">
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
