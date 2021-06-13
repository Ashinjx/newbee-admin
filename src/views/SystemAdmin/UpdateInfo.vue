<template>
  <div class="updateInfo">
    <!-- 修改登录名和昵称 -->
    <el-card class="box-card">
      <el-form :model="infoForm" :rules="rules" ref="infoForm" label-width="80px">
        <el-form-item label="登录名: " prop="account">
          <el-input v-model="infoForm.account"></el-input>
        </el-form-item>
        <el-form-item label="昵称: " prop="nickname">
          <el-input v-model="infoForm.nickname"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitName('infoForm')">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 修改密码 -->
    <el-card class="box-card">
      <el-form :model="pwdForm" :rules="rules" ref="pwdForm" label-width="80px">
        <el-form-item label="原密码: " prop="oldPassword">
          <el-input v-model="pwdForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码: " prop="newPassword">
          <el-input v-model="pwdForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitPass('pwdForm')">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
$newbeeColor: #1baeae;

.updateInfo {
  width: 100%;
  height: 100%;

  //卡片
  /deep/.el-card.is-always-shadow {
    margin-bottom: 20px;

    //表单
    .el-form-item.is-required {
      text-align: left;

      //表单label
      .el-form-item__label {
        padding-right: 20px;
      }

      //输入框
      .el-input {
        width: 200px;

        .el-input__inner:focus {
          border-color: $newbeeColor;
          outline: 0;
        }
      }
    }

    .el-form-item {
      .el-form-item__content {
        text-align: left;
      }
    }
  }
}
</style>
<script>
export default {
  data() {
    return {
      //从浏览器缓存中读取用户信息
      user: JSON.parse(localStorage.getItem('userInfo')),
      // 修改基本信息表单
      infoForm: {
        account: '',
        nickname: '',
      },
      //修改密码表单
      pwdForm: {
        oldPassword: '',
        newPassword: '',
      },
      //验证规则
      rules: {
        account: [{ required: true, message: '登录名不能为空', trigger: 'blur' }],
        nickname: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
        oldPassword: [{ required: true, message: '原密码不能为空', trigger: 'change' }],
        newPassword: [{ required: true, message: '新密码不能为空', trigger: 'change' }],
      },
    };
  },
  mounted() {
    //填充用户名
    this.setInfoForm();
  },
  methods: {
    //填充用户名
    setInfoForm() {
      this.infoForm.account = this.user.account;
      this.infoForm.nickname = this.user.nickname;
    },
    //修改用户名
    submitName(infoForm) {
      this.$refs[infoForm].validate((valid) => {
        if (valid) {
          this.axios.put('/editAdmin', `account=${this.infoForm.account}&nickname=${this.infoForm.nickname}&aid=${this.user.aid}`).then((result) => {
            console.log(result);
            if (result.data.code == 201) {
              this.$message.success('修改成功,一秒后跳转登录页');
              setTimeout(() => {
                this.$router.push('/'); //跳转登录页
              }, 1000);
            } else if (result.data.code == 202) {
              this.$message.error('修改失败');
            }
          });
        } else {
          return false;
        }
      });
    },
    //修改密码
    submitPass(pwdForm) {
      this.$refs[pwdForm].validate((valid) => {
        if (valid) {
          if (this.pwdForm.oldPassword != this.user.password) {
            this.$message.error('旧密码输入错误');
          } else if (this.pwdForm.newPassword == this.user.password) {
            this.$message.error('新密码不能和旧密码一致');
          } else {
            this.axios.put('/editPassword', `password=${this.pwdForm.newPassword}&aid=${this.user.aid}`).then((result) => {
              console.log(result);
              if (result.data.code == 201) {
                this.$message.success('修改成功,一秒后跳转登录页');
                setTimeout(() => {
                  this.$router.push('/'); //跳转登录页
                }, 2000);
              } else if (result.data.code == 202) {
                this.$message.error('修改失败');
              }
            });
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
