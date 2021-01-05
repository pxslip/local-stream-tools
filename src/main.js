'use strict';
import dotenv from 'dotenv';
import { app, BrowserWindow, protocol } from 'electron';
import { handler,errorHandler } from 'vue-cli-plugin-electron-builder/lib/createProtocol';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import path from 'path';
import routes from './main/routes';
import './main/ipc-events';
import { startExpressServer } from './proxy';
dotenv.config({ path: '../.env.local' });
const isDevelopment = process.env.NODE_ENV !== 'production';
const scheme = process.env.LST_SCHEME ?? 'lst';

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: scheme, privileges: { secure: true, standard: true } }]);

async function createWindow(hash = '') {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  protocol.registerBufferProtocol(scheme, async (request, respond) => {
    let url = new URL(request.url);
    // use the pathname to route to a handler method if exists, return to the default handler otherwise
    if (url.pathname in routes) {
      return await route[url.pathname](request, respond);
    }
    return handler(request, respond);
  }, errorHandler);
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + `#/${hash}`);
    if (!process.env.IS_TEST) {
      win.webContents.openDevTools();
    }
  } else {
    // Load the index.html when not in development
    win.loadURL(`${scheme}://./index.html#/${hash}`);
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

app.setAsDefaultProtocolClient(scheme);
startExpressServer();
