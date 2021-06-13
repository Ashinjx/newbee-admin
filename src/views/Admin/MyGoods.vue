<template>
  <div class="myGoods">
    <!-- 卡片包裹 -->
    <el-card class="box-card">
      <template #header>
        <div>
          <i v-if="hasBack" class="el-icon-back" @click="back"></i>
          <span>{{ add ? '添加商品' : '修改商品' }}</span>
        </div>
      </template>
      <!-- 商品表单 -->
      <el-form :model="goodForm" :rules="rules" ref="goodForm" label-width="100px">
        <el-form-item label="商品分类" prop="classID">
          <el-select clearable v-model="goodForm.classID" placeholder="请选择分类">
            <el-option v-for="(i, k) of options" :key="k" :label="options[k].label" :value="options[k].value" style="width: 300px"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="goodForm.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品简介" prop="intr">
          <el-input type="textarea" v-model="goodForm.intr" placeholder="请输入商品简介(100字以内)"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input type="number" min="0" v-model="goodForm.price" placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="商品售卖价" prop="salePrice">
          <el-input type="number" min="0" v-model="goodForm.salePrice" placeholder="请输入商品售价"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input type="number" min="0" v-model="goodForm.stock" placeholder="请输入商品库存"></el-input>
        </el-form-item>
        <el-form-item label="商品标签" prop="tag">
          <el-input v-model="goodForm.tag" placeholder="请输入商品小标签"></el-input>
        </el-form-item>
        <el-form-item label="上架状态" prop="onSale">
          <el-radio-group v-model="goodForm.onSale">
            <el-radio label="0">上架</el-radio>
            <el-radio label="1">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品主图" prop="imageUrl">
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
            <img style="width:100px;height:100px;border: 1px solid #e9e9e9" v-if="goodForm.imageUrl" :src="goodForm.imageUrl" class="avatar" />
            <!-- 未上传 -->
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- 富文本编辑器 -->
        <el-form-item label="详细内容">
          <div ref="editor"></div>
        </el-form-item>
        <el-form-item>
          <!-- 提交按钮 -->
          <el-button @click="button('goodForm')" type="primary">{{ arr[3] ? '立即修改' : '立即创建' }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
@import './sass/myGoods.scss';
</style>
<script>
// 引用富文本编辑器
import E from 'wangeditor';
export default {
  data() {
    return {
      hasBack: true, //返回按钮
      add: true, //添加商品
      arr: location.hash.split('/'), //通过url信息判断当前是添加商品还是修改商品
      options: [], // 下拉列表
      // 表单
      goodForm: {
        classID: '',
        name: '',
        intr: '',
        price: '',
        salePrice: '',
        stock: '',
        tag: '',
        onSale: '0',
        imageUrl: '',
      },
      // 表单规则
      rules: {
        classID: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        salePrice: [{ required: true, message: '请输入商品售价', trigger: 'blur' }],
        stock: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
        imageUrl: [{ required: true, message: '请选择商品主图', trigger: 'change' }],
      },
      //获取富文本编辑器容器
      editor: null,
    };
  },
  mounted() {
    //初始化编辑器
    this.editor = new E(this.$refs.editor);
    this.editor.create();
    //更新分类列表
    this.getClassify();
    //修改商品下获取商品信息
    this.getGood();
  },
  methods: {
    //获取分类列表
    getClassify() {
      this.axios.get('/getClassify').then((result) => {
        for (var i = 0; i < result.data.result.length; i++) {
          this.options[i] = {
            value: result.data.result[i].classID,
            label: result.data.result[i].className,
          };
        }
      });
    },
    //修改商品下获取单个商品
    getGood() {
      if (this.arr[3]) {
        this.add = false;
        this.axios.get(`/getGoods/${this.arr[3]}`).then((result) => {
          if (result.data.code == 200) {
            this.goodForm = result.data.result[0];
          } else {
            this.$message.error('查询失败');
          }
        });
      }
    },
    //图片改变后
    changeUpload(file) {
      //判断是否为图片格式以及限制图片大小
      var isJPG = file.raw.type === 'image/jpeg' ? true : file.raw.type === 'image/png' ? true : false;
      var isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('商品主图只能是图片格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      if (isJPG && isLt2M) {
        //图片符合条件则上传
        this.$refs.upload.submit();
      }
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
      }).then((result) => {
        //返回的图片链接保存至表单中
        this.goodForm.imageUrl = result.data.data.url.distribute;
      });
    },
    // 提交按钮
    button(goodForm) {
      // 如果添加商品则
      if (location.hash == '#/admin/addGoods') {
        this.$refs[goodForm].validate((valid) => {
          if (valid) {
            this.axios
              .post(
                '/addGood',
                `classID=${this.goodForm.classID}&name=${this.goodForm.name}&intr=${this.goodForm.intr}&price=${this.goodForm.price}&salePrice=${this.goodForm.salePrice}&stock=${this.goodForm.stock}&tag=${this.goodForm.tag}&onSale=${this.goodForm.onSale}&imageURL=${this.goodForm.imageUrl}`
              )
              .then((result) => {
                if (result.data.code == 201) {
                  this.$message.success('添加成功');
                  this.$router.push('/admin/goodsAdmin'); //跳转商品管理
                } else if (result.data.code == 202) {
                  this.$message.error('添加失败');
                }
              });
          } else {
            return false;
          }
        });
      }
      //如果修改商品则
      if (this.arr[3]) {
        this.$refs[goodForm].validate((valid) => {
          if (valid) {
            this.axios
              .put(
                `/editGood`,
                `classID=${this.goodForm.classID}&name=${this.goodForm.name}&intr=${this.goodForm.intr}&price=${this.goodForm.price}&salePrice=${this.goodForm.salePrice}&stock=${this.goodForm.stock}&tag=${this.goodForm.tag}&onSale=${this.goodForm.onSale}&imageURL=${this.goodForm.imageUrl}&goodID=${this.arr[3]}`
              )
              .then((result) => {
                if (result.data.code == 201) {
                  this.$message.success('修改成功');
                  this.$router.push('/admin/goodsAdmin'); //跳转商品管理
                } else if (result.data.code == 500) {
                  //code==500则说明数据库中已存在该分类
                  this.$message.error('修改失败');
                }
              });
          } else {
            return false;
          }
        });
      }
    },
    //后退
    back() {
      this.$router.back();
    },
  },
};
</script>
