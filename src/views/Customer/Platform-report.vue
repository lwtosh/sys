<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
      <el-form-item label="接入平台名称">
        <el-select v-model="dataForm.platformName" class="input-width" placeholder="全部" clearable>
        <el-option v-for="item in dataList1"
            :key="item.id"
            :label="item.platformName"
            :value="item.platformName">
          </el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="日期">
       <el-date-picker
      v-model="dataForm.time"
      type="daterange"
      format="yyyy 年 MM 月 dd 日"
      value-format="yyyy-MM-dd"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="platformName"
        header-align="center"
        align="center"
        label="接入平台名称">
      </el-table-column>
      <el-table-column
        prop="countBalance"
        header-align="center"
        align="center"
        label="订单总金额">
      </el-table-column>
      <el-table-column
        prop="chargeBalance"
        header-align="center"
        align="center"
        label="总手续费">
      </el-table-column>
      <el-table-column
        prop="countSettlementBalance"
        header-align="center"
        align="center"
        label="订单应结算金额">
      </el-table-column>
      <el-table-column
        prop="unSettlementBalance"
        header-align="center"
        align="center"
        label="订单未结算金额">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="130"
        label="操作">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="addWallet(scope.row.id)">明细</el-button>
        </template>
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
     <walletdetails v-if="addwalletVisible" ref="Walletdetails" @refreshDataList="getDataList"></walletdetails>
  </div>
</template>

<script>
 import Walletdetails from './Wallet-details'
 export default {
   data () {
     return {
       id: '',
       dataForm: {
         platformName: '',
         time: ''
       },
       accessPlatformId: '',
       dataList: [],
       dataList1: [],
       pageIndex: 1,
       pageSize: 10,
       totalPage: 0,
       dataListLoading: false,
       addwalletVisible: false,
       dataListSelections: []
     }
   },
   components: {
     Walletdetails
   },
   activated () {
     this.getDataList()
   },
   methods: {
      // 获取数据列表
     getDataList () {
       this.dataListLoading = true
       this.$http({
         url: this.$http.adornUrl('/m/selectAccessPlatforms'),
         method: 'get'
       }).then(({data}) => {
         this.$set(this, 'dataList1', data.res.data)
       })
       this.$http({
         url: this.$http.adornUrl('/m/accessPlatform/walletPage'),
         method: 'post',
         params: this.$http.adornParams({
           'currentPage': this.pageIndex,
           'pageSize': this.pageSize
         }),
         data: JSON.stringify({
           platformName: this.dataForm.platformName,
           startTimeStr: this.dataForm.time[0],
           endTimeStr: this.dataForm.time[1]
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
     addWallet (id) {
       this.addwalletVisible = true
       this.$nextTick(() => {
         this.$refs.Walletdetails.init(id)
       })
     }
   }
 }
</script>
<style scoped>
</style>