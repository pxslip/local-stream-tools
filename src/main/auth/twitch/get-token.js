import { BrowserWindow } from 'electron';
import keytar from 'keytar';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import jwks from 'jwks-rsa';
import URLBuilder from './url-builder';

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
    window.loadURL(builder.getAuthUrl());
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
  if (req.query.state === state) {
    try {
      // get the oauth token, refresh token
      tokenParams.append('code', req.query.code);
      const response = await axios.post(`${tokenBaseUrl}${tokenParams.toString()}`);
      token = response.data;
      // verify the token
      const client = jwks({
        jwksUri: builder.keysUri,
      });
      const key = await client.getSigningKeyAsync('1');
      token.user_data = jwt.verify(token.id_token, key.publicKey || key.rsaPublicKey);
      await keytar.setPassword('lst', 'twitch', JSON.stringify(token));
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
    if (token) {
      // verify that our token is still valid
      const resp = await axios.get(builder.verifyUrl, {
        headers: {
          Authorization: `Oauth ${token.access_token}`,
        },
      });
      if (resp.status === 200) {
        resolve(token);
        return;
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
