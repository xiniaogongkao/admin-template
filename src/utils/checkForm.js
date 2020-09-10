/*
 * @Author: 陈杰超
 * @Date: 2020-06-18 15:03:12
 * @LastEditTime: 2020-08-05 10:43:18
 * @LastEditors: 陈杰超
 * @Description: 常用表单字段校验文件，与表单设计器配合使用
 */
const checkForm = {
  // 公用的select方法
  commonSelect: function({ label, required = true }) {
    return [{ required: required, message: `请选择${label}`, trigger: 'change' }]
  },
  // 公用的input方法
  commonInput: function({ label, min = 2, max = 15, required = true }) {
    return [
      { required: required, message: `请输入${label}`, trigger: 'blur' },
      { min: min, max: max, message: `请输入长度为${min}-${max}的${label}`, trigger: 'blur' }
    ]
  },
  mobile: [
    { required: true, message: '请输入手机号' },
    { pattern: /^1[345789]\d{9}$/, message: '手机号格式错误' }
  ],
  phone: [
    { required: true, message: '请输入电话号码' },
    { pattern: /^([0-9]{3,4}(-)?)?([0-9]{3,4}(-)?)?[0-9]{4,5}$/, message: '电话号码格式错误' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    // { min: 8, max: 20, message: '请输入长度为8-20的密码', trigger: 'blur' },
    // { pattern: /^[0-9A-Za-z]{8,20}$/, message: '只能包含数字、字母', trigger: 'blur' }
    { pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/, message: '密码必须为8-20位字母、数字组合', trigger: 'blur' }
  ],
  email: [
    { required: false, message: '请输入邮箱' },
    { pattern: /^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])*@([a-zA-Z0-9]+[-a-zA-Z0-9]*[a-zA-Z0-9]+.){1,63}[a-zA-Z0-9]+$/, message: '邮箱格式错误' }
  ],
  domain: [
    { required: true, message: '请输入域名' },
    { pattern: /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/, message: '域名格式不正确' }
  ],
  // 校验为正整数
  integer: [
    { required: true, message: '请输入整数' },
    { pattern: /^\d+$/, message: '请输入非负整数' }
  ],
  // 校验价格
  price: [
    { required: true, message: '请输入价格' },
    { pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/, message: '请输入正确的价格，最多保留两位小数' }
  ],
  // 校验富文本
  editor: [
    { required: true, message: '请输入富文本' }
  ]
}
export default checkForm
