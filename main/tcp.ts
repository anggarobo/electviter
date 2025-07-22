import { app, BrowserWindow, ipcMain } from "electron";
import * as net from "net";

export let client: net.Socket | null = null;

export default function (mainWindow: BrowserWindow) {
  // === HANDLE SERIAL OVER TCP ===
  ipcMain.on("serial-connect", (event, host: string, port: number) => {
    if (client) {
      console.warn("Already connected. Disconnecting previous...");
      client.end();
      client.destroy();
      client = null;
    }

    client = net.createConnection({ host, port }, () => {
      console.log(`✅ Connected to serial-over-TCP at ${host}:${port}`);
    });

    client.on("data", (data) => {
      if (mainWindow) {
        mainWindow.webContents.send("serial-onData", data.toString());
      }
    });

    client.on("error", (err) => {
      console.error("❌ Serial socket error:", err.message);
      if (mainWindow) {
        mainWindow.webContents.send("serial-onData", "[ERROR] " + err.message);
      }
    });

    client.on("close", () => {
      console.log("⚠️ Serial TCP connection closed.");
      if (mainWindow) {
        mainWindow.webContents.send("serial-onData", "[Disconnected]");
      }
      client = null;
    });
  });

  ipcMain.on("serial-sendData", (_event, data: string) => {
    if (client && !client.destroyed) {
      client.write(data + "\n");
    } else {
      console.warn("⚠️ Cannot send data. Not connected.");
    }
  });

  ipcMain.on("serial-disconnect", () => {
    if (client) {
      client.end();
      client.destroy();
      client = null;
      console.log("🔌 Serial TCP connection closed manually.");
    }
  });
}

// === APP QUIT ===
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (client) {
      client.end();
      client.destroy();
      client = null;
    }
    app.quit();
  }
});
