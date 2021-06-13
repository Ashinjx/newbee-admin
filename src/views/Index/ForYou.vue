<template>
  <div class="forYou">
    <!-- 卡片包裹 -->
    <el-card class="box-card">
      <!-- 卡片header部分 -->
      <template #header>
        <div class="card-header">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addForYou">增加</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="deleteForYou(...multipleSelection)">
            <template #reference>
              <el-button type="danger" size="small" icon="el-icon-delete">批量删除</el-button>
            </template>
          </el-popconfirm>
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
        <el-table-column prop="goodName" label="商品名称"> </el-table-column>
        <el-table-column label="跳转连接">
          <template #default="scope">
            <a target="_blank" :href="scope.row.jumpUrl">{{ scope.row.jumpUrl }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="sortValue" label="排序值" sortable="custom" width="120"> </el-table-column>
        <el-table-column prop="goodID" label="商品编号" width="200"> </el-table-column>
        <el-table-column prop="createTime" label="添加时间" width="200"> </el-table-column>
        <el-table-column label="操作" width="100">
          <!-- 操作按钮 修改/下级分类/删除 -->
          <template #default="scope">
            <a style="cursor: pointer; margin-right: 10px;color: #409eff" @click="editForYou(scope.row)">修改</a>
            <!-- 确认删除后触发删除请求 -->
            <el-popconfirm title="确定删除吗？" @confirm="deleteForYou(scope.row.goodID)">
              <template #reference>
                <a style="cursor: pointer;color: #409eff">删除</a>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页控制 -->
      <el-pagination background layout="prev, pager, next" :total="total" :page-size="pageSize" :current-page="currentPage" @current-change="currentChange">
      </el-pagination>
    </el-card>
    <!-- 添加/修改商品对话框-->
    <el-dialog :title="type == 'add' ? '添加商品' : '修改商品'" :visible="visible" width="400px">
      <el-form :model="forYouForm" :rules="rules" label-width="100px" ref="forYouForm" class="good-form">
        <el-form-item label="商品名称" prop="goodName">
          <el-input type="text" v-model="forYouForm.goodName"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接" prop="jumpUrl">
          <el-input type="text" v-model="forYouForm.jumpUrl"></el-input>
        </el-form-item>
        <el-form-item label="排序值" prop="sortValue">
          <el-input type="number" v-model="forYouForm.sortValue"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false" class="off">取 消</el-button>
          <el-button type="primary" @click="send('forYouForm')">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
@import './sass/module.scss';
</style>
<script>
export default {
  data() {
    return {
      tableData: [], // 存放表格数据
      total: 0, //数据总条数
      pageSize: 10, //每页显示
      currentPage: 1, //当前页
      visible: false, //控制对话框隐藏
      type: 'add', //控制对话框title
      forYouForm: {}, //对话框表单
      rules: {
        //对话框表单验证
        goodName: [{ required: 'true', message: '名称不能为空', trigger: ['change'] }],
        sortValue: [{ required: 'true', message: '排序不能为空', trigger: ['change'] }],
      },
      multipleSelection: [], //暂存选中行ID
    };
  },
  mounted() {
    //调用函数获取表格数据
    this.getForYou();
  },
  methods: {
    //获取商品列表
    getForYou() {
      this.axios.get('/getForYou').then((result) => {
        if (result.data.code == 200) {
          for (var i = 0; i < result.data.result.length; i++) {
            //将数据库返回的时间转换为人看的时间
            result.data.result[i].createTime = this.moment(result.data.result[i].createTime).format('YYYY-MM-DD HH:mm:ss');
            console.log();
          }
          //存放到表格中
          this.tableData = result.data.result;
          this.total = this.tableData.length;
        } else {
          //未查询到数据时
          this.tableData = [];
          this.$message.error('暂无数据');
        }
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
    //新增商品弹窗
    addForYou() {
      this.visible = true;
      this.type = 'add';
      //默认表单对象的各属性值为空
      this.forYouForm = {
        goodID: '',
        goodName: '',
        jumpUrl: '',
        sortValue: '',
      };
    },
    //修改商品弹窗
    editForYou(row) {
      this.visible = true;
      //修改title
      this.type = 'edit';
      //将行数据解构到表单对象中(避免引用同一地址)
      this.forYouForm = { ...row };
    },
    //获取选中列goodID
    handleSelectionChange(val) {
      this.multipleSelection = [];
      for (var i = 0; i < val.length; i++) {
        this.multipleSelection[i] = val[i].goodID;
      }
    },
    //删除商品
    deleteForYou(...goodID) {
      this.axios
        .delete(`/deleteForYou/${goodID}`)
        .then((result) => {
          if (result.data.code == 1) {
            this.$message.success('删除成功');
            //重新载入商品表格
            this.getForYou();
          } else {
            this.$message.error('删除失败');
          }
        })
        .catch((err) => console.log(err));
    },
    //发送新增,修改商品的请求
    send(forYouForm) {
      //验证表单value是否符合规则
      this.$refs[forYouForm].validate((valid) => {
        if (valid) {
          // 如果没有传入ID, 则判断为添加;
          if (this.forYouForm.goodID == '') {
            // 发送添加请求;
            this.axios
              .post(`/addForYou`, `goodName=${this.forYouForm.goodName}&jumpUrl=${this.forYouForm.jumpUrl}&sortValue=${this.forYouForm.sortValue}`)
              .then((result) => {
                if (result.data.code == 201) {
                  this.$message.success('添加成功');
                  //关闭对话框
                  this.visible = false;
                  //重新载入轮播图表格
                  this.getForYou();
                } else {
                  this.$message.error('添加失败');
                }
              })
              .catch((err) => console.log(err));
          } else if (this.forYouForm.goodID != '') {
            // 发送修改请求;
            this.axios
              .put(
                `/editForYou`,
                `goodName=${this.forYouForm.goodName}&jumpUrl=${this.forYouForm.jumpUrl}&sortValue=${this.forYouForm.sortValue}&goodID=${this.forYouForm.goodID}`
              )
              .then((result) => {
                console.log(result);
                if (result.data.code == 201) {
                  this.$message.success('修改成功');
                  //关闭对话框
                  this.visible = false;
                  //重新载入轮播图表格
                  this.getForYou();
                } else {
                  this.$message.error('修改失败');
                }
              })
              .catch((err) => console.log(err));
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
