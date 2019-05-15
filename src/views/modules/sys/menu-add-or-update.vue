<template>
  <el-dialog
    :title="dataForm.id ? '修改' : '新增'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="菜单名称" prop="resourceName">
        <el-input v-model="dataForm.resourceName" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item   label="菜单地址" prop="resourceUrl">
        <el-input v-model="dataForm.resourceUrl" placeholder="菜单地址"></el-input>
      </el-form-item>
      <el-form-item  label="是否父级" prop="type">
      <el-radio-group v-model="dataForm.type">
      <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}</el-radio>
      </el-radio-group>
     </el-form-item>
      <el-form-item v-if="dataForm.type === 1" label="父级菜单" prop="parentId">
        <el-select v-model="dataForm.parentId">
          <el-option v-for="item in menulist" :key='item.id' :value="item.id"
          :label="item.resourceName"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="排序号" prop="sortNum">
        <el-input-number v-model="dataForm.sortNum" controls-position="right" :min="0" label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item  label="菜单图标" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover
              ref="iconListPopover"
              placement="bottom-start"
              trigger="click"
              popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-inner">
                <div class="mod-menu__icon-list">
                  <el-button
                    v-for="(item, index) in iconList"
                    :key="index"
                    @click="iconActiveHandle(item)"
                    :class="{ 'is-active': item === dataForm.icon }">
                    <icon-svg :name="item"></icon-svg>
                  </el-button>
                </div>
              </div>
            </el-popover>
            <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import Icon from '@/icons'
  export default {
    data () {
      var validateUrl = (rule, value, callback) => {
        if (this.dataForm.type === 1 && !/\S/.test(value)) {
          callback(new Error('菜单URL不能为空'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        dataForm: {
          id: '',
          type: 1,
          typeList: ['是', '否'],
          resourceName: '',
          parentId: '',
          resourceUrl: '',
          perms: '',
          sortNum: '',
          icon: '',
          iconList: []
        },
        menulist: [],
        dataRule: {
          resourceName: [
            { required: true, message: '菜单名称不能为空', trigger: 'blur' }
          ],
          parentId: [
            { required: true, message: '上级菜单不能为空', trigger: 'change' }
          ],
          resourceUrl: [
            { validator: validateUrl, trigger: 'blur' }
          ]
        },
        menuListTreeProps: {
          label: 'name',
          children: 'children'
        }
      }
    },
    created () {
      this.iconList = Icon.getNameList()
    },
    methods: {
      init (id) {
        this.dataForm.id = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.$http({
          url: this.$http.adornUrl('/m/getResourceUp'),
          method: 'get'
        }).then(({data}) => {
          this.$set(this, 'menulist', data.res.data)
        })

        if (id) {
          this.$http({
            url: this.$http.adornUrl('/m/resource/' + id),
            method: 'get'
          }).then(res => {
            this.$set(this, 'dataForm', res.data.res.data)
          })
        }
      },
      // 菜单树选中
      menuListTreeCurrentChangeHandle (data, node) {
        this.dataForm.parentId = data.res.data.id
        this.dataForm.resourceName = data.res.data.resourceName
      },
      // 菜单树设置当前选中节点
      menuListTreeSetCurrentNode () {
        this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
        this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['resourceName']
      },
      // 图标选中
      iconActiveHandle (iconName) {
        this.dataForm.icon = iconName
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: this.$http.adornUrl(`/m/resource${this.dataForm.id ? '/' + this.dataForm.id : ''}`),
              method: this.dataForm.id ? 'put' : 'post',
              data: JSON.stringify(this.dataForm)
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

<style lang="scss">
  .mod-menu {
    .menu-list__input,
    .icon-list__input {
       > .el-input__inner {
        cursor: pointer;
      }
    }
    &__icon-popover {
      width: 458px;
      overflow: hidden;
    }
    &__icon-inner {
      width: 478px;
      max-height: 258px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    &__icon-list {
      width: 458px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 8px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 18px;
          height: 18px;
          font-size: 18px;
        }
      }
    }
    .icon-list__tips {
      font-size: 18px;
      text-align: center;
      color: #e6a23c;
      cursor: pointer;
    }
  }
</style>
