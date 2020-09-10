/*
 * @Author: 陈杰超
 * @Date: 2020-09-03 11:13:27
 * @LastEditTime: 2020-09-03 16:58:00
 * @LastEditors: 陈杰超
 * @Description: 时间选择组件
 */

import moment from 'moment'
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
  render() {
    const props = Object.assign({}, this.action.props)
    const subType = this.action.subType
    if (!props.format) {
      props.format = ['dateTime', 'dateTimeRange'].includes(subType) ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
    }
    if (subType === 'dateTime') {
      props.showTime = {
        hideDisabledOptions: true,
        defaultValue: moment('00:00:00', 'HH:mm:ss')
      }
    } else if (subType === 'dateTimeRange') {
      props.showTime = {
        hideDisabledOptions: true,
        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')]
      }
    }
    if (['dateRange', 'dateTimeRange'].includes(subType)) {
      return (
        <a-range-picker v-model={this.searchInfo[this.action.key]} { ...{ props } }
        />
      )
    } else {
      return (
        <a-date-picker v-model={this.searchInfo[this.action.key]} { ...{ props } }
        />
      )
    }
  }
}
