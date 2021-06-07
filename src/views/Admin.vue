<template>
  <div class="newbee_admin">
    <!-- 整体布局 -->
    <el-container class="container">
      <!-- 左侧导航 -->
      <el-aside class="aside">
        <div class="aside_head">
          <img src="https://s.weituibao.com/1582958061265/mlogo.png" alt="" />
          <span>新蜂后台</span>
        </div>
        <div class="line"></div>
        <el-menu :router="true" background-color="#222832" text-color="#fff" active-text-color="#1baeae">
          <el-submenu index="1">
            <template slot="title">
              <span>Dashboard</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/admin/dashboard" @click="eidtPath(1)">
                <i class="el-icon-odometer"></i>
                数据大盘
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <span>首页配置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="eidtPath(4)">
                <i class="el-icon-picture"></i>
                轮播图配置
              </el-menu-item>
              <el-menu-item index="2-2" @click="eidtPath(5)">
                <i class="el-icon-star-on"></i>
                热销商品配置
              </el-menu-item>
              <el-menu-item index="2-3" @click="eidtPath(6)">
                <i class="el-icon-sell"></i>
                新品上线配置
              </el-menu-item>
              <el-menu-item index="2-4" @click="eidtPath(7)">
                <i class="el-icon-thumb"></i>
                为你推荐配置
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <span>模块管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/admin/classify" @click="eidtPath(8)">
                <i class="el-icon-menu"></i>
                分类管理
              </el-menu-item>
              <el-menu-item index="/admin/goodsAdmin" @click="eidtPath(9)">
                <i class="el-icon-goods"></i>
                商品管理
              </el-menu-item>
              <el-menu-item index="3-3" @click="eidtPath(10)">
                <i class="el-icon-user-solid"></i>
                用户管理
              </el-menu-item>
              <el-menu-item index="3-4" @click="eidtPath(11)">
                <i class="el-icon-s-order"></i>
                订单管理
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <span>系统管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="4-1" @click="eidtPath(12)">
                <i class="el-icon-lock"></i>
                修改信息
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 头部信息栏 -->
        <el-header class="header">
          <div class="header_left">
            <span>{{ path }}</span>
          </div>
          <div class="header_right">
            <el-popover placement="bottom" :width="320" trigger="click" popper-class="popper-user-box">
              <template #reference>
                <div class="author">
                  <i class="icon el-icon-s-custom"></i>
                  {{ user.nickname || '游客' }}
                  <i class="el-icon-caret-bottom"></i>
                </div>
              </template>
              <div class="nickname">
                <p>登录名：{{ user.account || '游客' }}</p>
                <p>昵称：{{ user.nickname || '游客' }}</p>
                <el-tag size="small" effect="dark" class="logout" @click="logout">退出</el-tag>
              </div>
            </el-popover>
          </div>
        </el-header>
        <!-- 主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 底部 -->
        <el-footer class="footer">
          <div class="left">
            <p>Ashin</p>
          </div>
          <div class="right">
            <el-link href="https://github.com/Ashinjx/newbee-admin.git" target="_blank">Github</el-link>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<style lang="scss">
@import './sass/admin.scss';
</style>
<script>
export default {
  data() {
    return {
      path: '主页',
      user: JSON.parse(localStorage.getItem('userInfo')),
    };
  },
  mounted() {
    this.pathName();
  },
  methods: {
    //路由跳转后更改title
    eidtPath(val) {
      if (val == 1) {
        this.path = '数据大盘';
      } else if (val == 2) {
        this.path = '添加商品';
      } else if (val == 3) {
        this.path = '修改商品';
      } else if (val == 4) {
        this.path = '轮播图配置';
      } else if (val == 5) {
        this.path = '热销商品配置';
      } else if (val == 6) {
        this.path = '新品上线配置';
      } else if (val == 7) {
        this.path = '为你推荐配置';
      } else if (val == 8) {
        this.path = '分类管理';
      } else if (val == 9) {
        this.path = '商品管理';
      } else if (val == 10) {
        this.path = '用户管理';
      } else if (val == 11) {
        this.path = '订单管理';
      } else if (val == 12) {
        this.path = '修改管理';
      }
    },
    //刷新页面后保持title
    pathName() {
      var endPath = location.hash.split('/');
      if (endPath[2] == 'dashboard') {
        this.path = '数据大盘';
      } else if (endPath[2] == 'addGoods') {
        this.path = '添加商品';
      } else if (endPath[2] == 'editGoods') {
        this.path = '修改商品';
      } else if (endPath[2] == 'carousel') {
        this.path = '轮播图配置';
      } else if (endPath[2] == 'hotSale') {
        this.path = '热销商品配置';
      } else if (endPath[2] == 'newGoods') {
        this.path = '新品上线配置';
      } else if (endPath[2] == 'forYou') {
        this.path = '为你推荐配置';
      } else if (endPath[2] == 'classify') {
        this.path = '分类管理';
      } else if (endPath[2] == 'goodsAdmin') {
        this.path = '商品管理';
      }
    },
    logout() {
      this.$router.push('/');
    },
  },
};
</script>
