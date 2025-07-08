import { useEffect, useLayoutEffect, useState } from "react";
import { createTheme, LoadingOverlay, MantineProvider } from "@mantine/core";
import Layout from "./components/Layout";
import { AppProvider } from "./contexts/app";
import "@mantine/core/styles.css";

export default function App() {
  const [platform, setPlatform] = useState<OsPlatform | undefined>(undefined);
  const theme = createTheme({
    fontFamily: "Open Sans, sans-serif",
    primaryColor: "cyan",
  });

  useLayoutEffect(() => {
    const os = window.api.platform;
    if (os) setPlatform(os);
  }, []);

  useEffect(() => {
    const contextMenu = (e: MouseEvent) => {
      e.preventDefault();
      window.api.ipc.showContextMenu();
    };

    window.addEventListener("contextmenu", contextMenu);

    return () => window.removeEventListener("contextmenu", contextMenu);
  }, []);

  return (
    <MantineProvider theme={theme}>
      {!platform ? (
        <LoadingOverlay
          visible
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ color: "royalblue", type: "bars" }}
        />
      ) : (
        <AppProvider platform={platform}>
          <Layout />
        </AppProvider>
      )}
    </MantineProvider>
  );
}
