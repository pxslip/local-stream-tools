import { BrowserWindow } from 'electron';
import crypto from 'crypto';
import { URLSearchParams } from 'url';
import { ipcMain } from 'electron';
import keytar from 'keytar';

// use implicit flow to avoid needing the client secret
const clientId = process.env.CLIENT_ID;
const redirectUri = 'lst://oauth-receiver';
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

/**
 * Get a token from twitch
 */
async function beginAuthCodeFlow() {
  try {
    //create the window that will be used to do auth
    const window = new BrowserWindow({ webPreferences: { nodeIntegration: false } });
    window.show();
    window.webContents.openDevTools();
    window.loadURL(authorizeUrl);
  } catch (exc) {}
}
/**
 * 
 * @param {URL} url 
 */
async function getToken(url) {
  try {
    if (state !== url.searchParams.get('state')) {
      // bail out as our state params don't match...
      return;
    }
    tokenParams.append('code', url.searchParams.get('code'));
    const response = await fetch(`${tokenBaseUrl}${tokenParams.toString()}`);
    const data = response.json();
    
  } catch (exc) {
    throw exc;
  }
}

export { beginAuthCodeFlow, getToken };
