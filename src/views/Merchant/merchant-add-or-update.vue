<template>
  <el-dialog
    :title="dataForm.id ? '修改' : '新增'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close = "close">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item style="width: 50%;" label="应用名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="应用名称"></el-input>
      </el-form-item>
      <el-form-item label="支付公司" prop="payCompanyKey">
         <el-select v-model="dataForm.payCompanyKey" placeholder="支付公司">
           <el-option v-for='item in merchantList' :key="item.id" :label="item.value" :value="item.keyName"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item label="结算费率" prop="rate" >
        <el-input style="width: 20%;" v-model="dataForm.rate" placeholder="结算费率"></el-input> <span>%</span>
      </el-form-item>
      <el-form-item label="支付金额" prop="num">
        <div class="box">
        <el-form-item prop="startNum" >
        <el-input style="width: 50%;"  v-model.number="dataForm.startNum" @change="handleMinChange"></el-input>
        </el-form-item>
        <span style="
    margin-left: -91px;">&nbsp;&nbsp;  ~  &nbsp;&nbsp; </span>
        <el-form-item prop="endNum">
        <el-input style="width: 50%;"  v-model.number="dataForm.endNum" @change="handleMaxChange"></el-input>
        </el-form-item>
        </div>
        
      </el-form-item>
      <el-form-item style="width: 50%;" label="描述" prop="description">
        <el-input  type="textarea" v-model="dataForm.description" placeholder="描述"></el-input>
      </el-form-item>
      <el-form-item
    v-for="(merchantConfigs, index) in dataForm.merchantConfigs"
    :label="'主体参数信息' + index"
    :key="merchantConfigs.key"
    :prop="'merchantConfigs.' + index + '.value'"
    :rules="{
      required: true, message: '参数信息', trigger: 'blur'
    }" 
  >
    <el-input  style="width: 26%;" v-model="merchantConfigs.key" placeholder="key" ></el-input>
    <el-input  style="width: 26%;" v-model="merchantConfigs.value" placeholder="value"></el-input>
    <el-input  style="width: 27%;" v-model="merchantConfigs.remark" placeholder="remark"></el-input>
    	<i @click="addDomain" class="el-icon-circle-plus re r"></i>
             <i v-if="index !== 0" @click.prevent="removeDomain(merchantConfigs)" class="el-icon-remove re "></i>
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
      let reg2 = /^[0-9]{1,8}$/
      var validateCom = (rule, value, callback) => {
        if (reg2.test(value)) {
          callback()
        } else {
          callback(new Error('输入值必须大于0且为整数'))
        }
      }
      var validateMax = (rule, value, callback) => {
        let max = this.dataForm.startNum
        if (max && value > max) {
          return callback()
        }
        return callback(new Error('输入值不得小于最小阈值'))
      }
      var validaterate = (rule, value, callback) => {
        let reg1 = /^([1-9]{1,2})(\.[0-9]{1,2})?$/
        if (reg1.test(value)) {
          callback()
        } else {
          callback(new Error('结算率输入有误'))
        }
      }
      return {
        visible: false,
        min: '',
        max: '',
        dataForm: {
          id: '',
          name: '',
          payCompanyKey: '',
          description: '',
          startNum: '',
          endNum: '',
          merchantConfigs: [{value: '', key: '', remark: ''}]
        },
        merchantList: [],
        PAY_COMPANY: ['PAY_COMPANY'],
        dataRule: {
          name: [
            { required: true, message: '应用名不能为空', trigger: 'blur' },
            {min: 2, max: 40}
          ],
          payCompanyKey: [
            { required: true, message: '支付公司不能为空', trigger: 'blur' }
          ],
          rate: [
            { required: true, validator: validaterate, trigger: 'blur' }
          ],
          startNum: [
            { required: true, message: '必填', trigger: 'blur' },
            { validator: validateCom }
          ],
          endNum: [
            { required: true, validator: validateCom, trigger: 'blur' },
            { validator: validateMax, trigger: 'blur' }
          ],
          description: [
             {min: 0, max: 225}
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
          url: this.$http.adornUrl('/m/dictionary/configKeys'),
          method: 'post',
          data: JSON.stringify(this.PAY_COMPANY)
        }).then(({ data }) => {
          this.$set(this, 'merchantList', data.res.data)
        })
        if (id) {
          this.$http({
            url: this.$http.adornUrl('/m/merchant/' + id),
            method: 'get'
          })
          .then(res => {
            this.$set(this, 'dataForm', res.data.res.data)
          })
        }
      },
      // 移除
      removeDomain (item) {
        var index = this.dataForm.merchantConfigs.indexOf(item)
        if (index !== -1) {
          this.dataForm.merchantConfigs.splice(index, 1)
        }
      },
      // 添加
      addDomain () {
        this.dataForm.merchantConfigs.push({
          value: '',
          key: '',
          remark: ''
        })
      },
      handleMinChange () {
        this.$refs.dataForm.validateField('max')
      },
      handleMaxChange () {
        this.$refs.dataForm.validateField('min')
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/m/merchant${this.dataForm.id ? '/' + this.dataForm.id : ''}`),
              method: this.dataForm.id ? 'put' : 'post',
              data: JSON.stringify(this.dataForm)
            }).then(({data}) => {
              if (data && data.code === '200') {
                console.log(data)
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
          name: '',
          payCompanyKey: '',
          description: '',
          startNum: '',
          endNum: '',
          merchantConfigs: [{value: '', key: '', remark: ''}]
        })
      }
    }
  }
</script>
<style scoped>
  .re{
  color: #d03f3e;
  font-size: 28px;
  margin-left: 10px;
  vertical-align: middle;
}
.r{
  color: #17b3a3;
}
.box{
  display: flex;
  /* width: 238px; */
}
</style>

