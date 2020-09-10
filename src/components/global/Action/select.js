/*
 * @Author: 陈杰超
 * @Date: 2020-09-03 11:13:27
 * @LastEditTime: 2020-09-03 17:52:38
 * @LastEditors: 陈杰超
 * @Description: select组件
 */

import globalApiList from '@/api/apiList'
export default {
  props: {
    searchInfo: {
      type: Object,
      default() {
          return {}
      }
    },
    action: {
      type: Object,
      default() {
          return {}
      }
    }
  },
  data() {
    return {
      // api列表
      apiList: globalApiList,
      // 选项列表
      optionList: []
    }
  },
  computed: {
    dicObj() {
      return this.$store.getters.dicObj || {}
    }
  },
  created() {
    // 如果从api请求取列表
    if (this.action.apiOption) {
      this.apiList[this.action.apiOption]().then(res => {
        if (res.success) {
            this.optionList = res.data || []
        } else {
          this.optionList = []
        }
      })
    }
    // 如果从字典取列表
    // 如果为联动字典
    if (this.action.dicOption && typeof this.action.dicOption === 'function') {
      this.$nextTick(() => {
        const key = this.action.dicOption(this.searchInfo)
        this.optionList = this.dicObj[key]
      })
    } else if (this.action.dicOption) {
      this.$nextTick(() => {
        this.optionList = this.dicObj[this.action.dicOption]
      })
    }
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  },
  render() {
    const props = Object.assign({}, this.action.props)
    props.filterOption = this.filterOption
    props.showSearch = props.showSearch ? props.showSearch : true
    props.placeholder = props.placeholder ? props.placeholder : '请选择'
    const replaceFields = this.action.replaceFields ? this.action.replaceFields : { label: 'label', value: 'value' }
    return (
      <a-select v-model={this.searchInfo[this.action.key]} { ...{ props } }>
        { this.optionList[0] ? this.optionList.map(item => {
          return (
            <a-select-option
              key={item[replaceFields.value]}
              value={item[replaceFields.value]}>
              {item[replaceFields.label]}
            </a-select-option>
          )
        }) : [] }
      </a-select>
    )
  }
}
