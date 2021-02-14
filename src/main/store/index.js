import Store from 'electron-store';

const schema = {
  commands: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        command: {type: 'string'},
        type: {type: 'string'},
      }
    }
  },
  prefix: {
    type: 'string'
  }
}

const store = new Store();

/**
 * 
 * @param {string} key the config key to set
 * @param {any} value the value to assign to said key
 */
export function set(key, value) {
  store.set(key, value);
}

/**
 * 
 * @param {string} key the config key to get
 * @param {any} defaultValue the default if the config key does not exist
 * @returns
 */
export function get(key, defaultValue) {
  const val = store.get(key, defaultValue);
  return val;
}