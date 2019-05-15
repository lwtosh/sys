<template>
  <el-dialog
    :title="dataForm.id ? '修改' : '新增'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close = "close">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="内容名称" prop="keyName">
        <el-input v-model="dataForm.keyName" placeholder="内容名称"></el-input>
      </el-form-item>
      <el-form-item label="长度" prop="configKey">
        <el-input v-model="dataForm.configKey" placeholder="长度"></el-input>
      </el-form-item>
      <el-form-item label="内容值" prop="value">
        <el-input v-model="dataForm.value" placeholder="内容值"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="描述"></el-input>
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
          keyName: '',
          value: '',
          configKey: '',
          description: ''
        },
        dataRule: {
          keyName: [
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
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        if (id) {
          this.$http({
            url: this.$http.adornUrl('/m/dictionary/info/'),
            method: 'get',
            params: this.$http.adornParams({
              'dictionaryId': id
            })
          }).then(res => {
            this.$set(this, 'dataForm', res.data.res.data)
          })
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/m/dictionary${this.dataForm.id ? '/' + this.dataForm.id : ''}`),
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
          keyName: '',
          value: '',
          configKey: '',
          description: ''
        })
      }
    }
  }
</script>
