/* ============
 * Axios
 * ============
 *
 * Promise based HTTP client for the browser and node.js.
 * Because Vue Resource has been retired, Axios will now been used
 * to perform AJAX-requests.
 *
 * https://github.com/mzabriskie/axios
 */

import Vue from 'vue';
import Axios from 'axios';
import store from '../store';

Axios.defaults.baseURL = process.env.API_LOCATION;
Axios.defaults.headers.common['Accept'] = 'application/json';
// Axios.interceptors.request.use(config => {
//   return config;
// });

Axios.interceptors.response.use(
  response => {
    if (response.data.error) {
      return Promise.reject(response.data.error);
    }
    return response
  },
  error => {
    if (error.response.status === 401) {
      store.dispatch('user/logout')
    } else if (error.response.status === 500) {
      Vue.router.push({
        name: 'error500'
      });
    }
    // if (error.response.status === 404) {
    //   Vue.router.push({
    //      name: 'error404'
    //   });
    // } else if (error.response.status === 402) {
    //   Vue.router.push({
    //     name: 'error402'
    //   });
    return Promise.reject(error);
  });

Vue.http = Axios;

Object.defineProperty(Vue.prototype, 'http', {
  get () {
    return Axios;
  }
});
