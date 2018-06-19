/* ============
 * Vue Router
 * ============
 *
 * The official Router for Vue.js. It deeply integrates with Vue.js core
 * to make building Single Page Applications with Vue.js a breeze.
 *
 * http://router.vuejs.org/en/index.html
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from '../routes';
import store from '../store';

Vue.use(VueRouter);

export const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.auth) && !store.state.user.authenticated) {
    /*
     * If the user is not authenticated and visits a page that requires authentication
     */
    if (localStorage.getItem('refresh_token') !== null) {
      Vue.http.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('refresh_token')}`;
      store.dispatch('user/refreshToken');
    } else {
      return next({
        name: 'Login'
      });
    }
  } else if (to.matched.some(m => m.meta.guest) && store.state.user.authenticated) {
    /*
     * If the user is authenticated and visits an guest page
     */
    return next({
      name: 'Dashboard'
    });
  } else if (to.matched.some(m => m.meta.confirm)) {
    store.state.user.hash = to.query.hash;
    return store.dispatch('user/confirmEmail')
  } else if (to.matched.some(m => m.meta.logout)) {
    return store.dispatch('user/logout')
  }

  // CHeck access to MODULE
  if (to.matched.some(m => m.meta.module)) {
    if (store.state.account.permissions !== null && store.state.account.permissions.indexOf(to.meta.module) === -1) {
      return next({
        name: 'Dashboard'
      })
    }
  }
  next();
});

Vue.router = router;

export default {
  router
};
