<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
    <el-form-item label="商户名称">
      <el-select  v-model="dataForm.platformName" :disabled='isActive' class="input-width" placeholder="全部" clearable>
        <el-option v-for="item in dataList2"
            :key="item.id"
            :label="item.platformName"
            :value="item.id"
            >
          </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="应用平台">
          <el-select v-model="dataForm.name" class="input-width" placeholder="全部" clearable>
           <el-option v-for="item in dataList3"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
          </el-select>
      </el-form-item>
      <el-form-item label="平台订单号">
        <el-input v-model="dataForm.orderNo" placeholder="平台订单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="客户订单号">
        <el-input v-model="dataForm.fourOrderNo" placeholder="客户订单号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button @click="resetForm('dataForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="accessPlatformName"
        header-align="center"
        align="center"
        width="180"
        label="商户平台">
      </el-table-column>
      <el-table-column
        prop="merchantName"
        header-align="center"
        align="center"
        width="180"
        label="应用平台">
      </el-table-column>
      <el-table-column
        prop="orderNo"
        header-align="center"
        align="center"
        width="180"
        label="平台订单号">
      </el-table-column>
      <el-table-column
        prop="fourOrderNo "
        header-align="center"
        align="center"
        width="180"
        label="客户订单号">
      </el-table-column>
      <el-table-column
        prop="threeOrderNo "
        header-align="center"
        align="center"
        width="180"
        label="支付订单号">
      </el-table-column>
      <el-table-column
        prop="totalFee"
        header-align="center"
        align="center"
        width="120"
        label="订单总金额">
      </el-table-column>
      <el-table-column
        prop="settlementFee"
        header-align="center"
        align="center"
        width="120"
        label="结算金额">
      </el-table-column>
      <el-table-column
        prop="chargeFee"
        header-align="center"
        align="center"
        width="120"
        label="手续费">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        width="120"
        label="订单状态">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" size="small" >待支付</el-tag>
          <el-tag v-if="scope.row.status === '2'" size="small" >支付成功</el-tag>
          <el-tag v-if="scope.row.status === '3'" size="small" type="danger">支付失败</el-tag>
          <el-tag v-if="scope.row.status === '4'" size="small">订单关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="settlementStatus "
        header-align="center"
        align="center"
        width="120"
        label="结算状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.settlementStatus === '1'" size="small" >未结算</el-tag>
          <el-tag v-if="scope.row.settlementStatus === '2'" size="small" >部分结算</el-tag>
          <el-tag v-if="scope.row.settlementStatus === '3'" size="small" >已结算</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="settlementTime "
        header-align="center"
        align="center"
        width="180"
        label="结算时间">
      </el-table-column>
      <el-table-column
        prop="closeTime"
        header-align="center"
        align="center"
        width="180"
        label="订单关闭时间">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        id: '',
        idm: '',
        dataForm: {
          platformName: '',
          name: '',
          fourOrderNo: '',
          orderNo: ''
        },
        accessPlatformId: '',
        accessPlatformId1: '',
        dataList: [],
        dataList2: [],
        dataList3: [],
        isActive: false,
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },

    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/m/user/meInfo'),
          method: 'get'
        }).then(({data}) => {
          this.accessPlatformId = data.res.data.accessPlatformId
          this.$http({
            url: this.$http.adornUrl('/m/selectAccessPlatforms'),
            method: 'get'
          }).then(({data}) => {
            this.$set(this, 'dataList2', data.res.data)
            this.accessPlatformId1 = data.res.data.id
            for (var i = 0; i < this.dataList2.length; i++) {
              this.accessPlatformId1 = this.dataList2[i].id
              if (this.accessPlatformId !== '' && this.accessPlatformId === this.accessPlatformId1) {
                this.dataForm.platformName = this.dataList2[i].platformName
                this.isActive = true
              }
            }
          })
        })
        // 应用平台下拉框
        this.$http({
          url: this.$http.adornUrl('/m/selectMerchants'),
          method: 'get'
        }).then(({data}) => {
          this.$set(this, 'dataList3', data.res.data)
        })
        this.$http({
          url: this.$http.adornUrl('/m/order/page'),
          method: 'post',
          params: this.$http.adornParams({
            'currentPage': this.pageIndex,
            'pageSize': this.pageSize
          }),
          data: JSON.stringify({
            'accessPlatformId': this.dataForm.platformName,
            'merchantId': this.dataForm.name,
            'fourOrderNo': this.dataForm.fourOrderNo,
            'orderNo': this.dataForm.orderNo
          })
        }).then(({data}) => {
          if (data && data.code === '200') {
            this.dataList = data.res.data.records
            this.totalPage = data.res.data.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 重置
      resetForm (dataForm) {
        this.dataForm = Object.assign({}, dataForm)
      }
  
    }
  }
</script>
<style scoped>
</style>