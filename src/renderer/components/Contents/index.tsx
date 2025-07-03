import { useEffect, useState } from "react";
import { AppShell, Box, Grid, ThemeIcon, Text, Flex } from "@mantine/core";
// import LinksGroup from "../LinksGroup/index.tsx";
import type { Directory } from "renderer/types/directory";
import { usePathContext } from "app/renderer/contexts/path";
import { FolderIcon, GifIcon, PhotoIcon as ImageIcon, DocumentTextIcon } from "@heroicons/react/24/solid";
import { DocumentCheckIcon, DocumentIcon, PhotoIcon } from "@heroicons/react/24/outline";
import './index.css';
import LinksGroup from "../LinksGroup";

const __icon__: { [key: string]: React.ComponentType<any> } = {
    jpg: ImageIcon,
    png: PhotoIcon,
    webp: PhotoIcon,
    jpeg: ImageIcon,
    gif: GifIcon,
    doc: DocumentTextIcon,
    docx: DocumentTextIcon,
    pdf: DocumentCheckIcon,
    default: DocumentIcon
}

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
            {view === "list" ? (
                <Box>
                    {contents.map((content, i) => (
                        content.isHidden ? null : <LinksGroup key={`${i}__${content.path}`} label={content.name} icon={content.isDirectory ? FolderIcon : DocumentIcon} />
                    ))}
                </Box>
            ) : (
                <Grid>
                    {contents.map((content, i) => {
                        let Icon: React.ElementType = FolderIcon;
                        if (content.isFile) {
                            Icon = __icon__[content?.ext || "default"] || DocumentIcon;
                        }
                        console.log(content)

                        return content.isHidden ? null : (
                            <Grid.Col key={`${i}__${content.path}`} onDoubleClick={() => openFolder(content)} span={view === "icon" ? 2 : 4} >
                                <Flex className="box-content--x" align="center" direction={view === "icon" ? "column" : "row"} >
                                    <ThemeIcon variant="transparent" size={view === "icon" ? 42 : 24}>
                                        <Icon />
                                    </ThemeIcon>
                                    <Box {...(view === "icon" ? { ta: "center" } : {})} w="100%" ml="xs"><Text size="xs" truncate="end" >{content.name}</Text></Box>
                                </Flex>
                            </Grid.Col>
                        )
                    })}
                </Grid>
            )}
        </AppShell.Main>
    )
}