<template>
  <div class="library-material-page">
    <page-header-wrapper :breadcrumb="false" :tabList="panes" :tab-active-key="curTab" :tab-change="tabChange">
      <a-row :gutter="8">
        <!-- 左侧标签 -->
        <a-col :span="5">
          <leftMenu :activeKey="curTab" :searchInfo="searchInfo" @queryList="queryList"></leftMenu>
        </a-col>
        <!-- 右侧列表 -->
        <a-col :span="19">
          <!-- 顶部筛选 -->
          <a-card class="header-card" :bordered="false">
            <header-filter :listSearch="listSearch" :searchInfo="searchInfo" @triggerSearch="queryList">
            </header-filter>
          </a-card>
          <a-card :bordered="false" class="material-card">
            <material-list
              ref="materialList"
              :activeKey.sync="activeKey"
              type="single"
              :searchInfo="searchInfo"
              @getTagList="getTagList"
              @tabChange="tabChange"></material-list>
          </a-card>
        </a-col>
      </a-row>
    </page-header-wrapper>
  </div>
</template>

<script>
import HeaderFilter from '@/components/global/HeaderFilter'
import leftMenu from './child/left-menu'
import materialList from './child/material-list'
export default {
  components: {
    HeaderFilter,
    leftMenu,
    materialList
  },
  data() {
    return {
      // 筛选表单对象
      searchInfo: {
        search: '',
        labelId: '',
        vodtypeId: 1,
        order: 'datedesc'
      },
      // 顶部筛选数据
      listSearch: [
        {
          type: 'input',
          label: '文件名称',
          key: 'search',
          props: {
            placeholder: '请输入文件名'
          }
        },
        // {
        //   type: 'select',
        //   label: '文件类型',
        //   key: 'vodtypeId',
        //   notClear: true,
        //   dicOption: 'publicResourceType'
        // },
        {
          type: 'date',
          label: '更新日期',
          key: 'date',
          subType: 'dateRange'
        },
        {
          type: 'select',
          label: '选择排序',
          key: 'order',
          dicOption: 'publicResourceOrder'
        }
      ],
      curTab: '0'
    }
  },
  computed: {
    // tab配置文件
    panes() {
      return [
        {
          tab: '湖南分校',
          key: '0'
        },
        {
          tab: '公共库',
          key: '1'
        }
      ]
    }
  },
  methods: {
    tabChange(val) {
      this.curTab = val
    },
    /**
     * @description: 查询列表数据
     * @param {String} 查询/重置
     */
    queryList(type) {
      if (this.$refs.materialList) this.$refs.materialList.getMaterialList(type)
    }
  }
}
</script>

<style lang="less" scoped>
.library-material-page{
  .material-card{
    .page-common-card(@heigt: 336px)
  }
  .material-card::-webkit-scrollbar {
    width: .4rem;
  }
  /deep/ .ant-card-body{
    padding: 0;
  }
  .header-card{
    padding: @pd-lg @pd-lg 0;
    margin-bottom: @pd-xs;
  }
}
</style>
