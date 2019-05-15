<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
  <el-table
    ref="multipleTable"
    :data="dataList"
    border
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange"
   
  >
    <el-table-column
      type="selection"
      width="55" @row-key="openDetails">
    </el-table-column>
    <el-table-column
      prop="payCompanyKey"
      label="支付公司">
    </el-table-column>
    <el-table-column
      prop="name"
      label="应用名称">
    </el-table-column>
    <el-table-column
      prop="rate"
      label="结算费率"
      show-overflow-tooltip>
    </el-table-column>
    
  </el-table>
  </el-form>
  <div style="margin-top: 20px">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
    </div>
  </el-dialog>
  
</template>

<script>
export default {
  data () {
    return {
      visible: false,
      dataList: [],
      multipleSelection: [],
      selected: [],
      dataForm: {
        accessPlatformId: '',
        name: '',
        payCompanyKey: '',
        rate: ''
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.accessPlatformId = id || ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      this.$http({
        url: this.$http.adornUrl('/m/accessPlatform/amList'),
        method: 'post',
        data: JSON.stringify(this.dataForm)
      }).then(({ data }) => {
        this.$refs.multipleTable.clearSelection()
        this.$set(this, 'dataList', data.res.data)
        const _that = this
        this.dataList.forEach((item) => {
          if (item.bool) {
            this.$nextTick(() => {
              _that.$refs.multipleTable.toggleRowSelection(item, true)
            })
          }
        })
      })
    },
    dataFormSubmit (row) {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl('/m/accessPlatformMerchant/addOrUpdate'),
            method: 'post',
            data: JSON.stringify({
              ids: this.multipleSelection.map(item => {
                return item.id
              }),
              accessPlatformId: this.dataForm.accessPlatformId
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
    },
    openDetails (rows) {
      console.log(rows.id)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

