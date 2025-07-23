import { useLayoutEffect, useState } from "react";
import { createTheme, LoadingOverlay, MantineProvider } from "@mantine/core";
import { AppProvider } from "./contexts/app";
import "@mantine/core/styles.css";
import SerialPort from "./components/Serial/SerialPort";

export default function App() {
  const [platform, setPlatform] = useState<OsPlatform | undefined>(undefined);
  // const [activeTab, setActiveTab] = useState<string | null>("2");
  const theme = createTheme({
    fontFamily: "Open Sans, sans-serif",
    primaryColor: "cyan",
  });

  useLayoutEffect(() => {
    const os = window.api.platform;
    if (os) setPlatform(os);
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
          {/* <Layout /> */}
          {/* <Serial /> */}
          <SerialPort />
          {/* <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="0">Serial List</Tabs.Tab>
              <Tabs.Tab value="1">Virtual TCP</Tabs.Tab>
              <Tabs.Tab value="2">Serial Port</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="0">
              <Serial />
            </Tabs.Panel>
            <Tabs.Panel value="1"><VirtualTcp /></Tabs.Panel>
            <Tabs.Panel value="2">
              <SerialPort />
            </Tabs.Panel>
          </Tabs> */}
        </AppProvider>
      )}
    </MantineProvider>
  );
}
