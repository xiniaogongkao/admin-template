<!--
 * @Author: 陈杰超
 * @Date: 2020-09-07 16:44:58
 * @LastEditTime: 2020-09-07 17:36:36
 * @LastEditors: 陈杰超
 * @Description: 素材资料库的列表组件
-->
<template>
  <div class="library-material-list">
    <div class="material-wrapper">
      <a-radio-group v-model="searchInfo.vodtypeId" button-style="solid" @change="vodTypeChange">
        <a-radio-button v-for="item in publicResourceType" :key="item.value" :value="item.value">
          {{ item.label }}
        </a-radio-button>
      </a-radio-group>
      <a-list :grid="{ gutter: 16, xs: 3, xl: 3, xxl: 4 }" :data-source="materialList">
        <a-list-item slot="renderItem" slot-scope="item">
          <div class="material-item">
            <div class="item-left">
              <img v-if="item.vodtypeId === 1" class="item-cover" src="@/assets/image/music.png" alt="">
              <img v-else-if="item.vodtypeId === 3" class="item-cover" src="@/assets/image/word.png" alt="">
              <img v-else-if="item.vodtypeId === 4" class="item-cover" :src="item.uploadfile" alt="">
              <img v-else class="item-cover" :src="`${item.uploadfile}?x-oss-process=video/snapshot,t_5000,m_fast`" alt="">
            </div>
            <div class="item-right">
              <div class="file-name">{{ item.name }}</div>
              <div class="handle-btn">
                <a-button type="link" icon="eye" @click="preview(item)">预览</a-button>
                <a-button type="link" icon="edit" @click="addMaterial('edit', item)">编辑</a-button>
                <a-button type="link" icon="delete" @click="deleteMaterial(item)">删除</a-button>
              </div>
            </div>
          </div>
        </a-list-item>
      </a-list>
      <a-pagination
        v-model="pager.page"
        show-size-changer
        :defaultPageSize="24"
        :pageSizeOptions="['24', '48', '72']"
        :total="total"
        @change="pageChange"
        @showSizeChange="onShowSizeChange"
      />
    </div>
    <!-- 按钮组 -->
    <div class="right-wrapper-btn">
      <a-button v-if="activeKey === 0" type="primary" @click="addMaterial('add')">上传</a-button>
      <!-- <a-button v-if="checkedList && checkedList.length === 1" class="right-btn" type="primary" @click="preview">预览</a-button>
      <a-button v-action:editPublicResource class="right-btn" v-if="activeKey === 0 && checkedList && checkedList.length === 1" type="primary" @click="addMaterial('edit')">编辑</a-button>
      <a-button
        v-action:deletePublicResource
        class="right-btn"
        v-if="activeKey === 0 && checkedList && checkedList.length === 1"
        type="danger"
        @click="deleteMaterial()">删除</a-button> -->
    </div>
    <!-- 添加素材 -->
    <add-material ref="addMaterial" @queryMaterial="getMaterialList" v-on="$listeners"></add-material>
    <!-- 预览文件 -->
    <preview-file ref="previewFile"></preview-file>
  </div>
</template>

<script>
import addMaterial from '../components/addMaterial'
import previewFile from '@/components/global/PreviewFile'
import _ from 'lodash'
import { getPublicResource } from '@/api/modules/library'
export default {
  props: {
    // 多选还是单选
    type: {
      type: String,
      default: 'multiple'
    },
    // 当前激活tab
    activeKey: {
      type: Number,
      default: 0
    },
    // 搜索数据
    searchInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    // 是否是模态框，布局改变
    isModal: {
      type: Boolean,
      default: false
    }
  },
  components: {
    addMaterial,
    previewFile
  },
  data() {
    return {
      // 素材列表
      materialList: [],
      // 分页参数-总数量
      total: 0,
      // 已选素材id数组
      checkedList: [],
      // 已选素材数组
      checkedItem: [],
      // 编辑时暂存已选
      cloneCheckedList: [],
      // 分页数据
      pager: {
        page: 1,
        pageSize: 24
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },
    roles() {
      return this.$store.getters.roles
    },
    publicResourceType() {
      return this.$store.getters.dicObj['publicResourceType']
    },
    /**
     * @description: 判断是否有上传权限
     */
    hasUploadPermission() {
      const permissions = this.roles.permissions || []
      return permissions.some(p => {
        return p.actionList && p.actionList.includes('createPublicResource')
      })
    }
  },
  methods: {
    /**
     * @description: 获取内容库素材列表
     * @param {String} type 操作类型 search/reset
     * @param {String|Object} checked 已选的uploadfile
     */
    getMaterialList(type, checked) {
      if (type === 'reset') {
        this.searchInfo.search = null
        this.searchInfo.vodtypeId = 1
        this.searchInfo.date = []
        this.searchInfo.order = 'datedesc'
      }
      this.materialList = []
      this.checkedList = []
      const searchInfo = _.cloneDeep(this.searchInfo)
      if (searchInfo.date && searchInfo.date[0]) {
        searchInfo.date = searchInfo.date.join(',')
      }
      getPublicResource(Object.assign(searchInfo, { type: this.activeKey }, this.pager)).then(res => {
        if (res.success) {
          this.materialList = res.data.data || []
          this.total = res.data.totalCount || 0
        } else {
          this.materialList = []
        }
      })
    },
    vodTypeChange() {
      this.getMaterialList()
    },
    /**
     * @description: 添加素材
     * @param {String} type 操作类型 add/edit
     * @param {Obejct} data 编辑数据
      */
    addMaterial(type, data) {
      if (type === 'add' && this.searchInfo.labelId) {
        data = { vodtypeflagsId: this.searchInfo.labelId }
      }
      this.$refs.addMaterial.show(type, _.cloneDeep(data))
    },
    /**
     * @description: 预览素材
     */
    preview(data) {
      if (data.vodtypeId === 3) {
        window.open(data.uploadfile)
      } else {
        this.$refs.previewFile.show(data.vodtypeId, data.uploadfile)
      }
    },
    /**
     * @description: 页码改变
     * @param {Number} page 页码
     * @param {Number} pageSize 每页数量
     */
    pageChange(page, pageSize) {
      this.pager.page = page
      this.pager.pageSize = pageSize
      this.getMaterialList()
    },
    /**
     * @description: 每页数量改变
     * @param {Number} current 页码
     * @param {Number} pageSize 每页数量
     */
    onShowSizeChange(current, pageSize) {
      this.pager.page = 1
      this.pager.pageSize = pageSize
      this.getMaterialList()
    },
    /**
     * @description: 删除内容库文件
     */
    deleteMaterial(data) {
      const _this = this
      this.$confirm({
        title: '提示',
        content: `此操作将永久删除，是否继续？`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          _this.$ajax.delete('publicResourceApi', { ids: data }).then(res => {
            if (res.success) {
              _this.$message.success('删除成功')
              _this.getMaterialList()
            } else {
              _this.$message.error(res.message || '删除失败')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.library-material-list{
  position: relative;
  /deep/ .material-wrapper{
    padding: @pd-lg;
    .ant-radio-group{
      margin-bottom: 24px;
    }
    .ant-pagination{
      text-align: center;
    }
    .ant-checkbox-group{
      width: 100%;
    }
  }
  .right-wrapper-btn{
    position: absolute;
    right: 24px;
    top: 24px;
    .right-btn{
      margin-left: @pd-sm;
    }
  }
  .material-item{
    // text-align: center;
    display: flex;
    padding: 8px;
    &:hover{
      background-color: @hover-color;
      .item-right{
        .handle-btn{
          display: inline-block;
        }
      }
    }
    .item-left{
      .item-cover{
        width: 80px;
        height: 80px;
        object-fit: scale-down;
      }
    }
    .item-right{
      flex: 1;
      padding: 0 8px;
      position: relative;
      .handle-btn{
        display: none;
        position: absolute;
        bottom: 0;
        /deep/ .ant-btn-link{
          padding: 0;
          padding-right: 12px;
          span{
            margin-left: 0;
          }
        }
      }
    }
  }
}
</style>
