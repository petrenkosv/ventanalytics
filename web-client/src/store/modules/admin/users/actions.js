import * as types from './mutation-types';
import API from '../../../../API/admin/UsersAPI';
import VueNotifications from 'vue-notifications';

export const searchUsers = ({ commit }, payalod) => {
  new API()
    .getAll(payalod)
    .then(response => {
      commit(types.SEARCH, response.data);
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error)
    })
};

export const searchUserByID = ({ commit }, id) => {
  new API()
    .get(id)
    .then(response => {
      commit(types.SELECT_USER, response.data);
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error)
    })
};

export const blockAccount = ({ commit }, id) => {
  new API()
    .block(id)
    .then(response => {
      VueNotifications.success({title: response.message});
      commit(types.UPDATE_USER_STATUS, response.data);
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error)
    })
};

export const unBlockAccount = ({ commit }, id) => {
  new API()
    .unBlock(id)
    .then(response => {
      VueNotifications.success({title: response.message});
      commit(types.UPDATE_USER_STATUS, response.data);
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error)
    })
};

export const addPermission = ({ commit }, payalod) => {
  new API()
    .addPermission(payalod)
    .then(response => {
      VueNotifications.success({title: response.message});
      commit(types.ADD_USER_PERMISSION, response.data);
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error);
    })
};

export const removePermission = ({ commit }, permissionId) => {
  new API()
    .removePermission(permissionId)
    .then(response => {
      VueNotifications.success({title: response.message});
      commit(types.REMOVE_USER_PERMISSION, permissionId);
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error);
    })
};

export const updateApiToken = ({commit}, payout) => {
  new API()
    .updateApiToken(payout.id, payout)
    .then(response => {
      VueNotifications.success({title: response.message});
      commit(types.UPDATE_USER_TOKEN, response.data);
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error);
    })
};

export default {
  searchUsers,
  searchUserByID,
  blockAccount,
  unBlockAccount,
  addPermission,
  removePermission,
  updateApiToken
};
