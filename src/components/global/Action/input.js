/*
 * @Author: 陈杰超
 * @Date: 2020-09-03 11:13:27
 * @LastEditTime: 2020-09-08 16:57:27
 * @LastEditors: 陈杰超
 * @Description: input组件
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
  methods: {
    textareaRender(props) {
      return (
        <a-textarea v-model={this.searchInfo[this.action.key]} rows={props.rows ? props.rows : 2} { ...{ props } }/>
      )
    },
    passwordRender(props) {
      return (
        <a-input-password v-model={this.searchInfo[this.action.key]} { ...{ props } }/>
      )
    },
    defaultRender(props) {
      return (
        <a-input v-model={this.searchInfo[this.action.key]} { ...{ props } }/>
      )
    }
  },
  render() {
    const props = Object.assign({}, this.action.props)
    const subType = this.action.subType
    props.allowClear = props.hasOwnProperty('allowClear') ? props.allowClear : true
    const renderFuc = subType ? `${subType}Render` : 'defaultRender'
    return this[renderFuc](props)
  }
}
