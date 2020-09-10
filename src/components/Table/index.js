import T from 'ant-design-vue/es/table/Table'
import { get, template, cloneDeep } from 'lodash'

export default {
  data() {
    return {
      needTotalList: [],

      selectedRows: [],
      selectedRowKeys: [],

      localLoading: false,
      localDataSource: [],
      localPagination: Object.assign({}, this.pagination),
      tableWrapperKey: 0,
      // 当前列筛选 选中
      selectedKeys: [],
      // 克隆列数据（作为列筛选使用）
      cloneColumns: [],
      // 下拉管理列操作是否显示
      filterDropdownVisible: false
    }
  },
  props: Object.assign({}, T.props, {
    rowKey: {
      type: [String, Function],
      default: 'key'
    },
    data: {
      type: Function,
      required: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    },
    /**
     * alert: {
     *   show: true,
     *   clear: Function
     * }
     */
    alert: {
      type: [Object, Boolean],
      default: null
    },
    rowSelection: {
      type: Object,
      default: null
    },
    /** @Deprecated */
    showAlertInfo: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: String | Boolean,
      default: 'auto'
    },
    /**
     * enable page URI mode
     *
     * e.g:
     * /users/1
     * /users/2
     * /users/3?queryParam=test
     * ...
     */
    pageURI: {
      type: Boolean,
      default: false
    },
    tableComHeight: {
      type: String,
      default: '416px'
    }
  }),
  watch: {
    'localPagination.current'(val) {
      this.pageURI && this.$router.push({
        ...this.$route,
        name: this.$route.name,
        params: Object.assign({}, this.$route.params, {
          pageNo: val
        })
      })
      // change pagination, reset total data
      this.needTotalList = this.initTotalList(this.columns)
      this.selectedRowKeys = []
      this.selectedRows = []
    },
    pageNum(val) {
      Object.assign(this.localPagination, {
        current: val
      })
    },
    pageSize(val) {
      Object.assign(this.localPagination, {
        pageSize: val
      })
    },
    showSizeChanger(val) {
      Object.assign(this.localPagination, {
        showSizeChanger: val
      })
    }
  },
  created() {
    const { pageNo } = this.$route.params
    const localPageNum = this.pageURI && (pageNo && parseInt(pageNo)) || this.pageNum
    this.localPagination = ['auto', true].includes(this.showPagination) && Object.assign({}, this.localPagination, {
      current: localPageNum,
      pageSize: this.pageSize,
      showSizeChanger: this.showSizeChanger
    }) || false
    this.needTotalList = this.initTotalList(this.columns)
    // 初始化选中所有列
    this.cloneColumns = cloneDeep(this.columns)
    this.selectedKeys = this.columns.filter(item => !item.filterColumns).map(item => item.dataIndex)
    this.loadData()
  },
  computed: {
    roles() {
      return this.$store.getters.roles
    },
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh(bool = false) {
      bool && (this.localPagination = Object.assign({}, {
        current: 1, pageSize: this.pageSize
      }))
      this.loadData()
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData(pagination, filters, sorter) {
      this.localLoading = true
      const parameter = Object.assign({
        page: (pagination && pagination.current) ||
          this.showPagination && this.localPagination.current || this.pageNum,
        pageSize: (pagination && pagination.pageSize) ||
          this.showPagination && this.localPagination.pageSize || this.pageSize
      },
      (sorter && sorter.field && {
        sortField: sorter.field
      }) || {},
      (sorter && sorter.order && {
        sortOrder: sorter.order
      }) || {}, {
        ...filters
      }
      )
      const result = this.data(parameter)
      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
      // eslint-disable-next-line
      if ((typeof result === 'object' || typeof result === 'function') && typeof result.then === 'function') {
        result.then(r => {
          this.localPagination = this.showPagination && Object.assign({}, this.localPagination, {
            current: r.pageNo, // 返回结果中的当前分页数
            total: r.totalCount, // 返回结果中的总记录数
            showSizeChanger: this.showSizeChanger,
            pageSize: (pagination && pagination.pageSize) ||
              this.localPagination.pageSize
          }) || false
          // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
          if (r.data.length === 0 && this.showPagination && this.localPagination.current > 1) {
            this.localPagination.current--
            this.loadData()
            return
          }

          // 这里用于判断接口是否有返回 r.totalCount 且 this.showPagination = true 且 pageNo 和 pageSize 存在 且 totalCount 小于等于 pageNo * pageSize 的大小
          // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
          try {
            if ((['auto', true].includes(this.showPagination) && r.totalCount <= (r.pageNo * this.localPagination.pageSize))) {
              this.localPagination.hideOnSinglePage = true
            }
          } catch (e) {
            this.localPagination = false
          }
          this.localDataSource = r.data // 返回结果中的数组数据
          this.localLoading = false
        })
      }
    },
    initTotalList(columns) {
      const totalList = []
      columns && columns instanceof Array && columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({
            ...column,
            total: 0
          })
        }
      })
      return totalList
    },
    /**
     * 用于更新已选中的列表数据 total 统计
     * @param selectedRowKeys
     * @param selectedRows
     */
    updateSelect(selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows
      this.selectedRowKeys = selectedRowKeys
      const list = this.needTotalList
      this.needTotalList = list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            const total = sum + parseInt(get(val, item.dataIndex))
            return isNaN(total) ? 0 : total
          }, 0)
        }
      })
    },
    /**
     * 清空 table 已选中项
     */
    clearSelected() {
      if (this.rowSelection) {
        this.rowSelection.onChange([], [])
        this.updateSelect([], [])
      }
    },
    /**
     * 处理交给 table 使用者去处理 clear 事件时，内部选中统计同时调用
     * @param callback
     * @returns {*}
     */
    renderClear(callback) {
      if (this.selectedRowKeys.length <= 0) return null
      return (
        <a style="margin-left: 24px" onClick={() => {
          callback()
          this.clearSelected()
        }}>清空</a>
      )
    },
    /**
     * 判断按钮组是否显示
     * @param {String} 按钮类型
     * @return 按钮display
     */
    isBtnShow(item) {
      if (item.showTime === 'single') {
        if (this.selectedRows.length > 0 && this.selectedRows.length < 2) {
          // 判断是否地市级是否有权限
          if (this.userInfo.schoolLevel === 1 && item.areaAuth) {
            return this.selectedRows[0].createBy === this.userInfo.id ? 'inline-block' : 'none'
          } else {
            return 'inline-block'
          }
        } else {
          return 'none'
        }
      } else if (item.showTime === 'multiple') {
        if (this.selectedRows.length > 0) {
          // 判断地市级是否有权限
          if (this.userInfo.schoolLevel === 1 && item.areaAuth) {
            const isShow = this.selectedRows.every(row => row.createBy === this.userInfo.id)
            return isShow ? 'inline-block' : 'none'
          } else {
            return 'inline-block'
          }
        } else {
          return 'none'
        }
      } else {
        return 'inline-block'
      }
    },
    /**
     * @description: 判断行为是否有权限
     * @param {Obenjct} action
     * @return: true or false
     */
    hasActionPermission(action) {
      const permissions = this.roles.permissions || []
      return permissions.some(p => {
        return p.actionList && p.actionList.includes(action)
      })
    },
    renderAlert() {
      // 绘制按钮组
      // 筛选去除无权限按钮
      // const btnList = (this.alert.btnList || []).filter(btn => this.hasActionPermission(btn.action))
      const defaultList = this.alert.defaultList || []
      const title = this.alert.title ? this.alert.title : '内容'
      const hasSelect = !!this.selectedRows.length
      return (
        <div class='table-header-alert'>
          <span>
            {hasSelect ? '已选' : '共'}<a class="alert-number">{hasSelect ? this.selectedRows.length : this.localPagination.total }</a>条{title}
            {this.renderCheckedList()}
          </span>
          <span>{ defaultList && defaultList[0] ? defaultList.map(item => (<a-button style={{
            'margin-left': '12px'
          }} type={item.type} icon={item.icon} onClick={() => { this.$emit('btnAction', item.action) } }>{item.label}</a-button>)) : null }</span>
        </div>
      )
    },
    /**
     * @description: 选择表格列之后显示的按钮
     */
    renderCheckedList() {
      const checkedList = this.alert.checkedList || []
      if (this.selectedRows.length) {
        return (
          <span>{ checkedList && checkedList[0] ? checkedList.map(item => (<a-button style={{
            'margin-left': '12px'
          }} type={item.type} icon={item.icon} shape='round' onClick={() => { this.$emit('btnAction', item.action) } }>{item.label}</a-button>)) : null }</span>
        )
      } else {
        return (null)
      }
    },
    /**
     * @description: 绘制列筛选下拉模板
     */
    renderColumnFilter() {
      // 不能直接在模板里写v-clickOutSide,只能这么写
      const directives = [{ name: 'clickOutSide', value: this.hideDropdownVisible, expression: this.hideDropdownVisible }]
      const filterColumns = this.columns.filter(item => !item.filterColumns)
      return (
        <div>
          <a-menu
            {...{ directives }}
            multiple={true}
            onSelect={this.setSelectedKeys}
            onDeselect={this.setSelectedKeys}
            selectedKeys={this.selectedKeys}
          >
            {filterColumns.map(item => (this.renderMenuItem(item)))}
          </a-menu>
          <div class="column-footer">
            <a onClick={this.columnFilterConfirm}>
              确定
            </a>
            <a onClick={this.columnFilterClear}>
              重置
            </a>
          </div>
        </div>
      )
    },
    /**
     * @description: 筛选的每一项
     * @param {Object} item column的每一项
     */
    renderMenuItem(item) {
      const input = (
        <a-checkbox checked={this.selectedKeys && this.selectedKeys.indexOf(item.dataIndex.toString()) >= 0} />
      )
      return (
        <a-menu-item class="column-menu-item" key={item.dataIndex}>
          {input}
          <span>{item.title}</span>
        </a-menu-item>
      )
    },
    // 设置选择
    setSelectedKeys({ selectedKeys }) {
      this.selectedKeys = selectedKeys
    },
    // 确认筛选列
    columnFilterConfirm() {
      if (this.selectedKeys.length < 2) {
        this.$message.warning('至少选择两项')
        return false
      }
      this.cloneColumns = []
      this.columns.forEach(item => {
        // 已选或者是设置了filterColumns的列
        if (this.selectedKeys.includes(item.dataIndex) || item.filterColumns) {
          this.cloneColumns.push(item)
        }
      })
      this.filterDropdownVisible = false
      this.tableWrapperKey++
    },
    // 重置为所有列
    columnFilterClear() {
      this.cloneColumns = []
      this.columns.forEach(item => {
        this.cloneColumns.push(item)
      })
      this.selectedKeys = this.columns.filter(item => !item.filterColumns).map(item => item.dataIndex)
      this.filterDropdownVisible = false
      this.tableWrapperKey++
    },
    // 打开筛选
    showDropdownVisible(e) {
      e.stopPropagation()
      this.filterDropdownVisible = true
    },
    // 关闭删选
    hideDropdownVisible() {
      this.filterDropdownVisible = false
    }
  },

  render() {
    const props = {}
    const localKeys = Object.keys(this.$data)
    const showAlert = (typeof this.alert === 'object' && this.alert !== null && this.alert.show) && typeof this.rowSelection.selectedRowKeys !== 'undefined' || this.alert

    Object.keys(T.props).forEach(k => {
      const localKey = `local${k.substring(0, 1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        props[k] = this[localKey]
        return props[k]
      }
      if (k === 'rowSelection') {
        if (showAlert && this.rowSelection) {
          // 如果需要使用alert，则重新绑定 rowSelection 事件
          props[k] = {
            ...this.rowSelection,
            locale: { emptyText: '暂无数据' },
            selectedRows: this.selectedRows,
            selectedRowKeys: this.selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              this.updateSelect(selectedRowKeys, selectedRows)
              typeof this[k].onChange !== 'undefined' && this[k].onChange(selectedRowKeys, selectedRows)
            }
          }
          return props[k]
        } else if (!this.rowSelection) {
          // 如果没打算开启 rowSelection 则清空默认的选择项
          props[k] = null
          return props[k]
        }
      }
      // columns特殊处理，采用cloneColumns的数据
      if (k === 'columns') {
        this[k] && (props[k] = this.cloneColumns)
      } else {
        this[k] && (props[k] = this[k])
      }
      return props[k]
    })
    // 表格默认值
    props.transformCellText = ({ text }) => {
      return text || text === 0 ? text : '-'
    }
    props.scroll = { y: `calc(100vh - ${this.tableComHeight})` }
    const lastColumn = this.cloneColumns[this.cloneColumns.length - 1]
    // 如果设置了筛选列
    if (lastColumn.filterColumns) {
      lastColumn.filterMultiple = true
      lastColumn.filterIcon = (<div class="column-filter-btn" onClick={this.showDropdownVisible}><a-icon type="control" class="column-filter-icon"/></div>)
      lastColumn.filterDropdown = this.renderColumnFilter()
      lastColumn.filterDropdownVisible = this.filterDropdownVisible
    }
    const table = (
      <a-table {...{ props, scopedSlots: { ...this.$scopedSlots } }} onChange={this.loadData} onExpand={ (expanded, record) => { this.$emit('expand', expanded, record) } }>
        { Object.keys(this.$slots).map(name => (<template slot={name}>{this.$slots[name]}</template>)) }
      </a-table>
    )

    return (
      <div class="table-wrapper" key={this.tableWrapperKey}>
        { showAlert ? this.renderAlert() : null }
        { table }
      </div>
    )
  }
}
