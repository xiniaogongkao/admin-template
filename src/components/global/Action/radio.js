/*
 * @Author: 陈杰超
 * @Date: 2020-09-03 11:13:27
 * @LastEditTime: 2020-09-03 16:57:52
 * @LastEditors: 陈杰超
 * @Description: radio组件
 */

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
      optionList: []
    }
  },
  computed: {
    dicObj() {
      return this.$store.getters.dicObj
    }
  },
  mounted() {
    // 如果从字典取列表
    if (this.action.dicOption) {
      this.$nextTick(() => {
        this.optionList = this.dicObj[this.action.dicOption]
      })
    }
  },
  render() {
    const props = Object.assign({}, this.action.props)
    return (
      <a-radio-group v-model={this.searchInfo[this.action.key]} options={this.optionList} { ...{ props } }/>
    )
  }
}
