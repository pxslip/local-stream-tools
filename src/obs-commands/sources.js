export default class OBSSources {
  #sourceList;
  obs;
  /**
   * 
   * @param {OBSWebSocket} obs 
   */
  constructor(obs) {
    this.obs = obs;
    this.#sourceList = [];

  }

  /**
   * get the list of sources from the currently connected OBS instance
   */
  get sourceList() {
    if (this.#sourceList.length === 0) {
      this.#updateSourceList();
    }
    return this.#sourceList;
  }

  /**
   * Update the list of sources from OBS
   */
  async #updateSourceList() {
    this.sourceList = this.obs.send('GetSourcesList');
    return sourceList;
  }

  /**
   * hide a given source
   * @param {String} sourceName 
   */
  async hideSource(sourceName) {
    //TODO: figure out what setting (if available) controls source visibility
    this.obs.send('SetSourceSettings', {sourceName: sourceName, sourceSettings: {}});
  }
}

/**
 * Get the list of sources
 * @param {OBSWebSocket} obs
 */
export async function getSourceList(obs) {
  const sourceList = obs.send('GetSourcesList');
  return sourceList;
}

export async function changeSource(obs)