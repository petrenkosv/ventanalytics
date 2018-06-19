
import Vue from 'vue';

import * as types from './mutation-types';

export default {
  [types.CHECK] (state) {
    let token = localStorage.getItem('access_token');
    let validExp = (token !== null && token !== 'undefined') ? Vue.jwtDec.decode(token).exp > +new Date() / 1000 : false;
    state.authenticated = !!token && validExp;
  },

  [types.LOGIN] (state, data) {
    state.authenticated = true;
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
  },

  [types.LOGOUT] (state) {
    state.authenticated = false;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    Vue.http.defaults.headers.common.Authorization = '';
  },

  [types.REFRESH_TOKEN] (state, response) {
    state.authenticated = true;
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);
  }
};
