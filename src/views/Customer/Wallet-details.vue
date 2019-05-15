<template>
  <div class="mod-user">
    <!-- <transition name="el-zoom-in-center"> -->
    <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline">
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      style="width: 100%;">
      <el-table-column
        prop="orderNo"
        header-align="center"
        align="center"
        width="180px"
        label="平台订单号">
      </el-table-column>
      <el-table-column
        prop="threeOrderNo"
        header-align="center"
        align="center"
        width="180"
        label="第三方支付订单号">
      </el-table-column>
      <el-table-column
        prop="fourOrderNo"
        header-align="center"
        align="center"
        width="180"
        label="第四方订单号">
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
        label="已结算金额">
      </el-table-column>
        <el-table-column
        prop="actualFee"
        header-align="center"
        align="center"
        width="120"
        label="结算金额">
      </el-table-column>
      <el-table-column
        prop="settlementStatus"
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
        prop="settlementTime"
        header-align="center"
        align="center"
        width="180"
        label="结算时间">
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
     </el-dialog>
      <!-- </transition> -->
  </div>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        id: '',
        dataForm: {
          id: '',
          time: ''
        },
        accessPlatformId: '',
        dataList: [],
        // dataList1: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: []
      }
    },
    activated () {
      this.init()
    },
    methods: {
      init (id) {
        this.dataForm.id = id || this.dataForm.id
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.$http({
          url: this.$http.adornUrl('/m/accessPlatform/walletDetailPage'),
          method: 'post',
          params: this.$http.adornParams({
            'currentPage': this.pageIndex,
            'pageSize': this.pageSize
          }),
          data: JSON.stringify({
            accessPlatformId: this.dataForm.id,
            startTimeStr: this.dataForm.time[0],
            endTimeStr: this.dataForm.time[1]
          })
        }).then(({ data }) => {
          if (data && data.code === '200') {
            console.log(data)
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
        this.init()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.init()
      }
  
    }
  }
</script>
<style scoped>
.mod-user .el-dialog{
  width: 70% !important;
}
</style>