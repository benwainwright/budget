import { app, BrowserWindow } from "electron";
import * as path from "path";
import isDev from "electron-is-dev";

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("budget-app", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("budget-app");
}

function createWindow(queryString?: string) {
  const mainWindow = new BrowserWindow({
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
    width: 800,
  });

  const query = queryString ? `?${queryString}` : queryString;

  mainWindow.loadURL(
    isDev
      ? `http://localhost:3000${query}`
      : `file://${path.join(__dirname, "../build/index.html")}${query}`
  );

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
}

app.on("ready", () => {
  createWindow();

  app.on("activate", function () {
    console.log("activating");
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("open-url", (_event, url) => {
  const parts = url.split("?");
  const query = parts.length > 1 ? parts[1] : undefined;
  createWindow(query);
});
