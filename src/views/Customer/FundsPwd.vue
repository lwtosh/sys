<template>
    <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible">
   <el-form :model="dataForm" :rules="dataRule"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
    <el-form-item label="旧密码" prop="oldPwd" :class="{ 'is-required': !dataForm.id }" style="width:60%;">
    <el-input type="password" v-model="dataForm.oldPwd"></el-input>
    <span>初次设置旧密码可以为空</span>
  </el-form-item>
  <el-form-item label="新密码" prop="passWord" style="width:60%;" :class="{ 'is-required': !dataForm.id }" >
    <el-input type="password" v-model="dataForm.passWord"></el-input>
  </el-form-item>
  <el-form-item label="确认新密码密码" prop="subPwd" style="width:60%;" :class="{ 'is-required': !dataForm.id }" >
    <el-input type="password" v-model="dataForm.subPwd"></el-input>
  </el-form-item>
  </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
    </span>
    </el-dialog>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { isMobile } from '@/utils/validate'
export default {
  data () {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.passWord !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      dataForm: {
        id: '',
        oldPwd: '',
        passWord: '',
        subPwd: ''
      },
      dataRule: {
        passWord: [
           { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        subPwd: [
           { required: true, validator: validateComfirmPassword, trigger: 'blur' }
        ]
        // oldPwd: [
        //    { required: true, trigger: 'blur' }
        // ]
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
      if (id) {
        this.$http({
          url: this.$http.adornUrl('/m/accessPlatform/' + id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(res => {
        })
      }
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/m/accessPlatform/updatePassward`),
            method: 'put',
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
    }
  }
}
</script>

