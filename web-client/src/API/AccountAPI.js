import API from './API';

class AccountAPI extends API {
  constructor (parameters = {}) {
    super('/user', parameters)
  }

  /**
   * Get profile info
   *
   * @returns {Promise}
   */
  getProfile () {
    return this.submit('get', `${this.endpoint}`)
  }

  /**
   * Update profile info
   *
   * @param data
   * @returns {Promise}
   */
  updateProfile (data) {
    return this.submit('put', `${this.endpoint}/` + data.id, data)
  }

  /**
   * Delete account
   *
   * @returns {Promise}
   */
  deleteAccount () {
    return this.submit('delete', `${this.endpoint}`)
  }

  /**
   * Change password
   *
   * @returns {Promise}
   */
  changePassword (data) {
    return this.submit('put', `${this.endpoint}/` + data.id + '/changePassword', data)
  }

  /**
   * Create API token.
   *
   * @returns {Promise}
   */
  createToken () {
    return this.submit('get', `${this.endpoint}/api-token/create`)
  }

  /**
   * Get history of API token.
   *
   * @param user
   * @param token
   * @returns {Promise}
   */
  getTokenHistory (user, token) {
    return this.submit('get', `${this.endpoint}/` + user + '/api-token/' + token + '/history')
  }
}

export default AccountAPI;
