import Vue from 'vue';
import Vuex from 'vuex';
import ElementUI from 'element-ui';

Vue.use(ElementUI);
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    aid: -1,
    account: '',
    nickname: '',
    pathMap: {
      dashboard: '数据大盘',
      carousel: '轮播图配置',
      hotSale: '热销商品配置',
      newGood: '新品上线配置',
      forYou: '为你推荐配置',
      classify: '分类管理',
      goodsAdmin: '商品管理',
      addGoods: '商品管理',
      editGoods: '商品管理',
      userAdmin: '用户管理',
      orderAdmin: '订单管理',
      orderDetail: '订单管理',
      updateInfo: '修改信息',
    },
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
