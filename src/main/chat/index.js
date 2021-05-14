import { Client } from 'tmi.js';
import { getToken } from '../auth/twitch/get-token';

/**
 * @type {Client}
 */
let client;

export async function getClient() {
  if (client) {
    return client;
  }
  const token = await getToken();
  client = new Client({
    connection: { reconnect: true, secure: true },
    identity: {
      username: token.user_data.sub,
      password: token.access_token,
    },
  });
  await client.connect();
  return client;
}

