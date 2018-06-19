import * as types from './mutation-types';
import API from '../../../API/AccountAPI';
import store from '../../../store';
import VueNotifications from 'vue-notifications'

export const profile = ({commit}) => {
  new API()
    .getProfile()
    .then(response => {
      commit(types.PROFILE, response.data);
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error);
    });
};

export const updateProfile = ({commit}, payload) => {
  new API()
    .updateProfile(payload)
    .then(response => {
      VueNotifications.success({title: response.message});
      if (response.data) {
        commit(types.UPDATE_PROFILE, response.data);
      }
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error);
    });
};

export const deleteAccount = ({commit}) => {
  new API()
    .deleteAccount()
    .then(response => {
      commit(types.DELETE_ACCOUNT, response.data);
      store.dispatch('user/logout')
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error);
    });
};

export const changePassword = ({commit}, payload) => {
  new API()
    .changePassword(payload)
    .then(response => {
      VueNotifications.success({title: response.message});
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error);
    });
};

export const createToken = ({commit}) => {
  new API()
    .createToken()
    .then(response => {
      VueNotifications.success({title: response.message});
      commit(types.CREATE_TOKEN, response.data)
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error);
    });
};

export const apiTokenHistory = ({commit}, data) => {
  new API()
    .getTokenHistory(data.user, data.token)
    .then(response => {
      commit(types.SET_TOKEN_HISTORY, response.data)
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error);
    });
};

export default {
  profile,
  updateProfile,
  deleteAccount,
  changePassword,
  createToken,
  apiTokenHistory
};
