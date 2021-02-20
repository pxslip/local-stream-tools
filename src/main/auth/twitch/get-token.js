import { BrowserWindow } from 'electron';
import keytar from 'keytar';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import jwks from 'jwks-rsa';
import URLBuilder from './url-builder';

//TODO: Stop doing essentially globals...
/**
 * @type {BrowserWindow}
 */
let window;
/**
 * @type {Object}
 */
let token;

/**
 * @type {Object}
 */
let clientCredentials;

/**
 * @type {URLBuilder}
 */
const builder = new URLBuilder();

async function setOrUpdateToken(tokenData) {
  // verify the token
  if (tokenData.id_token) {
    const client = jwks({
      jwksUri: builder.keysUri,
    });
    const key = await client.getSigningKeyAsync('1');
    tokenData.user_data = jwt.verify(tokenData.id_token, key.publicKey || key.rsaPublicKey);
  }
  token = Object.assign(token, tokenData);
  await keytar.setPassword('lst', 'twitch', JSON.stringify(token));
  return token;
}

/**
 * Get a token from twitch
 * @param {*} closedCb
 */
export function beginAuthCodeFlow(closedCb) {
  try {
    //create the window that will be used to do auth
    window = new BrowserWindow({ webPreferences: { nodeIntegration: false } });
    window.show();
    window.webContents.openDevTools();
    window.loadURL(builder.getAuthUrl('chat:read chat:edit channel:moderate openid'));
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
export async function oauthReceiver(req, res) {
  if (builder.validateState(req.query.state)) {
    try {
      // get the oauth token, refresh token
      const response = await axios.post(builder.getTokenUrl(req.query.code));
      await setOrUpdateToken(response.data);
    } catch (exc) {
      console.error(exc);
    }
  }
  window.close();
}

/**
 * Called to actually get the token data object back from twitch
 * @returns {Promise}
 */
export function getToken() {
  const promise = new Promise(async (resolve, reject) => {
    // try to load the token from keytar
    if (!token) {
      const tokenData = await keytar.getPassword('lst', 'twitch');
      if (tokenData) {
        token = JSON.parse(tokenData);
      }
    }
    if (token.access_token) {
      try {
        // verify that our token is still valid
        const resp = await axios.get(builder.verifyUrl, {
          headers: {
            Authorization: `OAuth ${token.access_token}`,
          },
        });
        if (resp.status === 200) {
          resolve(token);
          return;
        }
      } catch (exc) {
        if (exc.response.status !== 401) {
          reject(exc);
          return;
        }
        try {
          const response = await axios.post(builder._baseTokenUri, builder.getRefreshUrl(token.refresh_token));
          await setOrUpdateToken(response.data);
          resolve(token);
          return;
        } catch (exc) {
          reject(exc);
        }
      }
    }
    beginAuthCodeFlow(() => {
      resolve(token);
    });
  });
  return promise;
}

/**
 * Get a client token
 */
export async function getClientCredentials() {
  if (clientCredentials && clientCredentials.expiration && clientCredentials.expiration > Date.now()) {
    clientCredentials = null;
  }
  if (!clientCredentials) {
    try {
      const resp = await axios.post(builder.getClientCredentialsUrl());
      clientCredentials = resp.data;
      clientCredentials.expiration = Date.now() + clientCredentials.expires_in * 1000;
    } catch (exc) {
      console.log(exc);
    }
  }
  return clientCredentials;
}
