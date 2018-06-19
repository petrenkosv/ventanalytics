import * as types from './mutation-types';

export default {
  [types.SET_LANGUAGE] (state, lang) {
    if (state.locales.indexOf(lang) !== -1) {
      state.lang = lang
    }
  }
}
