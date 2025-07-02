import { useEffect, useState } from "react";
import { AppShell, Box, Grid, ThemeIcon, Text, Flex } from "@mantine/core";
// import LinksGroup from "../LinksGroup/index.tsx";
import type { Directory } from "renderer/types/directory";
import { usePathContext } from "app/renderer/contexts/path";
import { FolderIcon } from "@heroicons/react/24/solid";
import { DocumentIcon } from "@heroicons/react/24/outline";
import './index.css';
import LinksGroup from "../LinksGroup";

export default function Content() {
    const [contents, setContents] = useState<Directory[]>([])
    const { path, setPath, setHistory, view } = usePathContext()

    const openFolder = async (content: Directory) => {
        const pathName = path[-1] === '/' ? path + content.name : path + '/' + content.name
        setPath(pathName)
        setHistory(prev => ([...prev, pathName]))
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
            { view === "list" ? (
                <Box>
                    { contents.map(content => (
                        <LinksGroup key={content.path} label={content.name} icon={content.isDirectory ? FolderIcon : DocumentIcon} />
                    )) }
                </Box>
            ) : (
               <Grid>
                    {contents.map(content => (
                        <Grid.Col onDoubleClick={() => openFolder(content)} key={content.path} span={ view === "icon" ? 2 : 4}>
                            <Flex className="box-content--x" align="center" direction={view === "icon" ? "column" : "row"} >
                                <ThemeIcon variant="transparent" size={view === "icon" ? 42 : 24}>
                                    {/* <Icon size={18} /> */}
                                    {content.isDirectory ? <FolderIcon /> : <DocumentIcon />}
                                </ThemeIcon>
                                <Box w="100%" ml="xs"><Text size="xs" ta="center" truncate="end" >{content.name}</Text></Box>
                            </Flex>
                        </Grid.Col>
                    ))}
                </Grid> 
            ) }
        </AppShell.Main>
    )
}