import crypto from 'crypto';
import { URLSearchParams } from 'url';

export default class URLBuilder {
  constructor() {
    // TODO: make these static
    this.redirectUri = 'http://localhost:30303/oauth-receiver';
    this.baseUri = 'https://id.twitch.tv/oauth2';
    this.keysUri = 'https://id.twitch.tv/oauth2/keys';
    this.verifyUrl = 'https://id.twitch.tv/oauth2/validate';
    this._authParams = null;
    this._tokenParams = null;
    this._clientParams = null;
    this._refreshParams = null;
    this._baseAuthUri = '';
    this._baseTokenUri = '';
    this._states = [];
    this._baseAuthUri = `${this.baseUri}/authorize?`;
    this._baseTokenUri = `${this.baseUri}/token?`;
  }

  /**
   * Generates a random string for use as a state param in OAuth requests
   * @param {Number} length the number of bytes to generate
   * @returns a base 64 encoded string with byte length of the length provided
   */
  generateState(length = 64) {
    const state = crypto.randomBytes(length).toString('base64');
    this._states.push(state);
    return state;
  }

  /**
   * Generates a URL to start the Oauth Authorization Code flow with
   * @param {String} scope The scopes to request from Twitch
   * @returns The url to open in a browser
   */
  getAuthUrl(scope = 'chat:read openid') {
    this.authParams.set('scope', scope);
    return `${this._baseAuthUri}${this._authParams.toString()}`;
  }

  /**
   * Generate a url to be queried to get the final token needed for authorization
   * @param {String} code The authorization code provided by the first leg of the Oauth flow
   * @returns The url to query to get the actual token
   */
  getTokenUrl(code) {
    this.tokenParams.set('code', code);
    return `${this._baseTokenUri}${this._tokenParams.toString()}`;
  }

  getClientCredentialsUrl(scope = 'chat:read chat:edit channel:moderate') {
    this.clientParams.set('scope', scope);
    return `${this._baseTokenUri}${this._clientParams.toString()}`;
  }

  /**
   * 
   * @param {string} refreshToken 
   * @returns {Object} an object with all of the params to pass to the refresh request
   */
  getRefreshUrl(refreshToken) {
    this.refreshParams.set('refresh_token', refreshToken);
    return this.refreshParams;
  }

  validateState(state) {
    const index = this._states.indexOf(state);
    if (index >= 0) {
      this._states.splice(index, 1);
      return true;
    }
    return false;
  }

  get _clientId() {
    return process.env.CLIENT_ID;
  }

  get _clientSecret() {
    return process.env.CLIENT_SECRET;
  }

  get authParams() {
    if (!this._authParams) {
      const params = new URLSearchParams();
      params.set('client_id', this._clientId);
      params.set('redirect_uri', this.redirectUri);
      params.set('response_type', 'code');
      this._authParams = params;
    }
    this._authParams.set('state', this.generateState());
    return this._authParams;
  }

  get tokenParams() {
    if (!this._tokenParams) {
      const params = new URLSearchParams();
      params.set('client_id', this._clientId);
      params.set('client_secret', this._clientSecret);
      params.set('grant_type', 'authorization_code');
      params.set('redirect_uri', this.redirectUri);
      this._tokenParams = params;
    }
    this._tokenParams.set('state', this.generateState());
    return this._tokenParams;
  }

  get clientParams() {
    if (!this._clientParams) {
      const params = new URLSearchParams();
      params.set('client_id', this._clientId);
      params.set('client_secret', this._clientSecret);
      params.set('grant_type', 'client_credentials');
      this._clientParams = params;
    }
    this._clientParams.set('state', this.generateState());
    return this._clientParams;
  }

  get refreshParams() {
    if (!this._refreshParams) {
      const params = new URLSearchParams();
      params.set('client_id', this._clientId);
      params.set('client_secret', this._clientSecret);
      params.set('grant_type', 'refresh_token');
      this._refreshParams = params;
    }
    return this._refreshParams;
  }
}
