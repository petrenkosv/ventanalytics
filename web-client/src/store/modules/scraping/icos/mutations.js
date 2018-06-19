import * as types from './mutation-types';

export default {
  [types.SEARCH_ICOS] (state, array) {
    state.icos = array;
    state.icosLength = Object.keys(array).length
  },
  [types.UPDATE_ICO] (state, array) {
    let id = Object.keys(array)[0];
    state.icos[id] = array[id];
  },
  [types.CREATE_ICO] (state, array) {
    let id = Object.keys(array)[0];
    state.icos[id] = array[id];
    state.icosLength += 1;
  },
  [types.CLEAR] (state) {
    state.icos = {};
    state.icosLength = 0;
  }
};
