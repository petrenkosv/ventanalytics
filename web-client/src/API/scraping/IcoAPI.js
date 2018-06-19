import API from '../API';

class ScrapingIcoAPI extends API {
  constructor (parameters = {}) {
    super('/scraping/ico', parameters)
  }

  /**
   * Get ICO by name
   *
   * @returns {Promise}
   */
  searchByName (name) {
    this.setParameter('fields', 'all');
    this.setParameter('name', name);
    return this.submit('get', `${this.endpoint}/query`)
  }

  /**
   * Update ICO
   *
   * @param data
   * @returns {Promise}
   */
  update (data) {
    return this.submit('put', `${this.endpoint}/` + data['_id'], data)
  }

  /**
   * Create ICO
   *
   * @param data
   * @returns {Promise}
   */
  create (data) {
    return this.submit('post', `${this.endpoint}/`, data)
  }
}

export default ScrapingIcoAPI;
