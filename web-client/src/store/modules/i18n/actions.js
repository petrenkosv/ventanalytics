import * as types from './mutation-types';

export const setLanguage = ({ commit }, language) => {
  commit(types.SET_LANGUAGE, language);
};

export default {
  setLanguage
};
