import express from 'express';
import { oauthReceiver } from './main/auth/twitch/get-token';

const app = express();

app.use(express.static('dist'));

/**
 * Initialize a proxy server that loads different parts of this application in a way OBS can read
 */
export function startExpressServer() {
  app.listen(30303);
}

app.get('/oauth-receiver', oauthReceiver);

export { app };
