
<template>
<div v-if="accessPlatformId !== ''">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="getDataList()"
      label-width="120px">
      <div class="ft">
        <el-form-item
        label="基本信息">
      </el-form-item>
      </div>
     
      <div class="box">
      <el-form-item
        label="商户代码"> {{this.dataForm.accessCode}}
      </el-form-item>
        <el-form-item
        label="商户名称"
        prop="platformName"
         label-width="320px">
      {{this.dataForm.platformName}}
      </el-form-item>
      <el-form-item
        label="联系人手机号"
        prop="telphone"
        label-width="260px">
      {{this.dataForm.telphone}}
      </el-form-item>
      </div>
      <div class="box">
        <el-form-item label="签约日期"  prop="time" >
      {{this.dataForm.startTime}}
      <span> ~ </span>
      {{this.dataForm.endTime}}
     </el-form-item>
      <el-form-item
        label="每日支付限额"
        prop="dayMoney" 
        label-width="180px">
      {{this.dataForm.dayMoney}}
      </el-form-item>
      </div>
      
      <hr>
      <el-form-item label="私钥" prop="desc" style="width:60%;">
      <el-input type="textarea" v-model="dataForm.privateKey"></el-input>
     </el-form-item>
     <el-form-item label="公钥" prop="desc" style="width:60%;">
    <el-input type="textarea" v-model="dataForm.publicKey"></el-input>
    </el-form-item>
     <el-button class="btn" @click="addkey()">生成</el-button>
      <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
      <el-button class="mom" type="primary" @click="addFundsPwd(id)">设置资金密码</el-button>
      <hr>
      <div class="ft">
        <el-form-item
        label="具体信息">
      </el-form-item>
      </div>
      <div class="box">
         <el-form-item
        label="法人名称"
        prop="nickName">
        {{this.dataForm.nickName}}
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="phone"
         label-width="300px">
        {{this.dataForm.phone}}
      </el-form-item>
      <el-form-item
        label="法人身份证号"
        prop="nickNo"
         label-width="260px">
        {{this.dataForm.nickNo}}
      </el-form-item>
      </div>
      
      <div class="box">
        <el-form-item
        label="身份证正面"
        prop="nickPositive" >
        <img :src="this.dataForm.nickPositive" alt="">
      </el-form-item>
      <el-form-item
        label="身份证反面"
        prop="nickUnpositive"
        label-width="260px" >
        <img :src="this.dataForm.nickUnpositive" alt="">
      </el-form-item>
      <el-form-item
        label="营业执照照片"
        prop="licenseUrl" 
        label-width="270px">
        <img :src="this.dataForm.licenseUrl" alt="">
      </el-form-item>
      </div>
      <div class="box">
        <el-form-item
        label="营业执照号码"
        prop="licenseNo" >
        {{this.dataForm.licenseNo}}
      </el-form-item>
      
      </div>
      
    </el-form>
    <funds v-if="FundsPwdVisible" ref="funds" @refreshDataList="getDataList"></funds>
    </div>
    <div v-else>不好意思，您还不是平台用户哦！ </div>
</template>

<script>
import funds from './FundsPwd'
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
      FundsPwdVisible: false,
      roleList: [],
      fileList: [],
      accessPlatformId: '',
      dataForm: {
        id: '',
        ids: [],
        accessCode: '',
        nickName: '',
        nickPositive: '',
        nickUnpositive: '',
        passWord: '',
        platformName: '',
        privateKey: '',
        telphone: '',
        licenseNo: '',
        licenseUrl: '',
        publicKey: '',
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
  components: {
    funds
  },
  activated () {
    this.getDataList()
  },
  methods: {
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/m/user/meInfo'),
        method: 'get'
      }).then(({ data }) => {
        this.accessPlatformId = data.res.data.accessPlatformId
        this.$http({
          url: this.$http.adornUrl('/m/accessPlatform/meInfo/' + this.accessPlatformId),
          method: 'get',
          params: this.$http.adornParams()
        }).then(res => {
          if (res.data.res) {
            this.$set(this, 'dataForm', res.data.res.data)
          }
        })
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/m/merchant/updateRsaKey`),
            method: 'post',
            data: this.$http.adornData(this.dataForm)
          }).then(({data}) => {
            if (data && data.code === '200') {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.message)
            }
          })
        }
      })
    },
    addFundsPwd (id) {
      this.getDataList()
      this.FundsPwdVisible = true
      this.$nextTick(() => {
        this.$refs.funds.init(this.accessPlatformId)
      })
    },
    addkey () {
      this.$http({
        url: this.$http.adornUrl('/m/merchant/createRsaKey'),
        method: 'post',
        params: this.$http.adornParams()
      }).then(({data}) => {
        this.dataForm.publicKey = data.res.data.publicKey
        this.dataForm.privateKey = data.res.data.privateKey
      })
    }
  }
}
</script>

<style>
.ft .el-form-item__label{
  font-size: 18px !important;
  font-weight: 500
}
.box{
  width: 100%;
  display: flex;
}
.btn{
      margin-left: 160px;
}
.mon{
  /* float: right; */
  margin: auto;
  text-align: center;
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
