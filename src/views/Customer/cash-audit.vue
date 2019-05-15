<template>
    <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible">
   <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="商户名称" prop="accessPlatformName" style="width:60%;">
    {{this.dataForm.accessPlatformName}}
  </el-form-item>
  <el-form-item label="审核状态">
    <el-radio-group v-model="dataForm.status">
      <el-radio label="2"  :value="2">{{mes}}</el-radio>
      <el-radio label="3"  :value="3">{{mes2}}</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="审核描述" prop="remark" style="width:50%;" >
    <el-input type="textarea" v-model="dataForm.remark" size="medium"></el-input>
  </el-form-item>
  </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
    </span>
    </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      mes: '通过',
      mes2: '不通过',
      dataForm: {
        accessPlatformName: '',
        accessPlatformCashId: '',
        remark: '',
        status: ''
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.accessPlatformCashId = id || ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (id) {
        this.$http({
          url: this.$http.adornUrl('/m/accessPlatformCash/' + id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(res => {
          this.$set(this, 'dataForm', res.data.res.data)
        })
      }
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/m/accessPlatformCash/examine`),
            method: 'post',
            data: JSON.stringify({
              accessPlatformCashId: this.dataForm.accessPlatformCashId,
              remark: this.dataForm.remark,
              status: this.dataForm.status
            })
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


