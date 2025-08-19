import { useLayoutEffect, useState } from "react";
import {
  Container,
  createTheme,
  LoadingOverlay,
  MantineProvider,
} from "@mantine/core";
import { AppProvider } from "./contexts/app";
import "@mantine/core/styles.css";
// import SerialPort from "./components/Serial";
import Gate from "./components/Gate";
import { clsx } from "clsx";
import classes from "./App.module.css";

export default function App() {
  const [platform, setPlatform] = useState<OsPlatform | undefined>(undefined);
  const theme = createTheme({
    fontFamily: "Open Sans, sans-serif",
    primaryColor: "cyan",
    components: {
      Container: Container.extend({
        classNames: (_, { size }) => ({
          root: clsx({ [classes.responsiveContainer]: size === "responsive" }),
        }),
      }),
    },
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
          {/* <SerialPort /> */}
          <Gate />
        </AppProvider>
      )}
    </MantineProvider>
  );
}
