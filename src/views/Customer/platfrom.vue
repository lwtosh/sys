<template>
  <el-dialog
    :title="dataForm.id ? '修改' : '新增'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="close"
    >
    <el-form
      :model="dataForm"
      ref="dataForm"
      :rules="dataRule"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px">
      <el-form-item
        label="基本信息">
      </el-form-item>
      <div class="box">
        <el-form-item
        label="商户代码"
        prop="accessCode">
      <el-input v-model="dataForm.accessCode" placeholder="商户代码">
      </el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="passWord"
        v-if="dataForm.id === ''">
      <el-input type="password" v-model="dataForm.passWord" placeholder="密码">
      </el-input>
      </el-form-item>
      </div>
      <div class="box">
        <el-form-item
        label="商户名称"
        prop="platformName">
      <el-input v-model="dataForm.platformName" placeholder="商户名称">
      </el-input>
      </el-form-item>

      <el-form-item
        label="联系人手机号"
        prop="telphone">
      <el-input v-model="dataForm.telphone" placeholder="联系人手机号">
      </el-input>
      </el-form-item>
      </div>
      <el-form-item label="签约日期"  prop="time" >
        <div class="box">
          <el-form-item prop="startTime">
           <el-date-picker v-model="dataForm.startTime" type="date" placeholder="开始日期" :picker-options="pickerOptionsStart"  @change="changeEnd"> </el-date-picker>
        </el-form-item>
      <span> ~ </span>
      <el-form-item prop="endTime">
       <el-date-picker v-model="dataForm.endTime" type="date" placeholder="结束日期" :picker-options="pickerOptionsEnd" @change="changeStart"> </el-date-picker> 
      </el-form-item>
        </div>
        
     </el-form-item>
      <el-form-item
        label="每日支付限额"
        prop="dayMoney" >
      <el-input style="width:20%;" v-model.number="dataForm.dayMoney" placeholder="支付限额"> </el-input>
      <span>  元</span>
      </el-form-item>
      <hr>
      <el-form-item
        label="具体信息">
      </el-form-item>
      <div class="box">
         <el-form-item
        label="法人名称"
        prop="nickName"
      >
        <el-input
          v-model="dataForm.nickName"
          placeholder="法人名称">
        </el-input>
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="phone"
       >
      <el-input v-model="dataForm.phone" placeholder="手机号">
      </el-input>
      </el-form-item>
      </div>
      <el-form-item
        label="法人身份证号"
        prop="nickNo"
        style="width:50%;">
        <el-input
          v-model="dataForm.nickNo"
          placeholder="法人身份证号"
        ></el-input>
      </el-form-item>
      <div class="box">
        <el-form-item
        label="身份证正面"
        prop="nickPositive">
        <el-upload
          class="avatar-uploader"
          enctype="multipart/form-data"
          accept="image/png,image/gif,image/jpeg"
          action="http://192.168.8.15:19102/file/upload/"
          :show-file-list="false"
           name='file'
          :before-upload="beforeAvatarUpload">
          <img v-if="this.dataForm.nickPositive" :src="this.dataForm.nickPositive" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="身份证反面"
        prop="nickUnpositive">
        <el-upload
          class="avatar-uploader"
          enctype="multipart/form-data"
          accept="image/png,image/gif,image/jpeg"
          action="http://192.168.8.15:19102/file/upload/"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload2">
          <img v-if="this.dataForm.nickUnpositive" :src="this.dataForm.nickUnpositive" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      </div>
      <el-form-item
        label="营业执照号码"
        prop="licenseNo" style="width:50%;">
        <el-input
          v-model="dataForm.licenseNo"
          placeholder="营业执照号码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="营业执照照片"
        prop="licenseUrl" >
        <el-upload
          class="avatar-uploader"
          enctype="multipart/form-data"
          accept="image/png,image/gif,image/jpeg"
          action="http://192.168.8.15:19102/file/upload/"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload3">
          <img v-if="this.dataForm.licenseUrl" :src="this.dataForm.licenseUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item
        label="角色"
        size="mini"
      >
        <el-checkbox-group v-model="dataForm.ids">
          <el-checkbox
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
var validateMonery = (rule, value, callback) => {
  let reg1 = /^[1-9]{1,8}$/
  if (reg1.test(value)) {
    callback()
  } else {
    callback(new Error('支付金额输入有误'))
  }
}
export default {
  data () {
    var validateMobile = (rule, value, callback) => {
      if (isMobile(value)) {
        callback()
      } else {
        callback(new Error('手机号格式错误'))
      }
    }
    var validateName = (rule, value, callback) => {
      if (!(value.length <= 30)) {
        callback(new Error('格式错误'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      roleList: [],
      fileList: [],
      imgUrl: '',
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
        dayMoney: '',
        roleIdList: [],
        status: 1
      },
      dataRule: {
        telphone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' },
          {min: 8, max: 11, message: '手机号输入有误'}
        ],
        accessCode: [
          { required: true, message: '接入代码不能为空', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '法人名称不能为空', trigger: 'blur' },
          { validator: validateName }
        ],
        nickPositive: [
          { required: true, message: '身份证必传', trigger: 'blur' }
        ],
        nickUnpositive: [
          { required: true, message: '身份证必传', trigger: 'blur' }
        ],
        nickNo: [
          { required: true, message: '身份证号码不能为空', trigger: 'blur' },
          {min: 15, max: 18, message: '身份证号码输入有误'}
        ],
        passWord: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {min: 6, max: 20}
        ],
        platformName: [
          { required: true, message: '平台名称不能为空', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        licenseNo: [
          { required: true, message: '营业执照号码不能为空', trigger: 'blur' },
          {min: 15, max: 18, message: '营业执照号码输入有误'}
        ],
        licenseUrl: [
          { required: true, message: '营业执照必传', trigger: 'blur' }
        ],
        dayMoney: [
          { required: true, message: '每日支付限额不能为空', trigger: 'blur' },
          {validator: validateMonery, min: 1, max: 9}
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' },
          {min: 8, max: 11, message: '手机号输入有误'}
        ]
        // time: [
        //   { required: true, message: '签约日期不能为空', trigger: 'blur' }
        // ]
      },
      pickerOptionsStart: {
        disabledDate (time) {
          return time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
        }
      },
      pickerOptionsEnd: {}
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
    // 图片上
    beforeAvatarUpload (file) {
      var formData = new FormData()
      formData.append('file', file)
      // eslint-disable-next-line no-redeclare
      var file = formData
      this.axios.post('/file/upload', file).then((res) => {
        if (res.data.code === '200') {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.dataForm.nickPositive = res.data.res.data.fileUrl
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
      return false
      // eslint-disable-next-line no-unreachable
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isLt5M
    },
    beforeAvatarUpload2 (file) {
      var formData = new FormData()
      formData.append('file', file)
      // eslint-disable-next-line no-redeclare
      var file = formData
      this.axios.post('/file/upload', file).then((res) => {
        if (res.data.code === '200') {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.dataForm.nickUnpositive = res.data.res.data.fileUrl
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
      return false
      // eslint-disable-next-line no-unreachable
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isLt5M
    },
    beforeAvatarUpload3 (file) {
      var formData = new FormData()
      formData.append('file', file)
      // eslint-disable-next-line no-redeclare
      var file = formData
      this.axios.post('/file/upload', file).then((res) => {
        if (res.data.code === '200') {
          this.$message({
            message: '上传成功',
            type: 'success'
          })
          this.dataForm.licenseUrl = res.data.res.data.fileUrl
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }
      })
      return false
      // eslint-disable-next-line no-unreachable
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isLt5M
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/m/accessPlatform/change${this.dataForm.id ? '/' + this.dataForm.id : ''}`),
            method: this.dataForm.id ? 'put' : 'post',
            data: JSON.stringify(this.dataForm)
          }).then(({ data }) => {
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
    close () {
      this.$set(this, 'dataForm', {
        id: '',
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
      })
    },
          // 结束时间限制开始时间
    changeStart () {
      this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
          // 可通过箭头函数的方式访问到this
        disabledDate: (time) => {
          var times = ''
          times = this.dataForm.endTime < time.getTime() || time.getTime() < new Date(new Date().toLocaleDateString())
              .getTime()

          return times
        }
      })
    },
      // 开始时间 控制结束时间
    changeEnd () {
      this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
        disabledDate: (time) => {
          return time.getTime() < this.dataForm.startTime
        }
      })
    }
  }
}
</script>

<style>
.box{
  width: 100%;
  display: flex;
}
img{
  width: 100%;
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
