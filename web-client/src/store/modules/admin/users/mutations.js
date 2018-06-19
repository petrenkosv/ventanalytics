import * as types from './mutation-types';

export default {
  [types.SEARCH] (state, data) {
    state.users = data;
  },
  [types.SELECT_USER] (state, data) {
    state.user = data;
  },
  [types.UPDATE_USER_STATUS] (state, data) {
    state.user.status = data.status;
  },
  [types.ADD_USER_PERMISSION] (state, data) {
    state.user.permissionsArray.push(data)
  },
  [types.REMOVE_USER_PERMISSION] (state, id) {
    for (let i in state.user.permissionsArray) {
      if (state.user.permissionsArray[i].id === id) {
        state.user.permissionsArray.splice(i, 1)
      }
    }
  },
  [types.UPDATE_USER_TOKEN] (state, data) {
    state.user.tokens_api = data;
  },
  [types.CLEAR] (state) {
    state.users = [];
    state.user = {};
  }
}
