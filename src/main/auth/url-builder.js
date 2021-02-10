import crypto from 'crypto';
import { URLSearchParams } from 'url';

export default class URLBuilder {
  redirectUri = '';
  baseUri = '';
  keysUri = '';
  verifyUrl = '';
  #clientId = process.env.CLIENT_ID;
  #clientSecret = process.eng.CLIENT_SECRET;
  #authParams = new URLSearchParams();
  #tokenParams = new URLSearchParams();
  #baseAuthUri = '';
  #baseTokenUri = '';
  #states = [];
  constructor() {
    this.#authParams.append('client_id', this.#clientId);
    this.#authParams.append('redirect_uri', this.redirectUri);
    this.#authParams.append('response_type', 'code');
    this.#tokenParams.append('client_id', this.#clientId);
    this.#tokenParams.append('redirect_uri', this.redirectUri);
    this.#tokenParams.set('grant_type', 'authorization_code');
    this.#tokenParams.set('client_secret', this.#clientSecret);
    this.#baseAuthUri = `${this.#baseUri}/authorize?`;
    this.#baseTokenUri = `${baseUri}/token?`;
  }

  /**
   * Generates a random string for use as a state param in OAuth requests
   * @param {Number} length the number of bytes to generate
   * @returns a base 64 encoded string with byte length of the length provided
   */
  generateState(length = 64) {
    return crypto.randomBytes(length).toString('base64');
  }

  /**
   * Generates a URL to start the Oauth Authorization Code flow with
   * @param {String} scope The scopes to request from Twitch
   * @returns The url to open in a browser
   */
  getAuthUrl(scope = 'chat:read openid') {
    this.#authParams.append('scope', scope);
    const state = this.generateState()
    this.#states.push(state);
    this.#authParams.append('state', state);
    return `${this.#baseAuthUri}${this.#authParams.toString()}`;
  }

  /**
   * Generate a url to be queried to get the final token needed for authorization
   * @param {String} code The authorization code provided by the first leg of the Oauth flow
   * @returns The url to query to get the actual token
   */
  getTokenUrl(code) {
    this.#tokenParams.append('code', code);
    return `${this.#baseTokenUri}${this.#tokenParams.toString()}`;
  }
}