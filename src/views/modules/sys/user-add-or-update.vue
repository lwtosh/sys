<template>
  <el-dialog
    :title="dataForm.id ? '修改' : '新增'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="close"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item
        label="用户名称"
        prop="userName"
      >
        <el-input
          v-model="dataForm.userName"
          placeholder="用户名称"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="登陆账号"
        prop="userCode"
      >
        <el-input
          v-model="dataForm.userCode"
          placeholder="登陆账号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="userPwd"
        :class="{ 'is-required': !dataForm.id }"
        v-if="dataForm.id === ''"
      >
        <el-input
          v-model="dataForm.userPwd"
          type="password"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="subPwd"
        :class="{ 'is-required': !dataForm.id }"
         v-if="dataForm.id === ''"
      >
        <el-input
        
          v-model="dataForm.subPwd"
          type="password"
          placeholder="确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input
          v-model="dataForm.email"
          placeholder="邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="telphone"
      >
        <el-input
          v-model="dataForm.telphone"
          placeholder="手机号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="用户类型"
        prop="userType"
      >
        <el-select
          v-model="dataForm.userType"
          placeholder="请选择用户"
        >
          <el-option
            label="超级管理员"
            :value="1"
          ></el-option>
          <el-option
            label="普通用户"
            :value="2"
          ></el-option>
          <el-option
            label="第四方用户"
            :value="3"
          ></el-option>
        </el-select>
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
      } else if (this.dataForm.userPwd !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
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
      dataForm: {
        id: '',
        ids: [],
        userName: '',
        userCode: '',
        userPwd: '',
        userType: '',
        subPwd: '',
        salt: '',
        email: '',
        telphone: '',
        status: 1
      },
      dataRule: {
        userName: [
           { required: true, message: '用户类型不能为空', trigger: 'blur' }
        ],
        userPwd: [
          { required: true, validator: validatePassword, trigger: 'blur' }
        ],
        subPwd: [
          { required: true, validator: validateComfirmPassword, trigger: 'blur' }
        ],
        telphone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        userType: [
          { required: true, message: '用户类型不能为空', trigger: 'change' }
        ],
        userCode: [
          { required: true, message: '登录账户不能为空', trigger: '' }
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
          url: this.$http.adornUrl('/m/user/' + id),
          method: 'get'
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/m/user/change${this.dataForm.id ? '/' + this.dataForm.id : ''}`),
            method: this.dataForm.id ? 'put' : 'post',
            data: JSON.stringify(this.dataForm)
          }).then(({ data }) => {
            if (data && data.code === '200') {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 500,
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
        userName: '',
        ids: [],
        userPwd: '',
        oldPwd: '',
        salt: '',
        email: '',
        telphone: '',
        userCode: '',
        userType: '',

        status: 1
      })
    }
  }
}
</script>
