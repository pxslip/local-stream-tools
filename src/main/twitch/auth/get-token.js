import { BrowserWindow } from 'electron';
import crypto from 'crypto';
import { URLSearchParams } from 'url';
import keytar from 'keytar';

// use implicit flow to avoid needing the client secret
const clientId = process.env.CLIENT_ID;
const redirectUri = 'http://localhost:30303/oauth-receiver';
const baseUri = 'https://id.twitch.tv/oauth2';
const scopes = 'chat:read';
const state = crypto.randomBytes(64).toString('base64');
const authParams = new URLSearchParams();
authParams.append('client_id', clientId);
authParams.append('redirect_uri', redirectUri);
authParams.append('response_type', 'code');
authParams.append('scope', scopes);
authParams.append('state', state);
const authorizeUrl = `${baseUri}/authorize?${authParams.toString()}`;
const tokenParams = new URLSearchParams(authParams);
tokenParams.delete('response_type');
tokenParams.delete('scope');
tokenParams.delete('state');
tokenParams.set('grant_type', 'authorization_code');
tokenParams.set('client_secret', process.env.CLIENT_SECRET);

const tokenBaseUrl = `${baseUri}/token?`;
let window;

/**
 * Get a token from twitch
 */
export function beginAuthCodeFlow(closedCb) {
  try {
    //create the window that will be used to do auth
    window = new BrowserWindow({ webPreferences: { nodeIntegration: false } });
    window.show();
    window.webContents.openDevTools();
    window.loadURL(authorizeUrl);
    window.on('closed', () => {
      window = null;
      closedCb();
    });
  } catch (exc) {}
}

/**
 * 
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
export function oauthReceiver(req, res) {
  keytar.setPassword('twitch', 'lst', req.query.code);
  window.close();
}

/**
 * @returns {Promise}
 */
export function getToken() {
  const promise = new Promise((resolve, reject) => {
    keytar.getPassword('twitch', 'lst').then((code) => {
      resolve(code);
    });
    beginAuthCodeFlow(() => {
      keytar.getPassword('twitch', 'lst').then((code) => {
        resolve(code);
      });
    });
  });
  return promise;
}
