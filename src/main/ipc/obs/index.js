import { ipcMain } from 'electron';
import { send, on } from '../../obs';

/**
 * @type {Map<String, MessagePort}
 */
const events = new Map();

ipcMain.on('obs::send', (event, requestName, args) => {
  return send(requestName, args);
});

ipcMain.on('obs::on', (event, eventName) => {
  /** @type {MessagePort} */
  const port = event.port[0];
  events.set(eventName, port);
  on(eventName, response => {
    port.postMessage(response);
  });
});
