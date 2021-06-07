import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import * as echarts from 'echarts';
import moment from 'moment';

axios.defaults.baseURL = '/api';
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.prototype.axios = axios;
Vue.prototype.echarts = echarts;
Vue.prototype.moment = moment;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
