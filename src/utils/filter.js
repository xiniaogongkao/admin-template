import Vue from 'vue'
import moment from 'moment'

// 数字筛选
Vue.filter('NumberFormat', function(value) {
  if (!value) {
    return '0'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
  return intPartFormat
})

// 时间筛选
Vue.filter('moment', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(dataStr).format(pattern)
})

// 时间筛选2
Vue.filter('moment2', function(dataStr2, pattern = 'MM/DD HH:mm') {
  return moment(dataStr2).format(pattern)
})

// 内容筛选
Vue.filter('contentFilter', function(dataStr) {
  if (dataStr === '' || dataStr === null || typeof dataStr === 'undefined') {
    return '-'
  } else {
    return dataStr
  }
})

// 百分比筛选
Vue.filter('percentFilter', function(dataStr) {
  if (dataStr && !isNaN(Number(dataStr))) {
    return (dataStr * 100).toFixed(2) + '%'
  } else {
    return dataStr === 0 ? '0.00%' : '-'
  }
})

// 大数字处理
Vue.filter('bigNumber', function(value, fix = 1) {
  let num = value
    let result = value
    if (typeof num === 'string') {
      num = Number(num)
    }
    if (typeof num !== 'number' || !isFinite(num)) {
      return value
    }
    const w = 10000
    const numP = Math.abs(num)
    if (numP < w) {
      result = num + ''
    } else {
      result = (num / w).toFixed(fix) + 'W'
    }
    return result
})
