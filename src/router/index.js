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
        path: 'carousel',
        name: 'Carousel',
        component: () => import(/* webpackChunkName: "carousel" */ '../views/Index/Carousel.vue'),
      },
      {
        path: 'hotSale',
        name: 'HotSale',
        component: () => import(/* webpackChunkName: "hotSale" */ '../views/Index/HotSale.vue'),
      },
      {
        path: 'newGood',
        name: 'NewGood',
        component: () => import(/* webpackChunkName: "newGood" */ '../views/Index/NewGood.vue'),
      },
      {
        path: 'forYou',
        name: 'ForYou',
        component: () => import(/* webpackChunkName: "forYou" */ '../views/Index/ForYou.vue'),
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
        path: 'userAdmin',
        name: 'UserAdmin',
        component: () => import(/* webpackChunkName: "userAdmin" */ '../views/Module/UserAdmin.vue'),
      },
      {
        path: 'orderAdmin',
        name: 'OrderAdmin',
        component: () => import(/* webpackChunkName: "orderAdmin" */ '../views/Module/OrderAdmin.vue'),
      },
      {
        path: 'orderDetail/:orderID',
        name: 'OrderDetail',
        component: () => import(/* webpackChunkName: "orderDetail" */ '../views/Module/OrderDetail.vue'),
      },
      {
        path: 'updateInfo',
        name: 'UpdateInfo',
        component: () => import(/* webpackChunkName: "updateInfo" */ '../views/SystemAdmin/UpdateInfo.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
