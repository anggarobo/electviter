import { useLayoutEffect, useState } from "react";
import { createTheme, LoadingOverlay, MantineProvider } from "@mantine/core";
import { AppProvider } from "./contexts/app";
import "@mantine/core/styles.css";
import SerialPort from "./components/Serial";

export default function App() {
  const [platform, setPlatform] = useState<OsPlatform | undefined>(undefined);
  const theme = createTheme({
    fontFamily: "Open Sans, sans-serif",
    primaryColor: "cyan",
  });

  useLayoutEffect(() => {
    const osp = async () => {
      const os = await window.api.platform();
      console.log(os);
      setPlatform(os);
    };
    osp();
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
          <SerialPort />
        </AppProvider>
      )}
    </MantineProvider>
  );
}
