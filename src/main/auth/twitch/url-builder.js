import crypto from 'crypto';
import { URLSearchParams } from 'url';

export default class URLBuilder {
  constructor() {
    // TODO: make these static
    this.redirectUri = 'http://localhost:30303/oauth-receiver';
    this.baseUri = 'https://id.twitch.tv/oauth2';
    this.keysUri = 'https://id.twitch.tv/oauth2/keys';
    this.verifyUrl = 'https://id.twitch.tv/oauth2/validate';
    this._clientId = process.env.CLIENT_ID;
    this._clientSecret = process.env.CLIENT_SECRET;
    this._authParams = new URLSearchParams();
    this._tokenParams = new URLSearchParams();
    this._clientParams = new URLSearchParams();
    this._baseAuthUri = '';
    this._baseTokenUri = '';
    this._states = [];
    this._authParams.append('client_id', this._clientId);
    this._authParams.append('redirect_uri', this.redirectUri);
    this._authParams.append('response_type', 'code');
    this._tokenParams.append('client_id', this._clientId);
    this._tokenParams.append('client_secret', this._clientSecret);
    this._tokenParams.append('grant_type', 'authorization_code');
    this._tokenParams.append('redirect_uri', this.redirectUri);
    this._clientParams.append('client_id', this._clientId);
    this._clientParams.append('client_secret', this._clientSecret);
    this._clientParams.append('grant_type', 'client_credentials');
    this._baseAuthUri = `${this.baseUri}/authorize?`;
    this._baseTokenUri = `${this.baseUri}/token?`;
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
    this._authParams.append('scope', scope);
    const state = this.generateState()
    this._states.push(state);
    this._authParams.append('state', state);
    return `${this._baseAuthUri}${this._authParams.toString()}`;
  }

  /**
   * Generate a url to be queried to get the final token needed for authorization
   * @param {String} code The authorization code provided by the first leg of the Oauth flow
   * @returns The url to query to get the actual token
   */
  getTokenUrl(code) {
    this._tokenParams.append('code', code);
    return `${this._baseTokenUri}${this._tokenParams.toString()}`;
  }

  getClientCredentialsUrl(scope = 'chat:read') {
    this._clientParams.append('scope', scope);
    return `${this._baseTokenUri}${this._clientParams.toString()}`
  }
}