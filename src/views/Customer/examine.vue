<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible"
    >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px">
      <div class="ft">
        <el-form-item
        label="基本信息">
      </el-form-item>
      </div>
      
      <el-form-item
        label="商户代码"> {{this.dataForm.accessCode}}
      </el-form-item>
      <div class="box">
        <el-form-item
        label="商户名称"
        prop="platformName"
        style="width:50%;">
      {{this.dataForm.platformName}}
      </el-form-item>
      <el-form-item
        label="联系人手机号"
        prop="telphone">
      {{this.dataForm.telphone}}
      </el-form-item>
      </div>
      <div class="box">
         <el-form-item label="签约日期"  prop="time" style="width:50%;">
      {{this.dataForm.startTime}}
      <span> ~ </span>
      {{this.dataForm.endTime}}
     </el-form-item>
      <el-form-item
        label="每日支付限额"
        prop="dayMoney" >
      {{this.dataForm.dayMoney}}
      </el-form-item>
      </div>
      <hr>
      <div class="ft">
        <el-form-item
        label="具体信息">
      </el-form-item>
      </div>
      <div class="box">
         <el-form-item
        label="法人名称"
        prop="nickName"
        style="width:50%;">
        {{this.dataForm.nickName}}
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="phone">
        {{this.dataForm.phone}}
      </el-form-item>
      </div>
      <el-form-item
        label="法人身份证号"
        prop="nickNo"
        style="width:50%;">
        {{this.dataForm.nickNo}}
      </el-form-item>
      <div class="box">
        <el-form-item
        label="身份证正面"
        prop="nickPositive" 
        style="width:50%;">
        <img class="img" :src="this.dataForm.nickPositive" alt="">
      </el-form-item>
      <el-form-item
        label="身份证反面"
        prop="nickUnpositive" >
        <img class="img" :src="this.dataForm.nickUnpositive" alt="">
      </el-form-item>
      </div>
      <el-form-item
        label="营业执照号码"
        prop="licenseNo" >
        {{this.dataForm.licenseNo}}
      </el-form-item>
      <el-form-item
        label="营业执照照片"
        prop="licenseUrl" >
        <img class="img" :src="this.dataForm.licenseUrl" alt="">
      </el-form-item>
      <el-form-item
        label="角色"
        size="mini"
      >
        <el-checkbox-group v-model="dataForm.ids">
          <el-checkbox
          disabled
            v-for="role in roleList"
            :key="role.id"
            :label="role.id"
            :value="role.id"
          >{{role.roleName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="visible = false">取消</el-button>
      <el-button
        type="primary"
        @click="dataFormSubmit()"
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isMobile } from '@/utils/validate'
export default {
  data () {
    // eslint-disable-next-line no-unused-vars
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      roleList: [],
      fileList: [],
      dataForm: {
        id: '',
        ids: [],
        accessCode: '',
        nickName: '',
        nickPositive: '',
        nickUnpositive: '',
        passWord: '',
        platformName: '',
        telphone: '',
        licenseNo: '',
        licenseUrl: '',
        salt: '',
        nickNo: '',
        startTime: '',
        endTime: '',
        phone: '',
        roleIdList: [],
        status: 1
      },
      dataRule: {
        accessCode: [
            { required: true, message: '应用名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      this.$http({
        url: this.$http.adornUrl('/m/roleAll'),
        method: 'get'
      }).then(({ data }) => {
        this.$set(this, 'roleList', data.res.data)
      })
      if (id) {
        this.$http({
          url: this.$http.adornUrl('/m/accessPlatform/' + id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(res => {
          this.$set(this, 'dataForm', res.data.res.data)
          if (!res.data.res.data.ids) {
            this.$set(this.dataForm, 'ids', [])
          }
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.visible = false
      this.$emit('refreshDataList')
    }
  }
}
</script>

<style >
.img{
  width: 150px;
}
.box{
  width: 100%;
  display: flex;
}
.ft .el-form-item__label{
  font-size: 18px !important;
  font-weight: 500
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
