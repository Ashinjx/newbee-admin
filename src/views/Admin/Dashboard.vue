<template>
  <div class="dashboard">
    <el-card shadow="always">
      <!-- 订单数据展示 -->
      <div class="order">
        <el-card class="order-item">
          <template #header>
            <div class="card-header">
              <span>今日订单数</span>
            </div>
          </template>
          <div class="item">{{ order }}</div>
        </el-card>
        <el-card class="order-item">
          <template #header>
            <div class="card-header">
              <span>今日日活</span>
            </div>
          </template>
          <div class="item">{{ today }}</div>
        </el-card>
        <el-card class="order-item">
          <template #header>
            <div class="card-header">
              <span>转化率</span>
            </div>
          </template>
          <div class="item">{{ conversion }}</div>
        </el-card>
      </div>
      <!-- echarts组件 -->
      <my-echarts></my-echarts>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.dashboard {
  width: 100%;
  height: 100%;

  .order {
    display: flex;
    justify-content: space-between;
    margin-bottom: 50px;

    .order-item {
      flex: 1;
      margin-right: 20px;
      text-align: left;
      color: #303133;
      font-size: 16px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
<script>
import myEcharts from '@/components/MyEcharts';
export default {
  name: 'MyEcharts',
  components: {
    myEcharts,
  },
  data() {
    return {
      order: 1888, // 订单量
      today: 36271, //日活
      conversion: '20%', //转化率
    };
  },
};
</script>
