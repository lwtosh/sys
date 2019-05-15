
<template>
  <div class="mod-user">
    <el-form :inline="true" :model="dataForm" ref="dataForm" class="demo-form-inline" @keyup.enter.native="getDataList()">
      <el-form-item label="商户编码">
        <el-input v-model="dataForm.accessCode" placeholder="商户编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="联系人手机号">
        <el-input v-model="dataForm.telphone" placeholder="联系人手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button @click="resetForm('dataForm')">重置</el-button>
        <el-button  type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('sys:user:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-form :inline="true" :model="dataForm" >
    <el-form-item>
          <el-button  type="text"  @click="addConfigKey(id)">配置密钥</el-button>
          <el-button  type="text" @click="addAudit(id)">审核</el-button>
          <el-button  type="text" @click="addBind(id)">绑定应用</el-button>
          <el-button  type="text"  @click="addExamine(id)">查看</el-button>
          <el-button  type="text"  @click="addFundsPwd(id)">设置资金密码</el-button>
          <el-button  type="text"   @click="addOrUpdateHandle(id)">修改</el-button>
          <el-button type="text"  @click="deleteHandle(id)">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="platformName"
        header-align="center"
        align="center"
        width="180"
        label="商户名称">
      </el-table-column>
      <el-table-column
        prop="accessCode"
        header-align="center"
        align="center"
        width="120"
        label="商户编码">
      </el-table-column>
      <el-table-column
        prop="telphone"
        header-align="center"
        align="center"
        width="150"
        label="联系人手机号">
      </el-table-column>
      <el-table-column
        prop="startTime"
        header-align="center"
        align="center"
         width="180"
        label="签约开始日期">
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        width="180"
        label="签约结束日期">
      </el-table-column>
      <el-table-column
        prop="licenseNo"
        header-align="center"
        align="center"
       width="180"
        label="营业执照号码">
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
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <config-key v-if="ConfigKeyVisible" ref="ConfigKey" @refreshDataList="getDataList"></config-key>
    <examine v-if="examineVisible" ref="examine" @refreshDataList="getDataList"></examine>
    <funds v-if="FundsPwdVisible" ref="funds" @refreshDataList="getDataList"></funds>
    <audit v-if="AuditVisible" ref="Audit" @refreshDataList="getDataList"></audit>
    <bind v-if="bindVisible" ref="bind" @refreshDataList="getDataList"></bind>
  </div>
</template>

<script>
  import addOrUpdate from './platfrom'
  import ConfigKey from './ConfigKey'
  import examine from './examine'
  import funds from './FundsPwd'
  import Audit from './Audit'
  import bind from './bind'

  export default {
    data () {
      return {
        id: '',
        idm: '',
        dataForm: {
          accessCode: '',
          telphone: ''
        },
        accessPlatformId: '',
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        ConfigKeyVisible: false,
        examineVisible: false,
        FundsPwdVisible: false,
        AuditVisible: false,
        bindVisible: false
      }
    },
    components: {
      addOrUpdate,
      ConfigKey,
      examine,
      funds,
      Audit,
      bind
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/m/accessPlatform/page'),
          method: 'post',
          params: this.$http.adornParams({
            'currentPage': this.pageIndex,
            'pageSize': this.pageSize
          }),
          data: JSON.stringify({
            accessCode: this.dataForm.accessCode,
            telphone: this.dataForm.telphone
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
        // this.$refs[dataForm].resetFields()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        // eslint-disable-next-line no-redeclare
        var id = id || this.dataListSelections.map(item => {
          return item.id
        })
        // if (id !== '' && this.dataListSelections.length <= 0) {
        //   this.$message('请选择你要修改的行')
        // }
        // if (id !== '' && this.dataListSelections.length > 1) {
        //   this.$message('只能选择一个')
        // }
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id[0])
        })
      },
      // 配置密钥
      addConfigKey (id) {
        // eslint-disable-next-line no-redeclare
        var id = id || this.dataListSelections.map(item => {
          return item.id
        })
        if (id !== '' && this.dataListSelections.length <= 0) {
          this.$message.error('请选择一个')
          this.ConfigKeyVisible = false
        } else if (id !== '' && this.dataListSelections.length > 1) {
          this.$message.error('只能选择一个')
          this.ConfigKeyVisible = false
        } else {
          this.ConfigKeyVisible = true
          this.$nextTick(() => {
            this.$refs.ConfigKey.init(id[0])
          })
        }
      },
      // 审核
      addAudit (id) {
        // eslint-disable-next-line no-redeclare
        var id = id || this.dataListSelections.map(item => {
          return item.id
        })
        if (id !== '' && this.dataListSelections.length <= 0) {
          this.$message.error('请选择一个')
          this.AuditVisible = false
        } else if (id !== '' && this.dataListSelections.length > 1) {
          this.$message.error('只能选择一个')
          this.AuditVisible = false
        } else {
          this.AuditVisible = true
          this.$nextTick(() => {
            this.$refs.Audit.init(id[0])
          })
        }
      },
      // 查看
      addExamine (id) {
        // eslint-disable-next-line no-redeclare
        var id = id || this.dataListSelections.map(item => {
          return item.id
        })
        if (id !== '' && this.dataListSelections.length <= 0) {
          this.$message.error('请选择一个')
          this.examineVisible = false
        } else if (id !== '' && this.dataListSelections.length > 1) {
          this.$message.error('只能选择一个')
          this.examineVisible = false
        } else {
          this.examineVisible = true
          this.$nextTick(() => {
            this.$refs.examine.init(id[0])
          })
        }
      },
      // 绑定用户
      addBind (id) {
        // eslint-disable-next-line no-redeclare
        var id = id || this.dataListSelections.map(item => {
          return item.id
        })
        if (id !== '' && this.dataListSelections.length <= 0) {
          this.$message.error('请选择一个')
          this.bindVisible = false
        } else if (id !== '' && this.dataListSelections.length > 1) {
          this.$message.error('只能选择一个')
          this.bindVisible = false
        } else {
          this.bindVisible = true
          this.$nextTick(() => {
            this.$refs.bind.init(id[0])
          })
        }
      },
      // 设置资金密码
      addFundsPwd (id) {
        // eslint-disable-next-line no-redeclare
        var id = id || this.dataListSelections.map(item => {
          return item.id
        })
        if (id !== '' && this.dataListSelections.length === 0) {
          this.$message.error('请选择一个')
          this.FundsPwdVisible = false
        } else if (id !== '' && this.dataListSelections.length > 1) {
          this.$message.error('只能选择一个')
          this.FundsPwdVisible = false
        } else {
          this.FundsPwdVisible = true
          this.$nextTick(() => {
            this.$refs.funds.init(id[0])
          })
        }
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
            url: this.$http.adornUrl('/m/accessPlatform/delByIds'),
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
<style scoped>
img{
  width: 100% !important;
}
.box{
  width: 100%;
  display: flex;
}
</style>