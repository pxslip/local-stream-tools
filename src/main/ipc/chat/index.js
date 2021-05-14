import { ipcMain } from 'electron';
import { Client } from 'tmi.js';
import { get, getArray } from '../../store/';

/**
 * A map from chat channel to port
 * @type {Map<String, MessagePort>}
 */
const ports = new Map();
/**
 * The tmi.js chat client
 * @type {Client}
 */
let client;

/**
 * Load the chat client if not already loaded
 */
async function loadClient() {
  if (!client) {
    client = await (await import('../../chat/')).getClient();
    client.on('message', async (channel, tags, message, self) => {
      const port = ports.get(channel.replace('#', ''));
      if (port) {
        port.postMessage({ channel, message, tags, self });
      }
      const prefix = get('bot', { prefix: '!' }).prefix;
      if (message.startsWith(prefix)) {
        const command = getArray('commands').find(val => {
          return message.split(' ')[0] === `${prefix}${val.name}`;
        });
        if (command) {
          const operator = await import(`../../chat/commands/${command.type}`);
          const response = operator.call(command);
          if (typeof response === 'string') {
            client.say(channel, response);
          }
        }
      }
    });
  }
}

ipcMain.handle('chat::send-message', async (event, message) => {
  await loadClient();
});

ipcMain.on('chat::join-channel', async (e, { channel }) => {
  await loadClient();
  client.join(channel);
  ports.set(channel, e.ports[0]);
});
