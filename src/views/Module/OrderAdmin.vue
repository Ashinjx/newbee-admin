<template>
  <div class="orderAdmin">
    <!-- 卡片包裹 -->
    <el-card class="box-card">
      <!-- 卡片header部分 -->
      <template #header>
        <div class="card-header">
          <el-input style="width: 200px; margin-right: 10px" placeholder="请输入订单号" v-model="orderSelect" @change="handleOption" size="small" clearable />
          <el-select @change="handleOption" v-model="orderStatus" size="small" style="width: 200px; margin-right: 10px" :popper-append-to-body="false">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-button type="primary" size="small" icon="el-icon-s-home" @click="handleConfig(multipleSelection)">配货完成</el-button>
          <el-button type="primary" size="small" icon="el-icon-s-home" @click="handleSend(multipleSelection)">出库</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="handleClose(multipleSelection)">关闭订单</el-button>
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
        <el-table-column prop="orderID" label="订单号"> </el-table-column>
        <el-table-column prop="price" label="订单总价"> </el-table-column>
        <el-table-column prop="orderStatus" label="订单状态">
          <template #default="scope">
            <span>{{ scope.row.orderStatus | order }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="payType" label="支付方式">
          <template #default="scope">
            <span>{{ scope.row.payType | payType }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" sortable="custom"> </el-table-column>
        <el-table-column label="操作">
          <!-- 操作按钮 -->
          <template #default="scope">
            <el-popconfirm v-if="scope.row.orderStatus == 1" title="确定配货完成吗？" @confirm="handleConfig([scope.row])">
              <template #reference>
                <a style="cursor: pointer; margin-right: 10px">配货完成</a>
              </template>
            </el-popconfirm>
            <el-popconfirm v-if="scope.row.orderStatus == 2" title="确定出库吗？" @confirm="handleSend([scope.row])">
              <template #reference>
                <a style="cursor: pointer; margin-right: 10px">出库</a>
              </template>
            </el-popconfirm>
            <el-popconfirm v-if="!(scope.row.orderStatus == 4 || scope.row.orderStatus < 0)" title="确定关闭订单吗？" @confirm="handleClose([scope.row])">
              <template #reference>
                <a style="cursor: pointer; margin-right: 10px">关闭订单</a>
              </template>
            </el-popconfirm>
            <a style="cursor: pointer; margin-right: 10px;color: #409eff" @click="orderDetail(scope.row.orderID)">订单详情</a>
          </template>
        </el-table-column>
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
      orderSelect: '', //搜索
      orderStatus: '', //订单状态
      //单选列表
      options: [
        {
          value: '',
          label: '全部',
        },
        {
          value: '0',
          label: '待支付',
        },
        {
          value: 1,
          label: '已支付',
        },
        {
          value: 2,
          label: '配货完成',
        },
        {
          value: 3,
          label: '出库成功',
        },
        {
          value: 4,
          label: '交易成功',
        },
        {
          value: -1,
          label: '手动关闭',
        },
        {
          value: -2,
          label: '超时关闭',
        },
        {
          value: -3,
          label: '商家关闭',
        },
      ],
      tableData: [], // 存放表格数据
      tableData2: [], //备份表格数据
      total: 0, //数据总条数
      pageSize: 10, //每页显示
      currentPage: 1, //当前页
      multipleSelection: [], //存放选中行
    };
  },
  mounted() {
    //加载订单列表
    this.getOrder();
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
    //支付方式过滤器
    payType(oldval) {
      return oldval == 1 ? '微信支付' : oldval == 2 ? '支付宝支付' : '未知';
    },
  },
  methods: {
    //获取订单信息
    getOrder() {
      this.axios.get('/getOrder').then((result) => {
        if (result.data.code == 200) {
          for (var i = 0; i < result.data.result.length; i++) {
            //将返回的价格加工为两位小数点
            result.data.result[i].price = result.data.result[i].price.toFixed(2);
            //将数据库返回的时间加工为给人看的时间
            result.data.result[i].createTime = this.moment(result.data.result[i].createTime).format('YYYY-MM-DD HH:mm:ss');
          }
          //存放到表格中
          this.tableData = result.data.result;
          this.tableData2 = result.data.result;
          this.total = this.tableData.length;
        } else {
          //未查询到数据时
          this.tableData = [];
          this.tableData2 = [];
          this.$message.error('暂无数据');
        }
      });
    },
    //查询数据
    handleOption() {
      //准备一个数组做中转容器
      var arr = [];
      //如果查询数据为空则恢复默认数据
      if (!this.orderSelect && !this.orderStatus) {
        this.getOrder();
        return;
      }
      //遍历订单数据
      for (var item of this.tableData2) {
        if (this.orderSelect == item.orderID && this.orderStatus == '') {
          arr[arr.length] = item;
          this.tableData = arr;
        } else if (this.orderStatus == item.orderStatus && this.orderSelect == '') {
          arr[arr.length] = item;
          this.tableData = arr;
        } else if (this.orderSelect == item.orderID && this.orderStatus == item.orderStatus) {
          arr[arr.length] = item;
          this.tableData = arr;
        }
      }
      //遍历完后中转容器length为0则说明未查询到订单
      if (arr.length == 0) {
        this.$message.error('未查询到订单');
      }
    },
    //获取选中行数据
    handleSelectionChange(val) {
      this.multipleSelection = [];
      for (var i = 0; i < val.length; i++) {
        this.multipleSelection[i] = val[i];
      }
    },
    //配货
    handleConfig(order) {
      //准备一个容器存放传入进来的orderID
      var orderID = [];
      //遍历传进来的数组
      for (var item of order) {
        //不是已支付订单
        if (item.orderStatus != 1) {
          this.$message.error('已支付订单才能进行配货!');
          return;
        }
        //已支付订单
        if (item.orderStatus == 1) {
          //存放orderID
          orderID[orderID.length] = item.orderID;
        }
      }
      //发送请求
      this.axios.put('/setStatus1', `orderID=${orderID}`).then((result) => {
        if (result.data.code == 201) {
          this.$message.success('配货完成');
          this.getOrder();
        } else if (result.data.code == 202) {
          this.$message.error('配货失败');
        }
      });
    },
    //出库
    handleSend(order) {
      //准备一个容器存放传入进来的orderID
      var orderID = [];
      //遍历传进来的数组
      for (var item of order) {
        //不是配货完成的订单
        if (item.orderStatus != 2) {
          this.$message.error('配货完成的订单才能出库!');
          return;
        }
        //配货完成的订单
        if (item.orderStatus == 2) {
          //存放orderID
          orderID[orderID.length] = item.orderID;
        }
      }
      //发送请求
      this.axios.put('/setStatus2', `orderID=${orderID}`).then((result) => {
        if (result.data.code == 201) {
          this.$message.success('出库成功');
          this.getOrder();
        } else if (result.data.code == 202) {
          this.$message.error('出库失败');
        }
      });
    },
    //关闭订单
    handleClose(order) {
      //准备一个容器存放传入进来的orderID
      var orderID = [];
      //遍历传进来的数组
      for (var item of order) {
        //已完成订单或已关闭订单无法再次关闭
        if (item.orderStatus == 4) {
          this.$message.error('已完成订单无法关闭!');
          return;
        } else if (item.orderStatus < 0) {
          this.$message.error('订单已经关闭,无法再次关闭!');
          return;
        } else {
          //符合关闭订单的条件,存放orderID
          orderID[orderID.length] = item.orderID;
        }
      }
      //发送请求
      this.axios.put('/setStatus3', `orderID=${orderID}`).then((result) => {
        if (result.data.code == 201) {
          this.$message.success('关闭订单成功');
          this.getOrder();
        } else if (result.data.code == 202) {
          this.$message.error('关闭订单失败');
        }
      });
    },
    //订单详情
    orderDetail(orderID) {
      this.$router.push(`/admin/orderDetail/${orderID}`);
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
  },
};
</script>
