<template>
  <div class="newGood">
    <!-- 卡片包裹 -->
    <el-card class="box-card">
      <!-- 卡片header部分 -->
      <template #header>
        <div class="card-header">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addNewGood">增加</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="deleteNewGood(...multipleSelection)">
            <template #reference>
              <el-button type="danger" size="small" icon="el-icon-delete">批量删除</el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
      <!-- 主体表格 -->
      <el-table
        v-loading="loading"
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
          <!-- 操作按钮 修改/删除 -->
          <template #default="scope">
            <a style="cursor: pointer; margin-right: 10px;color: #409eff" @click="editNewGood(scope.row)">修改</a>
            <!-- 确认删除后触发删除请求 -->
            <el-popconfirm title="确定删除吗？" @confirm="deleteNewGood(scope.row.newID)">
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
    <!-- 添加/修改商品对话框(待修改)-->
    <el-dialog :title="type == 'add' ? '添加商品' : '修改商品'" :visible="visible" width="400px">
      <el-form :model="newGoodForm" :rules="rules" label-width="100px" ref="newGoodForm" class="good-form">
        <el-form-item label="商品名称" prop="goodID">
          <el-select clearable v-model="newGoodForm.goodID" placeholder="请选择商品" :popper-append-to-body="false">
            <el-option v-for="(i, k) of options" :key="k" :label="options[k].label" :value="options[k].value" style="width: 300px"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转链接" prop="jumpUrl">
          <el-input type="text" v-model="newGoodForm.jumpUrl"></el-input>
        </el-form-item>
        <el-form-item label="排序值" prop="sortValue">
          <el-input type="number" v-model="newGoodForm.sortValue"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false" class="off">取 消</el-button>
          <el-button type="primary" @click="send('newGoodForm')">确 定</el-button>
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
      loading: true,
      tableData: [], // 存放表格数据
      total: 0, //数据总条数
      pageSize: 10, //每页显示
      currentPage: 1, //当前页
      visible: false, //控制对话框隐藏
      type: 'add', //控制对话框title
      newGoodForm: {}, //对话框表单
      options: [], //选择框
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
    this.getNewGood();
    // 获取商品option
    this.getOptions();
  },
  methods: {
    // 获取商品option
    getOptions() {
      this.axios.get('/getGood/options').then((result) => {
        if (result.data.code == 200) {
          for (var i = 0; i < result.data.result.length; i++) {
            this.options[i] = {
              value: result.data.result[i].goodID,
              label: result.data.result[i].name,
            };
          }
        }
      });
    },
    //获取商品列表
    getNewGood() {
      this.axios.get('/getNewGood').then((result) => {
        if (result.data.code == 200) {
          for (var i = 0; i < result.data.result.length; i++) {
            //将数据库返回的时间转换为人看的时间
            result.data.result[i].createTime = this.moment(result.data.result[i].createTime).format('YYYY-MM-DD HH:mm:ss');
          }
          //存放到表格中
          this.tableData = result.data.result;
          this.total = this.tableData.length;
        } else {
          //未查询到数据时
          this.tableData = [];
          this.$message.error('暂无数据');
        }
        this.loading = false;
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
    addNewGood() {
      this.visible = true;
      this.type = 'add';
      //默认表单对象的各属性值为空
      this.newGoodForm = {
        goodID: '',
        goodName: '',
        jumpUrl: '',
        sortValue: '',
      };
    },
    //修改商品弹窗
    editNewGood(row) {
      this.visible = true;
      //修改title
      this.type = 'edit';
      //将行数据解构到表单对象中(避免引用同一地址)
      this.newGoodForm = { ...row };
    },
    //获取选中列goodID
    handleSelectionChange(val) {
      this.multipleSelection = [];
      for (var i = 0; i < val.length; i++) {
        this.multipleSelection[i] = val[i].newID;
      }
    },
    //删除商品
    deleteNewGood(...newID) {
      this.axios
        .delete(`/deleteNewGood/${newID}`)
        .then((result) => {
          if (result.data.code == 1) {
            this.$message.success('删除成功');
            //重新载入商品表格
            this.getNewGood();
          } else {
            this.$message.error('删除失败');
          }
        })
        .catch((err) => console.log(err));
    },
    //发送新增,修改商品的请求
    send(newGoodForm) {
      //验证表单value是否符合规则
      this.$refs[newGoodForm].validate((valid) => {
        if (valid) {
          // 如果没有传入ID, 则判断为添加;
          if (this.newGoodForm.newID == undefined) {
            // 发送添加请求;
            this.axios
              .post(`/addNewGood`, `goodID=${this.newGoodForm.goodID}&jumpUrl=${this.newGoodForm.jumpUrl}&sortValue=${this.newGoodForm.sortValue}`)
              .then((result) => {
                if (result.data.code == 201) {
                  this.$message.success('添加成功');
                  //关闭对话框
                  this.visible = false;
                  //重新载入轮播图表格
                  this.getNewGood();
                } else {
                  this.$message.error('添加失败');
                }
              })
              .catch((err) => console.log(err));
          } else if (this.newGoodForm.newID) {
            // 发送修改请求;
            this.axios
              .put(
                `/editNewGood`,
                `goodID=${this.newGoodForm.goodID}&jumpUrl=${this.newGoodForm.jumpUrl}&sortValue=${this.newGoodForm.sortValue}&newID=${this.newGoodForm.newID}`
              )
              .then((result) => {
                console.log(result);
                if (result.data.code == 201) {
                  this.$message.success('修改成功');
                  //关闭对话框
                  this.visible = false;
                  //重新载入轮播图表格
                  this.getNewGood();
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
