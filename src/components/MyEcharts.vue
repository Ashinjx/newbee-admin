<template>
  <!-- 准备一个容器放入图表 -->
  <div id="myChart" class="myChart" style="width: 100%;height:300px;"></div>
</template>
<script>
export default {
  data() {
    return {
      // 图表容器
      myChartEle: null,
      // 保存图表中的数据
      chartData: [
        [120, 132, 101, 134, 90, 230, 210],
        [220, 182, 191, 234, 290, 330, 310],
        [150, 232, 201, 154, 190, 330, 410],
        [320, 332, 301, 334, 390, 330, 320],
        [820, 932, 901, 934, 1290, 1330, 1320],
      ],
      // 定义变量用作开启定时器
      myAddUser: null,
      myUpdate: null,
    };
  },
  mounted() {
    // 调用数据更新
    this.update();
    // 基于准备好的dom，初始化echarts实例
    this.myChartEle = this.echarts.init(document.getElementById('myChart'));
    // 调用图表加载
    this.drawLine();
    // 开启定时器
    this.myUpdate = setInterval(() => this.update(), 2000);
    this.myAddUser = setInterval(() => this.drawLine(), 2000);
  },
  beforeDestroy() {
    //销毁定时器
    clearInterval(this.myUpdate);
    clearInterval(this.myAddUser);
  },
  methods: {
    // 模拟更新图表数据
    update() {
      for (var item of this.chartData) {
        item[item.length - 1] += 20;
      }
    },
    // 加载图表
    drawLine() {
      // 绘制图表
      var option = {
        title: {
          text: '商城总览',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985',
            },
          },
        },
        legend: {
          data: ['新增用户', '付费用户', '活跃用户', '订单数', '当日总收入'],
        },
        toolbox: {
          feature: {
            saveAsImage: {
              title: '下载',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: ['2021-06-01', '2021-06-02', '2021-06-03', '2021-06-04', '2021-06-05', '2021-06-06', '2021-06-07'],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '新增用户',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: this.chartData[0],
          },
          {
            name: '付费用户',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: this.chartData[1],
          },
          {
            name: '活跃用户',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: this.chartData[2],
          },
          {
            name: '订单数',
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: this.chartData[3],
          },
          {
            name: '当日总收入',
            type: 'line',
            stack: '总量',
            label: {
              show: true,
              position: 'top',
            },
            areaStyle: {},
            emphasis: {
              focus: 'series',
            },
            data: this.chartData[4],
          },
        ],
      };
      option && this.myChartEle.setOption(option);
    },
  },
};
</script>
