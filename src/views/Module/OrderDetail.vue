<template>
  <div class="orderDetail">
    <!-- 卡片包裹 -->
    <el-card class="box-card">
      <template #header>
        <div>
          <i class="el-icon-back" @click="back"></i>
          <span class="back">返回订单列表</span>
        </div>
      </template>
      <!-- 订单详情基本详细 -->
      <div class="orderInfo">
        <el-card class="data-item" shadow="hover">
          <template #header>
            <span>订单状态</span>
          </template>
          <div>{{ order.orderStatus | order }}</div>
        </el-card>
        <el-card class="data-item" shadow="hover">
          <template #header>
            <span>创建时间</span>
          </template>
          <div>{{ order.createTime }}</div>
        </el-card>
        <el-card class="data-item" shadow="hover">
          <template #header>
            <span>订单号</span>
          </template>
          <div>{{ order.orderID }}</div>
        </el-card>
      </div>
      <!-- 订单详情表格 -->
      <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="商品图片">
          <template #default="scope">
            <img style="width: 100px" :key="scope.row.imageUrl" :src="scope.row.imageUrl" alt="商品主图" />
          </template>
        </el-table-column>
        <el-table-column prop="goodID" label="商品编号"> </el-table-column>
        <el-table-column prop="name" label="商品名"></el-table-column>
        <el-table-column prop="count" label="商品数量"> </el-table-column>
        <el-table-column prop="price" label="价格"> </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
@import './sass/orderDetail.scss';
</style>
<script>
export default {
  data() {
    return {
      orderID: location.hash.split('/')[3], //获取url中的订单号
      order: {
        orderStatus: '', //订单状态
        createTime: '', //创建时间
        orderID: '', //订单号
      },
      tableData: [], //表格数据
    };
  },
  filters: {
    //订单状态过滤器
    order(oldVal) {
      switch (oldVal) {
        case 0:
          return '待支付';
        case 1:
          return '已支付';
        case 2:
          return '配货完成';
        case 3:
          return '出库成功';
        case 4:
          return '交易成功';
        case -1:
          return '手动关闭';
        case -2:
          return '超时关闭';
        case -3:
          return '商家关闭';
      }
    },
  },
  mounted() {
    this.getOrder();
    this.getOrderDetail();
  },
  methods: {
    //后退
    back() {
      this.$router.back();
    },
    //获取单个订单信息
    getOrder() {
      this.axios.get(`/getOrder/${this.orderID}`).then((result) => {
        if (result.data.code == 200) {
          result.data.result[0].createTime = this.moment(result.data.result[0].createTime).format('YYYY-MM-DD HH:mm:ss');
          this.order = result.data.result[0];
        } else {
          this.$message.error('查询失败');
        }
      });
    },
    //获取订单详情
    getOrderDetail() {
      this.axios.get(`/getOrderDetail/${this.orderID}`).then((result) => {
        if (result.data.code == 200) {
          this.tableData = result.data.result;
        } else {
          this.$message.error('查询失败');
        }
      });
    },
  },
};
</script>
