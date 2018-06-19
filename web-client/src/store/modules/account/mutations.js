
import * as types from './mutation-types';

let setDefault_ = (state) => {
  state.id = null;
  state.name = null;
  state.username = null;
  state.email = null;
  state.status = 0;
  state.settings = null;
  state.createdAt = null;
  state.updatedAt = null;
  state.permissions = null;
  state.permissionsArray = [];
  state.apiToken = null;
};

export default {
  [types.PROFILE] (state, user) {
    state.id = user.id;
    state.name = user.name;
    state.username = user.username;
    state.email = user.email;
    state.status = user.status;
    state.settings = user.settings;
    state.createdAt = user.created_at;
    state.updatedAt = user.updated_at;
    state.permissions = user.permissions;
    state.permissionsArray = user.permissionsArray;
    state.apiToken = user.tokens_api;
  },
  [types.UPDATE_PROFILE] (state, data) {
    state.name = data.name;
    state.status = data.status;
    state.email = data.email;
    state.username = data.username;
    state.updatedAt = data.updatedAt;
  },
  [types.DELETE_ACCOUNT] (state) {
    setDefault_(state)
  },
  [types.CLEAR] (state) {
    setDefault_(state)
  },
  [types.CREATE_TOKEN] (state, data) {
    state.apiToken = data;
  },
  [types.SET_TOKEN_HISTORY] (state, data) {
    let results = { values: [], data: [] };
    for (let i = data.length - 1; i >= 0; i--) {
      results.values.push(data[i].created_at.split('T')[0]);
      results.data.push(data[i].requests);
    }
    state.apiTokenHistory = results;
  }
};
