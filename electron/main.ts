import { app, BrowserWindow } from "electron";

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    minWidth: 1000,
    height: 800,
    autoHideMenuBar: true,
    vibrancy: "under-window", // macOS
    backgroundMaterial: "acrylic", // Windows 11
  });

  // Load from Vite dev server
  win.loadURL("http://localhost:5178");
}

app.whenReady().then(createWindow);
