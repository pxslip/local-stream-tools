import { Client } from 'tmi.js';
import { getToken } from '../auth/twitch/get-token';
import { messageReceived } from '../ipc/chat';

// grab the token we need before doing anything else
getToken().then(token => {
  const client = new Client({
    connection: { reconnect: true, secure: true },
    identity: {
      username: token.user_data.sub,
      password: token.access_token,
    },
  });
  client.connect();
  client.on('message', handleMessage);
});

function handleMessage(channel, tags, message, self) {
  messageReceived(channel, tags, message, self);
  // handle any ops as indicated by the message
}
