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
        <el-menu :router="true" @open="handleOpen" @close="handleClose" background-color="#222832" text-color="#fff" active-text-color="#1baeae">
          <el-submenu index="1">
            <template slot="title">
              <span>Dashboard</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/admin/dashboard" @click="dashboard">
                <i class="el-icon-odometer"></i>
                数据大盘
              </el-menu-item>
              <el-menu-item index="1-2" @click="addGoods">
                <i class="el-icon-plus"></i>
                添加商品
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <span>首页配置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="carousel">
                <i class="el-icon-picture"></i>
                轮播图配置
              </el-menu-item>
              <el-menu-item index="2-2" @click="hotSale">
                <i class="el-icon-star-on"></i>
                热销商品配置
              </el-menu-item>
              <el-menu-item index="2-3" @click="newGoods">
                <i class="el-icon-sell"></i>
                新品上线配置
              </el-menu-item>
              <el-menu-item index="2-4" @click="forYou">
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
              <el-menu-item index="3-1" @click="classifyAdmin">
                <i class="el-icon-menu"></i>
                分类管理
              </el-menu-item>
              <el-menu-item index="3-2" @click="goodsAdmin">
                <i class="el-icon-goods"></i>
                商品管理
              </el-menu-item>
              <el-menu-item index="3-3" @click="userAdmin">
                <i class="el-icon-user-solid"></i>
                用户管理
              </el-menu-item>
              <el-menu-item index="3-4" @click="orderAdmin">
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
              <el-menu-item index="4-1" @click="update">
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
                  {{ nickname || '游客' }}
                  <i class="el-icon-caret-bottom"></i>
                </div>
              </template>
              <div class="nickname">
                <p>登录名：{{ account || '游客' }}</p>
                <p>昵称：{{ nickname || '游客' }}</p>
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
import { mapState } from 'vuex';
export default {
  data() {
    return {
      path: '主页',
    };
  },
  computed: {
    ...mapState(['aid', 'account', 'nickname']),
  },
  methods: {
    handleOpen(key, keyPath) {
      // console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      // console.log(key, keyPath);
    },
    dashboard() {
      this.path = '数据大盘';
    },
    addGoods() {
      this.path = '添加商品';
    },
    carousel() {
      this.path = '轮播图配置';
    },
    hotSale() {
      this.path = '热销商品配置';
    },
    newGoods() {
      this.path = '新品上线配置';
    },
    forYou() {
      this.path = '为你推荐配置';
    },
    classifyAdmin() {
      this.path = '分类管里';
    },
    goodsAdmin() {
      this.path = '商品管理';
    },
    userAdmin() {
      this.path = '用户管理';
    },
    orderAdmin() {
      this.path = '订单管理';
    },
    update() {
      this.path = '修改信息';
    },
    logout() {
      this.$router.push('/');
    },
  },
};
</script>
