<template>
  <div class="library-material-page">
    <page-header-wrapper :breadcrumb="false" :tabList="panes" :tab-active-key="curTab" :tab-change="tabChange">
      <a-row :gutter="8">
        <!-- 左侧标签 -->
        <a-col v-if="curTab === '1'" :span="5">
          <leftMenu :activeKey="curTab" :searchInfo="searchInfo" @queryList="queryList"></leftMenu>
        </a-col>
        <!-- 右侧列表 -->
        <a-col :span="curTab === '0' ? 24 : 19">
          <!-- 顶部筛选 -->
          <a-card class="header-card" :bordered="false">
            <header-filter :listSearch="listSearch" :searchInfo="searchInfo" @triggerSearch="queryList">
            </header-filter>
          </a-card>
          <a-card :bordered="false" class="material-card">
            <s-table
              ref="table"
              size="default"
              rowKey="id"
              tableComHeight="482px"
              :columns="columns"
              :data="loadData"
              :alert="alertConfig"
              :rowSelection="rowSelection"
              showPagination="auto"
            >
              <span slot="handle" slot-scope="text, record">
                <a-button type="link" icon="edit" :disabled="record.status === 1" @click="addLive('edit', record)"/>
                <a-button type="link" icon="delete" :disabled="record.status === 1" @click="deleteLive(record)"/>
              </span>
              <span slot="status" slot-scope="text">
                <a-badge :status="text | liveStatusTypeFilter" :text="text | liveStatusFilter" />
              </span>
              <span slot="liveroomName" slot-scope="text, record">
                {{ `${record.liveroomName}(${record.liveroomId})` }}
              </span>
            </s-table>
          </a-card>
        </a-col>
      </a-row>
    </page-header-wrapper>
  </div>
</template>

<script>
import HeaderFilter from '@/components/global/HeaderFilter'
import leftMenu from '../material/child/left-menu'
import STable from '@/components/Table'
import _ from 'lodash'
import { getPublicLive } from '@/api/modules/library'
const statusMap = {
  0: {
    status: 'success',
    text: '未开始'
  },
  1: {
    status: 'processing',
    text: '直播中'
  },
  2: {
    status: 'default',
    text: '已结束'
  }
}
// 表格列数据配置
const columns = [
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '直播间',
    dataIndex: 'liveroomName',
    scopedSlots: { customRender: 'liveroomName' }
  },
  {
    title: '类型',
    dataIndex: 'livestatusName'
  },
  {
    title: '开始时间',
    dataIndex: 'starttime'
  },
  {
    title: '结束时间',
    dataIndex: 'endtime'
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' }
  },
  {
    title: '操作',
    dataIndex: 'handle',
    filterColumns: true,
    scopedSlots: { customRender: 'handle' }
  }
]
// 表格顶部操作项配置
const alertConfig = {
  title: '直播信息',
  defaultList: [
    {
      label: '新增课件',
      type: 'primary',
      icon: 'plus',
      action: 'createCourseWare'
    }
  ],
  checkedList: [
    {
      label: '启用',
      type: 'success',
      icon: 'unlock',
      action: 'deleteCourseWare'
    },
    {
      label: '禁用',
      type: 'warning',
      icon: 'stop',
      action: 'deleteCourseWare'
    },
    {
      label: '删除',
      type: 'error',
      icon: 'delete',
      action: 'deleteCourseWare'
    }
  ]
}
export default {
  components: {
    HeaderFilter,
    leftMenu,
    STable
  },
  data() {
    this.columns = columns
    this.alertConfig = alertConfig
    return {
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        if (this.$refs.table && this.$refs.table[this.curTab]) {
          this.$refs.table[this.curTab].clearSelected()
        }
        const searchInfo = _.cloneDeep(this.searchInfo)
        if (searchInfo.date && searchInfo.date[0]) {
          searchInfo.date = searchInfo.date.join(',')
        }
        const requestParameters = Object.assign({}, parameter, searchInfo, { type: this.curTab })
        return getPublicLive(requestParameters)
          .then(res => {
            return res.data
          })
      },
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
      curTab: '0',
      // 已选行数据的key
      selectedRowKeys: []
    }
  },
  filters: {
    liveStatusFilter(type) {
      return statusMap[type].text
    },
    liveStatusTypeFilter(type) {
      return statusMap[type].status
    }
  },
  computed: {
    rowSelection() {
      return {
        type: 'checkbox',
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    },
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
    },
    /**
     * @description: 选择直播
     */
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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
