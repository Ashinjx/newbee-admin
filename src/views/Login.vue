<template>
  <div class="newbee_login">
    <div class="login_body">
      <div class="login_form">
        <div class="head">
          <img class="logo" src="https://s.weituibao.com/1582958061265/mlogo.png" alt="" />
          <div class="title">
            <div>新蜂商城</div>
            <div>后台管理系统</div>
          </div>
        </div>
        <!-- 登录表单 -->
        <el-form :model="login_form" :rules="rules" ref="login_form">
          <el-form-item label="账号" prop="account">
            <el-input v-model="login_form.account" @keyup.enter.native="login('login_form')"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="login_form.password" @keyup.enter.native="login('login_form')"></el-input>
          </el-form-item>
          <el-form-item>
            <div>登录表示您已同意<a>《服务条款》</a></div>
            <el-button type="primary" @click="login('login_form')">立即登录</el-button>
            <el-checkbox v-model="checked" :checked="checked">记住密码</el-checkbox>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import './sass/login.scss';
</style>
<script>
import jwtDecode from 'jwt-decode';
export default {
  data() {
    return {
      // 登录表单绑定变量
      login_form: {
        account: '',
        password: '',
      },
      // 登录数据验证
      rules: {
        account: [
          { required: true, message: '账户不能为空', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' },
        ],
      },
      // 是否选中
      checked: '',
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    //读取cookie中登录信息
    getUserInfo() {
      var user = JSON.parse(localStorage.getItem('userInfo'));
      console.log(user.checked);
      if (user.checked == true) {
        this.login_form.account = user.account;
        this.login_form.password = user.password;
        this.checked = true;
      }
      if (user.checked == false) {
        this.checked = false;
      }
    },
    //登录
    login(login_form) {
      //验证表单规则
      this.$refs[login_form].validate((valid) => {
        if (valid) {
          //发送axios请求
          this.axios.post('/login', `account=${this.login_form.account}&password=${this.login_form.password}`).then((result) => {
            if (result.data.code == 200) {
              this.$message.success('登录成功');
              //登录成功保存信息至Session
              const userObj = jwtDecode(result.data.token);
              userObj.checked = this.checked;
              localStorage.setItem('userInfo', JSON.stringify(userObj));
              // 跳转主页
              this.$router.push(`/admin/dashboard`);
            } else {
              // 登录失败,弹窗提示
              this.$message.error('用户名或密码错误');
            }
          });
        } else {
          //验证不通过
          return false;
        }
      });
    },
  },
};
</script>
