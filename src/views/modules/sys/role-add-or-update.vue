<template>
  <el-dialog
    :title="dataForm.id ? '修改' : '新增'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close = "close"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item
        label="角色名称"
        prop="roleName"
      >
        <el-input
          v-model="dataForm.roleName"
          placeholder="角色名称"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remark"
      >
        <el-input
          v-model="dataForm.remark"
          placeholder="备注"
        ></el-input>
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
// eslint-disable-next-line no-unused-vars
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      visible: false,
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      dataForm: {
        id: '',
        roleName: '',
        remark: ''
      },
      dataRule: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || ''
      this.visible = true
      if (id) {
        this.$http({
          url: this.$http.adornUrl('/m/role/' + id),
          method: 'get'
        })
          .then(res => {
            this.$set(this, 'dataForm', res.data.res.data)
          })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/m/role${this.dataForm.id ? '/' + this.dataForm.id : ''}`),
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
        roleName: '',
        remark: ''
      })
    }
  }
}
</script>
