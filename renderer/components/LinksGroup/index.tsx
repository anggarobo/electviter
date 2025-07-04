
import { useState } from 'react';
import { ChevronRightIcon } from '@heroicons/react/16/solid';
import { Box, Collapse, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import classes from './LinksGroup.module.css';
import type { Icon } from 'renderer/types';

interface LinksGroupProps<I = unknown> {
    icon?: I | Icon;
    label: string;
    initiallyOpened?: boolean;
    links?: { label: string; link: string }[];
}

export default function LinksGroup({ icon: LinkIcon, label, initiallyOpened, links }: LinksGroupProps<Icon>) {
    const hasLinks = Array.isArray(links);
    const [opened, setOpened] = useState(initiallyOpened || false);
    
    const items = (hasLinks ? links : []).map((link) => (
        <Text<'a'>
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
            <UnstyledButton onClick={() => setOpened((o) => !o)} className={classes.control}>
                <Group justify="space-between" gap={0}>
                    { LinkIcon && (
                        <Box style={{ display: 'flex', alignItems: 'center' }}>
                            <ThemeIcon variant="transparent" size={24}>
                                <LinkIcon />
                            </ThemeIcon>
                            <Box ml="md">{label}</Box>
                        </Box>
                    ) }
                    {hasLinks && (
                        <ThemeIcon variant="transparent" size={24}>
                            <ChevronRightIcon style={{ transform: opened ? 'rotate(-90deg)' : 'none' }} />
                        </ThemeIcon>
                    )}
                </Group>
            </UnstyledButton>
            {hasLinks ? <Collapse in={opened}>{items}</Collapse> : null}
        </>
    );
}