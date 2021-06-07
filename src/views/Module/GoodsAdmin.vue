<template>
  <div class="goodsAdmin">
    <!-- 卡片包裹 -->
    <el-card class="box-card">
      <!-- header部分按钮 -->
      <template #header>
        <div class="card-header">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="toAddGood">新增商品</el-button>
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
        > >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="goodID" label="商品编号" sortable="custom"> </el-table-column>
        <el-table-column prop="name" label="商品名"> </el-table-column>
        <el-table-column prop="intr" label="商品简介"> </el-table-column>
        <el-table-column prop="imageUrl" label="商品主图" width="150px">
          <template #default="scope">
            <img style="width: 100px; height: 100px;" :src="scope.row.imageUrl" :key="scope.row.goodId" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="商品库存"> </el-table-column>
        <el-table-column prop="salePrice" label="商品售价"> </el-table-column>
        <el-table-column prop="onSale" label="上架状态">
          <template #default="scope">
            <span style="color: green;" v-if="scope.row.onSale == 0">销售中</span>
            <span style="color: red;" v-else>已下架</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <!-- 操作按钮 修改/上架 -->
          <template #default="scope">
            <a style="cursor: pointer; margin-right: 10px;color: #409eff" @click="toEditGood(scope.row)">修改</a>
            <a style="cursor: pointer; margin-right: 10px;color: #409eff" v-if="scope.row.onSale == 0" @click="handleStatus(scope.row.goodID, 1)">下架</a>
            <a style="cursor: pointer; margin-right: 10px;color: #409eff" v-else @click="handleStatus(scope.row.goodID, 0)">上架</a>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page="currentPage" @current-change="currentChange">
      </el-pagination>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
@import './sass/goodsAdmin.scss';
</style>
<script>
export default {
  data() {
    return {
      tableData: [], //存放表格数据
      total: 0, //数据总条数
      pageSize: 10, //每页显示
      currentPage: 1, //当前页
    };
  },
  mounted() {
    //载入商品列表
    this.getGoods();
  },
  methods: {
    //请求表格数据
    getGoods() {
      this.axios.get('/getGoods').then((result) => {
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
    //选中行
    handleSelectionChange() {},
    //控制分页
    currentChange(currentPage) {
      this.currentPage = currentPage;
    },
    //添加商品
    toAddGood() {
      this.$router.push({ path: '/admin/addGoods' });
    },
    //修改商品
    toEditGood(row) {
      this.$router.push({ path: `/admin/editGoods/${row.goodID}` });
    },
    //修改上架状态
    handleStatus(goodID, onSale) {
      this.axios.put('/editOnsale', `goodID=${goodID}&onSale=${onSale}`).then((result) => {
        if (result.data.code == 201) {
          this.$message.success('修改成功');
          this.getGoods();
        } else {
          this.$message.error('修改失败');
        }
      });
    },
  },
};
</script>
