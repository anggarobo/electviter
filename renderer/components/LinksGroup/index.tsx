import { useCallback, useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/16/solid";
import {
  Box,
  Collapse,
  Group,
  Text,
  ThemeIcon,
  UnstyledButton,
  type UnstyledButtonProps,
} from "@mantine/core";
import classes from "./LinksGroup.module.css";
import type { Icon } from "renderer/types";

interface LinksGroupProps<I = unknown> extends UnstyledButtonProps {
  icon?: I | Icon;
  label: string;
  initiallyOpened?: boolean;
  links?: { label: string; link: string }[];
  onClick?: () => void;
  onDoubleClick?: () => void;
  onContextMenu?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
}

export default function LinksGroup({
  className,
  icon: LinkIcon,
  label,
  initiallyOpened,
  links,
  onClick,
  onDoubleClick,
  onContextMenu,
}: LinksGroupProps<Icon>) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);

  const ref = useCallback((ev: HTMLButtonElement) => {
    if (ev) {
      ev.oncontextmenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Context menu clicked");
        onClick?.() ?? setOpened((o) => !o);
      };
    }
  }, []);

  const items = (hasLinks ? links : []).map((link) => (
    <Text<"a">
      component="a"
      className={classes.link}
      href={link.link}
      key={link.label}
      onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </Text>
  ));

  return (
    <>
      <UnstyledButton
        ref={ref}
        onClick={() => onClick?.() ?? setOpened((o) => !o)}
        onDoubleClick={onDoubleClick}
        className={classes.control + " " + className}
        onContextMenu={(e) =>
          onContextMenu?.(e) ?? onClick?.() ?? setOpened((o) => !o)
        }
      >
        <Group justify="space-between" gap={0}>
          {LinkIcon && (
            <Box style={{ display: "flex", alignItems: "center" }}>
              <ThemeIcon variant="transparent" size={24}>
                <LinkIcon />
              </ThemeIcon>
              <Box ml="md">{label}</Box>
            </Box>
          )}
          {hasLinks && (
            <ThemeIcon variant="transparent" size={24}>
              <ChevronRightIcon
                style={{ transform: opened ? "rotate(-90deg)" : "none" }}
              />
            </ThemeIcon>
          )}
        </Group>
      </UnstyledButton>
      {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
    </>
  );
}
