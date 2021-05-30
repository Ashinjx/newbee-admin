import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import ElementUI from 'element-ui';

Vue.use(ElementUI);
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    aid: -1,
    account: '',
    nickname: '',
  },
  mutations: {
    setAid(state, aid) {
      state.aid = aid;
    },
    setAccount(state, account) {
      state.account = account;
    },
    setNickname(state, nickname) {
      state.nickname = nickname;
    },
  },
  actions: {},
  modules: {},
});
