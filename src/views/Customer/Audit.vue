<template>
    <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible">
   <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="平台名称" prop="platformName" style="width:60%;">
   {{dataForm.platformName}}
  </el-form-item>
  <el-form-item label="审核状态">
    <el-radio-group v-model="dataForm.status">
      <el-radio label="2"  :value="2">{{mes}}</el-radio>
      <el-radio label="3"  :value="3">{{mes2}}</el-radio>
    </el-radio-group>
  </el-form-item>
  <el-form-item label="审核描述" prop="remark " >
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
        id: '',
        remark: '',
        status: ''
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
          this.$set(this, 'dataForm', res.data.res.data)
        })
      }
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/m/accessPlatform/auditor/${this.dataForm.id}`),
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
    }
  }
}
</script>


