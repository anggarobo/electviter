import { useEffect, useMemo, useState } from "react";
import {
  AppShell,
  Box,
  Grid,
  ThemeIcon,
  Text,
  Flex,
  LoadingOverlay,
} from "@mantine/core";
import { useAppContext } from "../../contexts/app";
import {
  FolderIcon,
  GifIcon,
  PhotoIcon as ImageIcon,
} from "@heroicons/react/24/solid";
import {
  DocumentCheckIcon,
  DocumentIcon,
  PhotoIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import "./index.css";
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
  default: DocumentIcon,
};

export default function Content() {
  const [isLoading, setIsLoading] = useState(false);
  const [contents, setContents] = useState<Dir[]>([]);
  const { path, setPath, setHistory, view, search } = useAppContext();

  const files = useMemo(() => {
    return contents.filter((item) =>
      item?.name?.toLowerCase()?.includes(search.input.toLowerCase()),
    );
  }, [search, contents]);

  const openFolder = async (content: Dir) => {
    const pathName =
      path[-1] === "/" ? path + content.name : path + "/" + content.name;
    setPath(pathName);
    setHistory((prev) => [...prev, pathName]);
  };

  useEffect(() => {
    const channel = async () => {
      setIsLoading(true);
      try {
        setContents([]);
        const response = await window.api.ipc.readdir(path);
        setContents(response || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    channel();
  }, [path]);

  return (
    <AppShell.Main>
      {isLoading ? (
        <LoadingOverlay
          visible
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "royalblue", type: "bars" }}
        />
      ) : view === "list" ? (
        <Box>
          {files.map((content, i) =>
            content.isHidden ? null : (
              <LinksGroup
                key={`${i}__${content.path}`}
                label={content.name}
                icon={content.isDirectory ? FolderIcon : DocumentIcon}
              />
            ),
          )}
        </Box>
      ) : (
        <Grid>
          {files.map((content, i) => {
            let Icon: React.ElementType = FolderIcon;
            if (content.isFile) {
              Icon = __icon__[content?.ext || "default"] || DocumentIcon;
            }

            return content.isHidden ? null : (
              <Grid.Col
                key={`${i}__${content.path}`}
                onDoubleClick={() => openFolder(content)}
                span={view === "icon" ? 2 : 4}
              >
                <Flex
                  className="box-content--x"
                  align="center"
                  direction={view === "icon" ? "column" : "row"}
                >
                  <ThemeIcon
                    variant="transparent"
                    size={view === "icon" ? 42 : 24}
                  >
                    <Icon />
                  </ThemeIcon>
                  <Box
                    {...(view === "icon" ? { ta: "center" } : {})}
                    w="100%"
                    ml="xs"
                  >
                    <Text size="xs" truncate="end">
                      {content.name}
                    </Text>
                  </Box>
                </Flex>
              </Grid.Col>
            );
          })}
        </Grid>
      )}
    </AppShell.Main>
  );
}
