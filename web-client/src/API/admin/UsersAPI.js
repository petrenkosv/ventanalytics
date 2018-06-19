import API from '../API';

class AdminUsersAPI extends API {
  constructor (parameters = {}) {
    super('/user/admin', parameters)
  }

  /**
   * Get all Users by params
   *
   * @param params {JSON}
   * @returns {Promise}
   */
  getAll (params) {
    this.setParameter('status', params.status);
    this.setParameter('name', params.name);
    return this.submit('get', `${this.endpoint}/getAll`)
  }

  /**
   * Get user by ID
   *
   * @param id - user ID
   * @returns {Promise}
   */
  get (id) {
    return this.submit('get', `${this.endpoint}/get/` + id)
  }

  /**
   * Block user
   *
   * @param id - user ID
   * @returns {*}
   */
  block (id) {
    return this.submit('put', `${this.endpoint}/block/` + id)
  }

  /**
   * Unblock user
   *
   * @param id - user ID
   * @returns {*}
   */
  unBlock (id) {
    return this.submit('put', `${this.endpoint}/unblock/` + id)
  }

  /**
   * Add permission to user
   *
   * @param data {JSON}
   * @returns {*}
   */
  addPermission (data) {
    return this.submit('post', `${this.endpoint}/permission`, data)
  }

  /**
   * Remove permission to user
   *
   * @param id - permission ID
   * @returns {*}
   */
  removePermission (id) {
    return this.submit('delete', `${this.endpoint}/permission/` + id)
  }

  /**
   * Update API token for user.
   *
   * @param id - token ID.
   * @param data
   * @return {*}
   */
  updateApiToken (id, data) {
    return this.submit('put', `${this.endpoint}/apitoken/` + id, data)
  }
}

export default AdminUsersAPI;
