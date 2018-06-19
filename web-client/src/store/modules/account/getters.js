
export default {

  mainInfo: account => {
    return {
      id: account.id,
      name: account.name,
      email: account.email,
      username: account.username,
      status: account.status
    }
  },

  permissionsArray: account => {
    return account.permissionsArray || []
  },

  permissions: account => {
    return account.permissions || []
  },

  apiToken: account => {
    return account.apiToken || null
  },

  apiTokenHistory: account => {
    return account.apiTokenHistory || {}
  }

};
