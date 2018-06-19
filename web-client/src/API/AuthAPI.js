import API from './API';

class AuthAPI extends API {
  constructor (parameters = {}) {
    super('/auth', parameters)
  }

  /**
   * Sign In user
   *
   * @param data
   * @returns {Promise}
   */
  login (data) {
    return this.submit('post', `${this.endpoint}/signin`, data)
  }

  /**
   * Sign Up user
   *
   * @param data
   * @returns {Promise}
   */
  register (data) {
    return this.submit('post', `${this.endpoint}/signup`, data)
  }

  /**
   * Refresh token
   *
   * @returns {Promise}
   */
  refreshToken () {
    return this.submit('get', `${this.endpoint}/refresh-token`)
  }

  /**
   * Reset password
   *
   * @returns {Promise}
   */
  resetPassword (data) {
    return this.submit('post', `${this.endpoint}/reset`, data)
  }

  /**
   * Recovery access - confir
   *
   * @returns {Promise}
   */
  recoveryAccess (data) {
    return this.submit('post', `${this.endpoint}/recovery`, data)
  }

  /**
   * Recovery access - confirm
   *
   * @returns {Promise}
   */
  confirmEmail (hash) {
    this.setParameter('hash', hash);
    return this.submit('get', `${this.endpoint}/confirm`)
  }
}

export default AuthAPI;
