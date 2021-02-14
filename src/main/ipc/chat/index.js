import { ipcMain } from 'electron';

/**
 * A map from chat channel to port
 * @type {Map<String, MessagePort>}
 */
const ports = new Map();

ipcMain.handle('chat::send-message', (event, message) => {});

ipcMain.on('chat::join-channel', (e, channel) => {
  ports.set(channel, e.ports[0]);
});

export function messageReceived(channel, tags, message, self) {
  ports.get(channel).postMessage({ message, tags, self });
}
