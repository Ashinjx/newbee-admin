import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/Admin.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/Admin/Dashboard.vue'),
      },
      {
        path: 'addGoods',
        name: 'AddGoods',
        component: () => import(/* webpackChunkName: "addGoods" */ '../views/Admin/MyGoods.vue'),
      },
      {
        path: 'editGoods/:goodID',
        name: 'EditGoods',
        component: () => import(/* webpackChunkName: "editGoods" */ '../views/Admin/MyGoods.vue'),
      },
      {
        path: 'classify',
        name: 'Classify',
        component: () => import(/* webpackChunkName: "classify" */ '../views/Module/Classify.vue'),
      },
      {
        path: 'goodsAdmin',
        name: 'GoodsAdmin',
        component: () => import(/* webpackChunkName: "goodsAdmin" */ '../views/Module/GoodsAdmin.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
