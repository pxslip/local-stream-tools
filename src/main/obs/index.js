import OBSWebSocket from 'obs-websocket-js';
import { get } from '../store';

const obs = new OBSWebSocket();

(async function() {
  try {
    const settings = get('obs', { port: 4444, password: 'secret', host: 'localhost' });
    await obs.connect({ address: `${settings.host}:${settings.port}`, password: settings.password });
  } catch (exc) {}
})();

/**
 * Proxy sending a command to obs
 * @param {String} requestType
 * @param {Object} args
 */
export async function send(requestType, args) {
  return await obs.send(requestType, args);
}

/**
 *
 * @param {String} eventName
 * @param {Function} callback
 */
export function on(eventName, callback) {
  obs.on(eventName, callback);
}
