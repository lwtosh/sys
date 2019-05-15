<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visible">
   <el-form :model="dataForm"  ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
    <el-form-item size="mini" label="授权">
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="id"
          ref="menuListTree"
          :default-expand-all="true"
          :default-checked-keys="defaultCheckedArr"
          show-checkbox>
        </el-tree>
    </el-form-item>
  </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
</template>

<script>
 import { treeDataTranslate } from '@/utils'
export default {
   data () {
     return {
       visible: false,
       menuList: [],
       updateTalk: '',
       id: '',
       menuListTreeProps: {
         label: 'resourceName',
         children: 'children'
       },
       dataForm: {
         parentId: ''
       },
       defaultCheckedArr: [],
       tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
     }
   },
   methods: {
     init (id) {
       this.id = id
       this.visible = true
       this.$nextTick(() => {
         this.$refs['dataForm'].resetFields()
         this.$refs.menuListTree.setCheckedKeys([])
       })
       if (id) {
         this.$http({
           url: this.$http.adornUrl('/m/getResourceType'),
           method: 'post',
           data: JSON.stringify({
             roleId: id
           })
         }).then(({data}) => {
           const arrData = data.res.data
           this.$set(this, 'defaultCheckedArr', this.yc(arrData))
           this.menuList = treeDataTranslate(data.res.data, 'id')
 
           var idx = data.res.data.indexOf(this.tempKey)
           if (idx !== -1) {
             data.res.data.splice(idx, data.res.data.length - idx)
           }
           this.$refs.menuListTree.setCheckedKeys(data.res.data)
         })
       }
     },
     yc (arr) {
       var ass = []
       arr.forEach(item => {
         if (item.children) {
           ass = ass.concat(this.yc(item.children))
         }
         if (item.bool) {
           ass.push(item.id)
         }
       })
       return Array.from(new Set(ass))
     },
     menuListTreeCurrentChangeHandle (data, node) {
       this.menuIdList.aid = data.res.data.id
       this.menuIdList.bids = data.res.data.parentId
     },
      // 菜单树设置当前选中节点
     menuListTreeSetCurrentNode () {
       this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
       this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['resourceName']
     },
      // 表单提交
     dataFormSubmit () {
       this.$refs['dataForm'].validate((valid) => {
         if (valid) {
           this.$http({
             url: this.$http.adornUrl(`/m/addOrUpdateRelation`),
             method: 'post',
             data: JSON.stringify({
               'aid': this.id,
               'bids': this.$refs.menuListTree.getCheckedKeys(this.dataForm.parentId)
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
   }
}
</script>
