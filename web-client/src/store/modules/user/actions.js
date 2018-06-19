import Vue from 'vue';
import * as types from './mutation-types';
import API from '../../../API/AuthAPI';
import store from '../../../store';
import VueNotifications from 'vue-notifications';

export const check = ({ commit }) => {
  commit(types.CHECK);
};

export const register = ({ commit }, payload) => {
  new API()
    .register(payload)
    .then(response => {
      VueNotifications.info({title: response.message});
      Vue.router.push({
        name: 'Login'
      })
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error)
    })
};

export const login = ({ commit }, payload) => {
  new API()
    .login(payload)
    .then(response => {
      VueNotifications.info({title: response.message});
      if (response.data) {
        commit(types.LOGIN, response.data);
        store.dispatch('account/profile');
        Vue.router.push({
          name: 'Dashboard'
        })
      }
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error)
    })
};

export const logout = ({ commit }) => {
  commit(types.LOGOUT);
  store.commit('scrapingICOs/CLEAR');
  store.commit('adminUsers/CLEAR');
  store.commit('account/CLEAR');
  Vue.router.push({
    name: 'Login'
  });
};

export const refreshToken = ({ commit }) => {
  Vue.http.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('refresh_token')}`;
  new API()
    .refreshToken()
    .then(response => {
      commit(types.REFRESH_TOKEN, response);
      store.dispatch('account/profile')
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error.error ? error.error : error);
      Vue.router.push({
        path: '/logout'
      })
    })
};

export const resetPassword = ({ commit }, payload) => {
  new API()
    .resetPassword(payload)
    .then(response => {
      VueNotifications.info({title: response.message});
      Vue.router.push({
        name: 'Login'
      })
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error)
    })
};

export const recoveryAccess = ({ commit }, payalod) => {
  new API()
    .recoveryAccess(payalod)
    .then(response => {
      VueNotifications.info({title: response.message});
      commit(types.REFRESH_TOKEN, response.data);
      Vue.router.push({
        name: 'Dashboard'
      })
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error);
    });
};

export const confirmEmail = ({ commit }) => {
  new API()
    .confirmEmail(store.state.user.hash)
    .then(response => {
      VueNotifications.info({title: response.message});
      commit(types.REFRESH_TOKEN, response.data);
      Vue.router.push({
        name: 'Dashboard'
      })
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error);
      Vue.router.push({
        path: '/logout'
      })
    });
  delete store.state.user.hash;
};

export default {
  check,
  register,
  login,
  logout,
  refreshToken,
  resetPassword,
  recoveryAccess,
  confirmEmail
};
