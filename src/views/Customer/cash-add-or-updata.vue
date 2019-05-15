<template>
  <el-dialog
    :title="dataForm.id ? '修改' : '新增'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="close"
    >
    <el-form
      :model="dataForm"
      ref="dataForm"
      :rules="dataRule"
      @keyup.enter.native="dataFormSubmit()"
      label-width="120px">
      <el-form-item
        prop="accessPlatformId"
        label="商户名称"
        style="width:50%;">
      <el-select @change="handleChange2" v-model="dataForm.accessPlatformId" class="input-width" placeholder="全部" clearable>
        <el-option v-for="item in dataList2"
            :key="item.id"
            :label="item.platformName"
            :value="item.id">
          </el-option>
      </el-select>
      </el-form-item>
      <div class="box">
        <el-form-item
        label="账户类型"
        prop="accType"
        style="width:50%;">
      <el-select v-model="dataForm.accType" placeholder="账户类型">
           <el-option v-for='item in merchantList2' :key="item.id" :label="item.value" :value="item.keyName"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item
        label="账户姓名"
        prop="bankName">
      <el-input v-model="dataForm.bankName" placeholder="账户姓名">
      </el-input>
      </el-form-item>
      </div>
      <div class="box">
        <el-form-item
        label="证件类型"
        prop="cardType"
        style="width:50%;">
       <el-select v-model="dataForm.cardType" placeholder="证件类型">
           <el-option v-for='item in merchantList3' :key="item.id" :label="item.value" :value="item.keyName"></el-option>
         </el-select>
       </el-form-item>
      <el-form-item
        label="证件号码"
        prop="cardNo" >
      <el-input v-model="dataForm.cardNo" placeholder="证件号码"> </el-input>
      </el-form-item>
      </div>
      <div class="box">
        <el-form-item
        label="银行卡类型"
        prop="bankType"
        style="width:50%;">
        <el-select v-model="dataForm.bankType" placeholder="证件类型">
           <el-option v-for='item in merchantList4' :key="item.id" :label="item.value" :value="item.keyName"></el-option>
         </el-select>
      </el-form-item>
      <el-form-item
        label="银行卡号"
        prop="bankNo">
        <el-input
          v-model="dataForm.bankNo"
          placeholder="银行卡号">
        </el-input>
      </el-form-item>
      </div>
      <div class="box">
         <el-form-item
        label="银行卡所在省"
        prop="province"
        style="width:50%;">
      <el-select @change="handleChange" v-model="dataForm.province" class="input-width" placeholder="全部" clearable>
        <el-option v-for="item in dataList3" 
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
      </el-select>
      </el-form-item>
      <el-form-item
        label="银行卡所在市"
        prop="urban"
        >
        <el-select v-model="dataForm.urban" class="input-width" placeholder="全部" clearable>
        <el-option v-for="item in dataList4" 
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
      </el-select>
      </el-form-item>
      </div>
     <div class="box">
       <el-form-item
        label="开户行"
        prop="openingBank" 
        style="width:50%;">
        <el-select v-model="dataForm.openingBank" placeholder="证件类型">
           <el-option v-for='item in merchantList1' :key="item.id" :label="item.value" :value="item.keyName"></el-option>
         </el-select>
      </el-form-item>
       <el-form-item
        label="开户行地址"
        prop="bankAddress">
        <el-input
          v-model="dataForm.bankAddress"
          placeholder="开户行地址"
        ></el-input>
      </el-form-item>
     </div>
      <el-form-item
        label="资金密码"
        prop="capitalPassWord"
        style="width:42%;" 
        v-if="dataForm.id === ''">
        <el-input
          type="password"
          v-model="dataForm.capitalPassWord"
          placeholder="资金密码"
        ></el-input>
      </el-form-item>
      <div class="box">
        <el-form-item
        label="可提现额"
        v-if="dataForm.id === ''"
        prop="balance" style="width:50%;">{{this.balance || 0}}
      </el-form-item>
      <el-form-item
        label="提现金额"
        prop="withdrawalFee"  v-if="dataForm.id === ''">
        <el-input
      
          v-model="dataForm.withdrawalFee"
          placeholder="提现金额"
        ></el-input>
      </el-form-item>
      </div>
      
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
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    var validateFree = (rule, value, callback) => {
      let reg = /^[0-9]{1,6}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('金额只能为正整数且小于六位数'))
      }
    }
    return {
      visible: false,
      dataList2: [],
      dataList3: [],
      dataList4: [],
      BANK_NAME: ['BANK_NAME'],
      ACC_TYPE: ['ACC_TYPE'],
      CARD_TYPE: ['CARD_TYPE'],
      BANK_TYPE: ['BANK_TYPE'],
      merchantList1: [],
      merchantList2: [],
      merchantList3: [],
      merchantList4: [],
      provincesId: [],
      balance: '',
      dataForm: {
        id: '',
        accessCode: '',
        accessPlatformId: '',
        accType: '',
        cardType: '',
        bankType: '',
        bankNo: '',
        bankName: '',
        province: '',
        openingBank: '',
        bankAddress: '',
        withdrawalFee: '',
        urban: '',
        cardNo: '',
        capitalPassWord: '',
        status: 1
      },
      dataRule: {
        telphone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        accessPlatformId: [
          { required: true, message: '请选择平台名称', trigger: 'blur' }
        ],
        accType: [
          { required: true, message: '请选择账户类型', trigger: 'blur' }
        ],
        cardNo: [
          { required: true, message: '证件号码不能为空', trigger: 'blur' },
          {min: 18, max: 18}
        ],
        cardType: [
          { required: true, message: '请选择证件类型', trigger: 'blur' }
        ],
        bankType: [
          { required: true, message: '请选择银行类型', trigger: 'blur' }
        ],
        bankNo: [
          { required: true, message: '银行卡号不能为空', trigger: 'blur' },
          {min: 15, max: 21}
        ],
        bankName: [
          { required: true, message: '账户名称不能为空', trigger: 'blur' }
        ],
        province: [
          { required: true, message: '请选择省份', trigger: 'blur' }
        ],
        openingBank: [
          { required: true, message: '请选择开户行', trigger: 'blur' }
        ],
        bankAddress: [
          { required: true, message: '请填写地址', trigger: 'blur' },
          {min: 6, max: 50}
        ],
        withdrawalFee: [
          { required: true, message: '可提金额不能为空', trigger: 'blur' },
          {min: 1, max: 6, validator: validateFree}
        ],
        urban: [
          { required: true, message: '请选择市', trigger: 'blur' }
        ],
        capitalPassWord: [
          { required: true, message: '请填写资金密码', trigger: 'blur' },
          {min: 2, max: 20}
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
        url: this.$http.adornUrl('/m/selectAccessPlatforms'),
        method: 'get'
      }).then(({data}) => {
        this.$set(this, 'dataList2', data.res.data)
      })
      this.$http({
        url: this.$http.adornUrl('/m/common/provincess'),
        method: 'get'
      }).then(({data}) => {
        this.$set(this, 'dataList3', data.res.data)
      })
      this.$http({
        url: this.$http.adornUrl('/m/dictionary/configKeys'),
        method: 'post',
        data: JSON.stringify(this.BANK_NAME)
      }).then(({ data }) => {
        this.$set(this, 'merchantList1', data.res.data)
      })
      this.$http({
        url: this.$http.adornUrl('/m/dictionary/configKeys'),
        method: 'post',
        data: JSON.stringify(this.ACC_TYPE)
      }).then(({ data }) => {
        this.$set(this, 'merchantList2', data.res.data)
      })
      this.$http({
        url: this.$http.adornUrl('/m/dictionary/configKeys'),
        method: 'post',
        data: JSON.stringify(this.CARD_TYPE)
      }).then(({ data }) => {
        this.$set(this, 'merchantList3', data.res.data)
      })
      this.$http({
        url: this.$http.adornUrl('/m/dictionary/configKeys'),
        method: 'post',
        data: JSON.stringify(this.BANK_TYPE)
      }).then(({ data }) => {
        this.$set(this, 'merchantList4', data.res.data)
      })
      if (id) {
        this.$http({
          url: this.$http.adornUrl('/m/accessPlatformCash/' + id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(res => {
          this.$set(this, 'dataForm', res.data.res.data)
          if (!res.data.res.data.ids) {
            this.$set(this.dataForm, 'ids', [])
          }
        })
      }
    },
    handleChange (val) {
      this.provincesId = val
      this.$http({
        url: this.$http.adornUrl('/m/common/getcp/' + this.provincesId),
        method: 'get'
      }).then(({data}) => {
        this.$set(this, 'dataList4', data.res.data)
      })
    },
    handleChange2 (val) {
      this.dataList2.forEach(item => {
        if (item.id === this.dataForm.accessPlatformId) {
          this.balance = item.balance
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/m/accessPlatformCash${this.dataForm.id ? '/' + this.dataForm.id : ''}`),
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
        accessCode: '',
        accessPlatformId: '',
        accType: '',
        cardType: '',
        bankType: '',
        bankNo: '',
        bankName: '',
        province: '',
        openingBank: '',
        bankAddress: '',
        withdrawalFee: '',
        urban: '',
        capitalPassWord: ''
      })
    }
  }
}
</script>

<style>
.box{
  width: 100%;
  display: flex;
}
</style>

