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
        <!-- 下拉导航菜单 -->
        <el-menu :router="true" :unique-opened="true" background-color="#222832" text-color="#fff" active-text-color="#1baeae">
          <el-submenu index="1">
            <template slot="title">
              <span>Dashboard</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/admin/dashboard" @click="eidtPath('dashboard')">
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
              <el-menu-item index="/admin/carousel" @click="eidtPath('carousel')">
                <i class="el-icon-picture"></i>
                轮播图配置
              </el-menu-item>
              <el-menu-item index="/admin/hotSale" @click="eidtPath('hotSale')">
                <i class="el-icon-star-on"></i>
                热销商品配置
              </el-menu-item>
              <el-menu-item index="/admin/newGood" @click="eidtPath('newGood')">
                <i class="el-icon-sell"></i>
                新品上线配置
              </el-menu-item>
              <el-menu-item index="/admin/forYou" @click="eidtPath('forYou')">
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
              <el-menu-item index="/admin/classify" @click="eidtPath('classify')">
                <i class="el-icon-menu"></i>
                分类管理
              </el-menu-item>
              <el-menu-item index="/admin/goodsAdmin" @click="eidtPath('goodsAdmin')">
                <i class="el-icon-goods"></i>
                商品管理
              </el-menu-item>
              <el-menu-item index="/admin/userAdmin" @click="eidtPath('userAdmin')">
                <i class="el-icon-user-solid"></i>
                用户管理
              </el-menu-item>
              <el-menu-item index="/admin/orderAdmin" @click="eidtPath('orderAdmin')">
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
              <el-menu-item index="/admin/updateInfo" @click="eidtPath('updateInfo')">
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
            <!-- 当前位置 -->
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
              <!-- 弹出框 -->
              <div class="nickname">
                <p>登录名：{{ user.account || '游客' }}</p>
                <p>昵称：{{ user.nickname || '游客' }}</p>
                <el-tag size="small" effect="dark" class="logout" @click="logout">退出</el-tag>
              </div>
            </el-popover>
          </div>
        </el-header>
        <el-main>
          <!-- 主体预留给子组件 -->
          <router-view></router-view>
        </el-main>
        <!-- 底部 -->
        <el-footer class="footer">
          <div class="left">
            <p>{{ time }}</p>
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
      pathName: location.hash.split('/')[2], //获取路由锚点
      path: '主页', //默认为主页
      user: JSON.parse(localStorage.getItem('userInfo')) || {}, //从localStorage获取管理员信息
      time: '', //当前时间
      week: ['日', '一', '二', '三', '四', '五', '六'], //保存星期
      myTime: '', //刷新时间
    };
  },
  mounted() {
    //判断是否登录
    if (!this.user.account) {
      //未登录则返回登录页
      this.$router.push('/');
      this.$message.error('管理员未登录');
    }
    //获取当前路由
    this.getPathName();
    //获取时间
    this.getTime();
    //开启定时器每秒刷新时间
    this.myTime = setInterval(() => this.getTime(), 1000);
  },
  beforeDestroy() {
    //销毁定时器
    clearInterval(this.myTime);
  },
  computed: {
    ...mapState(['pathMap']),
  },

  methods: {
    //路由跳转后更改title
    eidtPath(pathMap) {
      this.path = this.pathMap[pathMap];
    },
    //刷新页面后保持title
    getPathName() {
      this.path = this.pathMap[this.pathName];
    },
    //退出登录
    logout() {
      this.$router.push('/');
    },
    //获取时间
    getTime() {
      var year = new Date().getFullYear();
      var month = new Date().getMonth() + 1;
      var date = new Date().getDate();
      var hour = new Date().getHours();
      var minute = new Date().getMinutes();
      var day = new Date().getDay();
      if (month < 10) {
        month = '0' + month;
      }
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (minute < 10) {
        minute = '0' + minute;
      }
      this.time = `${year}年${month}月${date}日  ${hour}时${minute}分  星期${this.week[day]}`;
    },
  },
};
</script>
