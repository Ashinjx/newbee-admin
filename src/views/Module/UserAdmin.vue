<template>
  <div class="userAdmin">
    <!-- 卡片包裹 -->
    <el-card class="box-card">
      <!-- header部分按钮 -->
      <template #header>
        <div class="card-header">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="relieve(multipleSelection)">解除禁用</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="banUser(multipleSelection)">禁用账户</el-button>
        </div>
      </template>
      <!-- 主体表格 -->
      <el-table
        ref="multipleTable"
        :data="tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="nickname" label="昵称"> </el-table-column>
        <el-table-column prop="account" label="登录名"> </el-table-column>
        <el-table-column prop="status" label="身份状态">
          <template #default="scope">
            <!-- 判断身份状态为0则显示绿色正常,否则显示红色禁用 -->
            <span :style="scope.row.status == 0 ? 'color: green' : 'color:red'"> {{ scope.row.status == 0 ? '正常' : '禁用' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isLogout" label="是否注销">
          <template #default="scope">
            <!-- 判断是否注销,isLogout为0则显示绿色正常,否则显示红色禁用 -->
            <span :style="scope.row.isLogout == 0 ? 'color: green' : 'color:red'"> {{ scope.row.isLogout == 0 ? '正常' : '注销' }}</span>
          </template>
        </el-table-column>
        <!-- 按照注册时间排序 -->
        <el-table-column prop="regTime" label="注册时间" sortable="custom"> </el-table-column>
      </el-table>
      <!-- 分页控制 -->
      <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page="currentPage" @current-change="currentChange">
      </el-pagination>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
@import './sass/module.scss';
</style>
<script>
export default {
  data() {
    return {
      tableData: [], //存放表格数据
      total: 0, //数据总条数
      pageSize: 10, //每页显示
      currentPage: 1, //当前页
      multipleSelection: [],
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    //获取用户信息放入表格
    getUsers() {
      this.axios.get('/getUsers').then((result) => {
        for (var i = 0; i < result.data.result.length; i++) {
          result.data.result[i].regTime = this.moment(result.data.result[i].regTime).format('YYYY-MM-DD HH:mm:ss');
        }
        //存放到表格中
        this.tableData = result.data.result;
        this.total = this.tableData.length;
      });
    },
    //表格排序
    sortChange({ prop, order }) {
      this.tableData.sort(this.compare(prop, order));
    },
    //自定义排序规则
    compare(propertyName, sort) {
      return function(obj1, obj2) {
        var value1 = obj1[propertyName];
        var value2 = obj2[propertyName];
        if (typeof value1 === 'string' && typeof value2 === 'string') {
          const res = value1.localeCompare(value2, 'zh');
          return sort === 'ascending' ? res : -res;
        } else {
          if (value1 <= value2) {
            return sort === 'ascending' ? -1 : 1;
          } else if (value1 > value2) {
            return sort === 'ascending' ? 1 : -1;
          }
        }
      };
    },
    //控制分页
    currentChange(currentPage) {
      this.currentPage = currentPage;
    },
    //获取选中列uid
    handleSelectionChange(val) {
      this.multipleSelection = [];
      for (var i = 0; i < val.length; i++) {
        this.multipleSelection[i] = val[i].uid;
      }
    },
    //解除禁用
    relieve(uid) {
      this.axios.put('/relieveUser', `uid=${uid}`).then((result) => {
        if (result.data.code == 201) {
          this.$message.success('修改成功');
          this.getUsers();
        } else if (result.data.code == 202) {
          this.$message.error('修改失败');
        }
      });
    },
    //禁用账户
    banUser(uid) {
      this.axios.put('/banUser', `uid=${uid}`).then((result) => {
        if (result.data.code == 201) {
          this.$message.success('修改成功');
          this.getUsers();
        } else if (result.data.code == 202) {
          this.$message.error('修改失败');
        }
      });
    },
  },
};
</script>
