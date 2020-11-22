import { BrowserWindow, session } from 'electron';
import oauth from 'oauth-electron';

const info = {
  key: process.env.CLIENT_ID,
  secret: process.env.CLIENT_SECRET,
  scope: 'chat:read',
  baseSite: 'https://id.twitch.tv',
  authorizePath: 'oauth2/authorize',
  accessTokenPath: 'oauth2/token',
  redirectUrl: 'http://localhost:30303/authenticate',
};

window = new BrowserWindow({ webPreferences: { nodeIntegration: false } });

const response = await oauth.oauth2(info, window, session);

export default response;
