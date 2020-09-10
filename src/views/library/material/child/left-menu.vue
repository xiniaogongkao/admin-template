<template>
  <div class="left-menu-card">
    <div class="left-header">
      <div>{{ activeKey === 0 ? '分类标签' : '分校名称' }}</div>
      <a-button
        v-if="activeKey === 0"
        size="small"
        type="link"
        @click="addTag('add')"
        style="padding:0"
        icon="plus">创建标签</a-button>
    </div>
    <a-menu class="page-left-menu" mode="inline" @select="onSelectLabel" v-model="selectedKeys">
      <template v-for="tag in tagList">
        <a-menu-item :key="tag.id">
          <span>{{ tag.name }}</span>
          <a-dropdown v-if="activeKey === 0 && tag.id" :trigger="['click']">
            <span class="ant-dropdown-link" @click="e => e.stopPropagation()">
              <a-icon type="ellipsis" />
            </span>
            <a-menu slot="overlay">
              <a-menu-item>
                <a v-action:editLabel href="javascript:;" @click="addTag('edit', tag)">编辑</a>
              </a-menu-item>
              <a-menu-item>
                <a v-action:deleteLabel href="javascript:;" @click="deleteTag(tag)">删除</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </a-menu-item>
      </template>
    </a-menu>
  </div>
</template>

<script>
import { getLabel } from '@/api/modules/library.js'
export default {
  props: {
    activeKey: {
      type: String,
      default: '0'
    },
    searchInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // 标签列表
      tagList: [],
      // 默认选择标签
      selectedKeys: []
    }
  },
  watch: {
    activeKey: {
      handler(val) {
        this.getTagList()
      },
      immediate: true
    }
  },
  methods: {
    /**
     * @description: 获取标签
     * @param {String} 刚新建的标签id
     */
    getTagList(id) {
      const apiKey = this.activeKey === '0' ? 'labelApi' : 'schoolLabel'
      getLabel().then(res => {
        if (res.success) {
          if (this.activeKey === '0' && apiKey === 'labelApi') {
            this.tagList = [{ id: '', name: '全部' }].concat(...res.data)
          } else if (this.activeKey === 1 && apiKey === 'schoolLabel') {
            const tagList = (res.data || []).filter(item => item.id !== this.userInfo.schoolId)
            this.tagList = [{ id: 0, name: '全部' }].concat(tagList)
          } else {
            this.tagList = []
          }
          if (this.tagList.length > 0) {
            if (id) {
              this.searchInfo.labelId = id
            } else {
              this.searchInfo.labelId = this.tagList[0].id
            }
            this.selectedKeys = [this.searchInfo.labelId]
            this.$emit('queryList')
          }
        } else {
          this.tagList = []
        }
      })
    },
    /**
     * @description: 选择标签
     * @param {Array} 选择标签id数组
     */
    onSelectLabel(e) {
      this.searchInfo.labelId = e.key
      this.$emit('queryList')
    },
    /**
     * @description: 添加标签/编辑标签
     * @param {String} type 操作类型
     * @param {Object} data 初始化数据
     */
    addTag(type, data) {
      this.$refs.addTag.show(type, data)
    },
    /**
     * @description: 删除标签
     * @param {Object} 标签数据
     */
    deleteTag(data) {
      const _this = this
      this.$confirm({
        title: '提示',
        content: `此操作将删除${data.name}标签，相关内容的关联关系也将解除，是否继续？`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
          _this.$ajax.delete('labelApi', { ids: data.id }).then(res => {
            if (res.success) {
              _this.$message.success('删除成功')
              _this.getTagList()
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
.left-menu-card{
  .page-common-card(@heigt: 191px);
  background: #fff;
  .left-header{
    height: 48px;
    padding: @pd-md;
    font-size: @fs-lg;
    text-align: center;
    line-height: 48px;
    // background-color: #e6f7ff;
    border-bottom: 1px solid #e8e8e8;
    .layoutFlex(space-between);
  }
}
</style>
