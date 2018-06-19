/* ============
 * Main File
 * ============
 *
 * Will initialize the application.
 */
import Vue from 'vue';

/* ============
 * Plugins
 * ============
 *
 * Import and bootstrap the plugins.
 */
import './plugins/vuex';
import './plugins/axios';
import { i18n } from './plugins/vue-i18n';
import { router } from './plugins/vue-router';
import './plugins/vuex-router-sync';
import './plugins/bootstrap';
import './plugins/font-awesome';
import './plugins/bootstrap-vue';
import './plugins/vee-validate';
import './plugins/vue-jwt-decode';
import './plugins/vue-multiselect';
import './plugins/vue-notifications';

/* ============
 * Styling
 * ============
 */
import './assets/scss/style.scss';

/* ============
 * Main App
 * ============
 */

import App from './App';
import store from './store';

Vue.config.productionTip = false;
Vue.config.API_LOCATION = process.env.API_LOCATION;
store.dispatch('user/check');

/* eslint-disable no-new */
new Vue({
  /**
   * Bind the Vue instance to the HTML.
   */
  el: '#app',

  /**
   * The localization plugin.
   */
  i18n,

  /**
   * The router.
   */
  router,

  /**
   * The Vuex store.
   */
  store,

  /**
   * Will render the application.
   *
   * @param {Function} h Will create an element.
   */
  render: h => h(App)
});
