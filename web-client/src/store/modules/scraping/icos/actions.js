import Vue from 'vue';
import * as types from './mutation-types';
import API from '../../../../API/scraping/IcoAPI';
import ScrapingIcosTransformer from '../../../../transformers/ScrapingIcosTransformer'
import VueNotifications from 'vue-notifications';

export const searchICOs = ({ commit }, payalod) => {
  new API()
    .searchByName(payalod)
    .then(response => {
      VueNotifications.success({title: response.message});
      commit(types.SEARCH_ICOS, ScrapingIcosTransformer.fetch(response.data));
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error);
    })
};

export const update = ({ commit }, payalod) => {
  new API()
    .update(ScrapingIcosTransformer.send(payalod))
    .then(response => {
      VueNotifications.success({title: response.message});
      commit(types.UPDATE_ICO, ScrapingIcosTransformer.fetch([response.data]));
      Vue.router.push({
        path: '/scraping/icos/all'
      })
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error);
    })
};

export const create = ({ commit }, payalod) => {
  new API()
    .create(ScrapingIcosTransformer.send(payalod))
    .then(response => {
      VueNotifications.success({title: response.message});
      commit(types.CREATE_ICO, ScrapingIcosTransformer.fetch([response.data]));
      Vue.router.push({
        path: '/scraping/icos/all'
      })
    })
    .catch(error => {
      VueNotifications.error({title: error});
      console.error('Request failed. ' + error);
    })
};

export default {
  searchICOs,
  update,
  create
};
