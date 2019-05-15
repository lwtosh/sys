<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <!--  -->
      <el-table-column
        prop="accessPlatformName"
        header-align="center"
        align="center"
        width="150"
        label="接入平台名称">
      </el-table-column>
      <el-table-column
        prop="accTypeName"
        header-align="center"
        align="center"
        width="150"
        label="账户类型">
      </el-table-column>
      <el-table-column
        prop="bankName"
        header-align="center"
        align="center"
        width="150"
        label="账户姓名">
      </el-table-column>
      <el-table-column
        prop="cardTypeName"
        header-align="center"
        width="150"
        align="center"
        label="证件类型">
      </el-table-column>
      <el-table-column
        prop="cardNo"
        header-align="center"
        width="180"
        align="center"
        label="证件号码">
      </el-table-column>
      <el-table-column
        prop="bankTypeName"
        header-align="center"
        align="center"
        width="150"
        label="银行卡类型">
      </el-table-column>
      <el-table-column
        prop="bankNo"
        header-align="center"
        align="center"
        width="180"
        label="银行卡号">
      </el-table-column>
      <el-table-column
        width="150"
        prop="withdrawalFee"
        header-align="center"
        align="center"
        label="提现金额">
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="审核状态">
         <template slot-scope="scope">
          <el-tag v-if="scope.row.status === '1'" size="small" >待审核</el-tag>
          <el-tag v-if="scope.row.status === '2'" size="small" >通过</el-tag>
          <el-tag v-if="scope.row.status === '3'" size="small" type="danger">不通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        prop="auditorName"
        header-align="center"
        align="center"
        label="审核人">
      </el-table-column>
      <el-table-column
        prop="auditorTime"
        header-align="center"
        align="center"
        width="180"
        label="审核时间">
      </el-table-column>
      <el-table-column
        prop="createTime"
        header-align="center"
        align="center"
        width="180"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="180"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addAudit(scope.row.id)">审核</el-button>
          <el-button type="text" size="small" @click="addCheck(scope.row.id)">查看</el-button>
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <audit v-if="auditVisible" ref="Audit" @refreshDataList="getDataList"></audit>
    <check v-if="checkVisible" ref="check" @refreshDataList="getDataList"></check>
  </div>
</template>

<script>
  import AddOrUpdate from './cash-add-or-updata'
  import Audit from './cash-audit'
  import check from './cash-check'
  export default {
    data () {
      return {
        dataForm: {
          accessPlatformName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        auditVisible: false,
        checkVisible: false
      }
    },
    components: {
      AddOrUpdate,
      Audit,
      check
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/m/accessPlatformCash/page'),
          method: 'post',
          params: this.$http.adornParams({
            'currentPage': this.pageIndex,
            'pageSize': this.pageSize
          }),
          data: JSON.stringify({keyName: this.dataForm.keyName})
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
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      addAudit (id) {
        this.auditVisible = true
        this.$nextTick(() => {
          this.$refs.Audit.init(id)
        })
      },
      addCheck (id) {
        this.checkVisible = true
        this.$nextTick(() => {
          this.$refs.check.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/m/dictionary/delByIds'),
            method: 'delete',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            if (data && data.code === '200') {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.message)
            }
          })
        }).catch(() => {})
      }
    }
  }
</script>
