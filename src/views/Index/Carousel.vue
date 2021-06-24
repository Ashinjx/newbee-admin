<template>
  <div class="carousel">
    <!-- 卡片包裹 -->
    <el-card class="box-card">
      <!-- 卡片header部分 -->
      <template #header>
        <div class="card-header">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="addCarousel">增加</el-button>
          <el-popconfirm title="确定删除吗？" @confirm="deleteCarousel(...multipleSelection)">
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
        <el-table-column label="轮播图" width="200">
          <template #default="scope">
            <img style="width: 150px;height: 150px" :src="scope.row.imageUrl" alt="轮播图" />
          </template>
        </el-table-column>
        <el-table-column label="跳转连接">
          <template #default="scope">
            <a target="_blank" :href="scope.row.jumpUrl">{{ scope.row.jumpUrl }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="sortValue" label="排序值" sortable="custom" width="120"> </el-table-column>
        <el-table-column prop="createTime" label="添加时间" width="200"> </el-table-column>
        <el-table-column label="操作" width="100">
          <!-- 操作按钮  -->
          <template #default="scope">
            <a style="cursor: pointer; margin-right: 10px;color: #409eff" @click="editCarousel(scope.row)">修改</a>
            <!-- 确认删除后触发删除请求 -->
            <el-popconfirm title="确定删除吗？" @confirm="deleteCarousel(scope.row.imageID)">
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
    <!-- 添加/修改轮播图对话框 -->
    <el-dialog :title="type == 'add' ? '添加轮播图' : '修改轮播图'" :visible="visible" width="400px">
      <el-form :model="carouselForm" :rules="rules" label-width="100px" ref="carouselForm" class="good-form">
        <el-form-item label="图片" prop="imageUrl">
          <!-- 图片上传:取消自动上传,监听图片改变,自定义上传规则 -->
          <el-upload
            class="avatar-uploader"
            ref="upload"
            action=""
            :auto-upload="false"
            :show-file-list="false"
            :on-change="changeUpload"
            :http-request="uploadImg"
          >
            <!-- 预览图 -->
            <img style="width:100px;height:100px;border: 1px solid #e9e9e9" v-if="carouselForm.imageUrl" :src="carouselForm.imageUrl" class="avatar" />
            <!-- 未上传 -->
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="跳转链接" prop="jumpUrl">
          <el-input type="text" v-model="carouselForm.jumpUrl"></el-input>
        </el-form-item>
        <el-form-item label="排序值" prop="sortValue">
          <el-input type="number" v-model="carouselForm.sortValue"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false" class="off">取 消</el-button>
          <el-button type="primary" @click="send('carouselForm')">确 定</el-button>
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
      visible: false, //对话框隐藏
      type: 'add', //控制对话框title
      //对话框表单
      carouselForm: {
        imageUrl: '',
      },
      //对话框验证
      rules: {
        imageUrl: [{ required: 'true', message: '图片不能为空', trigger: ['change'] }],
        sortValue: [{ required: 'true', message: '排序不能为空', trigger: ['change'] }],
      },
      multipleSelection: [], //暂存选中行ID
    };
  },
  mounted() {
    //调用函数获取表格数据
    this.getCarousel();
  },
  methods: {
    //获取轮播图列表
    getCarousel() {
      this.axios.get('/getCarousel').then((result) => {
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
    //新增轮播图弹窗
    addCarousel() {
      this.visible = true;
      this.type = 'add';
      //默认表单对象的各属性值为空
      this.carouselForm = {
        imageID: '',
        imageUrl: '',
        jumpUrl: '',
        sortValue: '',
      };
    },
    //修改轮播图弹窗
    editCarousel(row) {
      this.visible = true;
      //修改title
      this.type = 'edit';
      //将行数据解构到表单对象中(避免引用同一地址)
      this.carouselForm = { ...row };
    },
    //自定义上传
    uploadImg(param) {
      var formdata = new FormData();
      formdata.append('image', param.file);
      formdata.append('apiType', 'bilibili');
      formdata.append('token', '6b86926c00dedc2ad9fc165082727d3e');
      //发送请求,上传至图床平台
      this.axios({
        url: 'https://www.hualigs.cn/api/upload',
        method: 'post',
        data: formdata,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((result) => {
          //返回的图片链接保存至表单中
          this.carouselForm.imageUrl = result.data.data.url.distribute;
        })
        .catch((err) => console.log(err));
    },
    //图片改变后
    changeUpload(file) {
      //判断是否为图片格式以及限制图片大小
      var isJPG = file.raw.type === 'image/jpeg' ? true : file.raw.type === 'image/png' ? true : false;
      if (!isJPG) {
        this.$message.error('商品主图只能是图片格式!');
      }
      if (isJPG) {
        //图片符合条件则上传
        this.$refs.upload.submit();
      }
    },
    //获取选中列imageID
    handleSelectionChange(val) {
      this.multipleSelection = [];
      for (var i = 0; i < val.length; i++) {
        this.multipleSelection[i] = val[i].imageID;
      }
    },
    //删除轮播图
    deleteCarousel(...imageID) {
      this.axios
        .delete(`/deleteCarousel/${imageID}`)
        .then((result) => {
          if (result.data.code == 1) {
            this.$message.success('删除成功');
            //重新载入轮播图表格
            this.getCarousel();
          } else {
            this.$message.error('删除失败');
          }
        })
        .catch((err) => console.log(err));
    },
    //发送新增,修改轮播图的请求
    send(carouselForm) {
      //验证表单value是否符合规则
      this.$refs[carouselForm].validate((valid) => {
        if (valid) {
          //如果没有传入ID,则判断为添加
          if (this.carouselForm.imageID == '') {
            //发送添加请求
            this.axios
              .post(`/addCarousel`, `imageUrl=${this.carouselForm.imageUrl}&jumpUrl=${this.carouselForm.jumpUrl}&sortValue=${this.carouselForm.sortValue}`)
              .then((result) => {
                if (result.data.code == 201) {
                  this.$message.success('添加成功');
                  //关闭对话框
                  this.visible = false;
                  //重新载入轮播图表格
                  this.getCarousel();
                } else {
                  this.$message.error('添加失败');
                }
              })
              .catch((err) => console.log(err));
          } else if (this.carouselForm.imageID != '') {
            //发送修改请求
            this.axios
              .put(
                `/editCarousel`,
                `imageUrl=${this.carouselForm.imageUrl}&jumpUrl=${this.carouselForm.jumpUrl}&sortValue=${this.carouselForm.sortValue}&imageID=${this.carouselForm.imageID}`
              )
              .then((result) => {
                if (result.data.code == 201) {
                  this.$message.success('修改成功');
                  //关闭对话框
                  this.visible = false;
                  //重新载入轮播图表格
                  this.getCarousel();
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
