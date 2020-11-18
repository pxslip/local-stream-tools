import { ipcMain, BrowserWindow } from 'electron';
import path from 'path';

ipcMain.handle('button-click', async () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  await win.loadURL('https://www.google.com');
});
