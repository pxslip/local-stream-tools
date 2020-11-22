import OBSWebSocket from 'obs-websocket-js';
import OBSSources from './sources';

const obs = new OBSWebSocket();

obs.connect();

const sources = new OBSSources(obs);

export default {
  sources,
};
