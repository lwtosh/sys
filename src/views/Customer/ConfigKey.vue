<template>
    <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible">
   <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item label="私钥" prop="desc" style="width:60%;">
    <el-input type="textarea" v-model="dataForm.privateKey"></el-input>
  </el-form-item>
  <el-form-item label="公钥" prop="desc" style="width:60%;">
    <el-input type="textarea" v-model="dataForm.publicKey"></el-input>
  </el-form-item>
   <el-button class="btn" @click="addkey()">生成</el-button>
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
      dataForm: {
        accessPlatformId: '',
        privateKey: '',
        publicKey: ''
      }
    }
  },
  methods: {
    init (ids) {
      this.dataForm.accessPlatformId = ids || ''
      this.visible = true
    },
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

<style scoped>
.btn{
  margin-left: 140px;
}
</style>
