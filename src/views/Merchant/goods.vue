<template>
   <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm"  ref="dataForm"  :rules="dataRule" @keyup.enter.native="dataFormSubmit()" label-width="100px">
    <el-form-item label="应用名称：" prop="name">
        {{dataForm.name}}
    </el-form-item>
    <!-- <el-form-item
   > -->
        <table border="0"  style="width:100%" >
				<thead>
					<tr>
						<th>商品名称</th>
            <th>金额</th>
						<th>描述</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(merchantCommodities, index) in dataForm.merchantCommodities" :key="merchantCommodities.key">
						<td><el-input v-model="merchantCommodities.name" placeholder="商品名称"></el-input></td>
            <td><el-input v-model="merchantCommodities.money" placeholder="金额"></el-input></td>
						<td><el-input  v-model="merchantCommodities.mdesc" placeholder="描述"></el-input></td>
            	<i @click="addDomain" class="el-icon-circle-plus re r"></i>
             <i v-if="index !== 0" @click.prevent="removeDomain(merchantCommodities)" class="el-icon-remove re"></i>
					</tr>
				</tbody>
			</table>
    <!-- </el-form-item> -->
 </el-form>
 
			
  <div style="margin-top: 20px;text-align: center;">
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
      dataForm: {
        id: '',
        name: '',
        merchantCommodities: [{name: '', mdesc: '', money: ''}]
      },
      dataRule: {
        name: [
            { required: true, message: '应用名不能为空', trigger: 'blur' }
        ],
        mdesc: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
        ],
        money: [
            { required: true, message: '金额不能为空', trigger: 'blur' }
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
          url: this.$http.adornUrl('/m/merchant/' + id),
          method: 'get'
        })
          .then(res => {
            console.log(res)
            this.$set(this, 'dataForm', res.data.res.data)
            console.log(this.dataForm.merchantCommodities)
            if (this.dataForm.merchantCommodities.length === 0) {
              this.dataForm.merchantCommodities.push({
                name: '',
                mdesc: '',
                money: ''
              })
            }
            // this.$set(this, 'MerchantCommodity', res.data.res.data.merchantCommodities)
          })
      }
    },
    removeDomain (item) {
      var index = this.dataForm.merchantCommodities.indexOf(item)
      if (index !== -1) {
        this.dataForm.merchantCommodities.splice(index, 1)
      }
    },
    addDomain () {
      this.dataForm.merchantCommodities.push({
        name: '',
        mdesc: '',
        money: ''
      })
    },
      // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/m/merchantCommodity/addOrUpdate`),
            method: 'post',
            data: JSON.stringify({
              'merchantId': this.dataForm.id,
              'commodities': this.MerchantCommodity
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
    // close () {
    //   this.$set(this, 'MerchantCommodity', {
    //     mdesc: '',
    //     name: '',
    //     money: ''
    //     // MerchantCommodity: [{name: '', mdesc: '', money: ''}]
    //   })
    // }
  }
}
</script>

<style scoped>
td{
  width: 29%;
}
.re{
  color: #d03f3e;
  font-size: 28px;
  margin-left: 10px;
  margin-top: 4px;
}
.r{
  color: #17b3a3;
}
</style>

