import { useEffect, useState } from "react";
import { AppShell, Box, Grid, ThemeIcon, Text } from "@mantine/core";
// import LinksGroup from "../LinksGroup/index.tsx";
import type { Directory } from "renderer/types/directory";
import { usePathContext } from "app/renderer/contexts/path";
import { FolderIcon } from "@heroicons/react/24/solid";
import { DocumentIcon } from "@heroicons/react/24/outline";
import './index.css';

export default function Content() {
    const [contents, setContents] = useState<Directory[]>([])
    const { path, setPath } = usePathContext()

    const openFolder = async (content: Directory) => {
        const pathName = path[-1] === '/' ? path + content.name : path + '/' + content.name
        setPath(pathName)
    }
    
    useEffect(() => {
        const channel = async () => {
            setContents([])
            const response = await window.api.ipc.openFolder(path)
            setContents(response)
        }
        
        channel()
    }, [path])
    
    return (
        <AppShell.Main>
            <Grid>
                {contents.map(content => (
                    <Grid.Col onDoubleClick={() => openFolder(content)} key={content.path} span={3}>
                        <Box className="box-content--x" style={{ display: 'flex', alignItems: 'center' }}>
                            <ThemeIcon variant="transparent" size={24}>
                                {/* <Icon size={18} /> */}
                                {content.isDirectory ? <FolderIcon /> : <DocumentIcon />}
                            </ThemeIcon>
                            <Box ml="xs"><Text size="xs">{content.name}</Text></Box>
                        </Box>
                    </Grid.Col>
                ))}
            </Grid>
            {/* { contents.map(content => (
                <LinksGroup key={content.path} label={content.name} icon={content.isDirectory ? FolderIcon : DocumentIcon} />
            )) } */}
        </AppShell.Main>
    )
}