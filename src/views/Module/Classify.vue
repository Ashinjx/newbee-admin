<template>
  <div class="classify">
    <!-- 卡片包裹 -->
    <el-card class="box-card">
      <!-- header部分按钮 -->
      <template #header>
        <div class="card-header">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addClassify">增加</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="deleteClassify(...multipleSelection)">
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
        <el-table-column prop="className" label="分类名称"> </el-table-column>
        <el-table-column prop="sortValue" label="排序值" sortable="custom" width="120"> </el-table-column>
        <el-table-column prop="createTime" label="添加时间" width="200"> </el-table-column>
        <el-table-column label="操作" width="220">
          <!-- 操作按钮 修改/下级分类/删除 -->
          <template #default="scope">
            <a style="cursor: pointer; margin-right: 10px;color: #409eff" @click="editClassify(scope.row)">修改</a>
            <!-- <a style="cursor: pointer; margin-right: 10px;color: #409eff">下级分类</a> -->
            <!-- 确认删除后触发删除请求 -->
            <el-popconfirm title="确定删除吗？" @confirm="deleteClassify(scope.row.classID)">
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
    <!-- 添加/修改分类对话框 -->
    <el-dialog :title="type == 'add' ? '添加分类' : '修改分类'" :visible="visible" width="400px">
      <el-form :model="handleForm" :rules="rules" label-width="100px" ref="formRef" class="good-form">
        <el-form-item label="分类名称" prop="className">
          <el-input type="text" v-model="handleForm.className"></el-input>
        </el-form-item>
        <el-form-item label="排序值" prop="sortValue">
          <el-input type="number" v-model="handleForm.sortValue"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false" class="off">取 消</el-button>
          <el-button type="primary" @click="send">确 定</el-button>
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
      classID: 0, //存放选中行ID
      total: 0, //数据总条数
      pageSize: 10, //每页显示
      currentPage: 1, //当前页
      visible: false, //控制对话框显示
      type: 'add', //控制对话框title
      //添加,修改分类表单
      handleForm: {},
      //添加,修改分类表单验证
      rules: {
        className: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        sortValue: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
      },
      multipleSelection: [],
    };
  },
  mounted() {
    //载入分类表格
    this.getClassify();
  },
  methods: {
    //获取分类列表
    getClassify() {
      this.axios.get('/getClassify').then((result) => {
        for (var i = 0; i < result.data.result.length; i++) {
          result.data.result[i].createTime = this.moment(result.data.result[i].createTime).format('YYYY-MM-DD HH:mm:ss');
        }
        //存放到表格中
        this.tableData = result.data.result;
        this.total = this.tableData.length;
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
    //新增分类
    addClassify() {
      this.visible = true;
      //修改title为增加分类
      this.type = 'add';
      //默认表单对象的各属性值为空
      this.handleForm = {
        classID: '',
        className: '',
        sortValue: '',
      };
    },
    //修改分类
    editClassify(row) {
      this.visible = true;
      //修改title为修改分类
      this.type = 'edit';
      //将行数据解构到表单对象中(避免引用同一地址)
      this.handleForm = { ...row };
    },
    //获取选中列classID
    handleSelectionChange(val) {
      this.multipleSelection = [];
      for (var i = 0; i < val.length; i++) {
        this.multipleSelection[i] = val[i].classID;
      }
      console.log(this.multipleSelection);
    },
    //删除分类
    deleteClassify(...classID) {
      this.axios
        .delete(`/deleteClassify/${classID}`)
        .then((result) => {
          if (result.data.code == 1) {
            this.$message.success('删除成功');
            // 重新载入分类表格
            this.getClassify();
          } else {
            this.$message.error('删除失败');
          }
        })
        .catch((err) => console.log(err));
    },
    //发送请求
    send() {
      //如果没有传入ID,则判断为添加分类
      if (this.handleForm.classID == '') {
        if (this.handleForm.className == '' || this.handleForm.sortValue == '') {
          this.$message.error('类型或排序值为空,无法添加');
        } else {
          this.axios.post(`/addClassify`, `className=${this.handleForm.className}&sortValue=${this.handleForm.sortValue}`).then((result) => {
            if (result.data.code == 201) {
              this.$message.success('添加成功');
              //关闭对话框
              this.visible = false;
              //重新载入分类表格
              this.getClassify();
            } else if (result.data.code == 200) {
              //code==200则说明数据库中已存在该分类
              this.$message.error('类型已存在');
            } else {
              this.$message.error('添加失败');
            }
          });
        }
      }
      //如果classID存在,则判断为修改分类
      if (this.handleForm.classID != '') {
        if (this.handleForm.className == '' || this.handleForm.sortValue == '') {
          this.$message.error('类型或排序值为空,无法添加');
        } else {
          this.axios
            .put(`/editClassify`, `classID=${this.handleForm.classID}&className=${this.handleForm.className}&sortValue=${this.handleForm.sortValue}`)
            .then((result) => {
              if (result.data.code == 201) {
                this.$message.success('修改成功');
                //关闭对话框
                this.visible = false;
                //重新载入分类表格
                this.getClassify();
              } else if (result.data.code == 500) {
                //code==500则说明数据库中已存在该分类
                this.$message.error('类型已存在');
              } else {
                this.$message.error('修改失败');
              }
            });
        }
      }
    },
  },
};
</script>
