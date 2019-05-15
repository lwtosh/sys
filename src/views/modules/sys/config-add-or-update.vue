<template>
  <el-dialog
    :title="dataForm.id ? '修改' : '新增'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close = "close">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="参数名" prop="code">
        <el-input v-model="dataForm.code" placeholder="参数名"></el-input>
      </el-form-item>
      <el-form-item label="参数值" prop="value">
        <el-input v-model="dataForm.value" placeholder="参数值"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          code: '',
          value: '',
          remark: ''
        },
        dataRule: {
          code: [
            { required: true, message: '参数名不能为空', trigger: 'blur' }
          ],
          value: [
            { required: true, message: '参数值不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || ''
        this.visible = true
        if (id) {
          this.$http({
            url: this.$http.adornUrl('/m/config/' + id),
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
              url: this.$http.adornUrl(`/m/config${this.dataForm.id ? '/' + this.dataForm.id : ''}`),
              method: this.dataForm.id ? 'put' : 'post',
              data: JSON.stringify(this.dataForm)
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
      close () {
        this.$set(this, 'dataForm', {
          id: 0,
          code: '',
          value: '',
          remark: ''
        })
      }
    }
  }
</script>
