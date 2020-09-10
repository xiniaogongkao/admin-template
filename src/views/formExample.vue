<!--
 * @Author: 陈杰超
 * @Date: 2020-09-03 11:13:27
 * @LastEditTime: 2020-09-07 09:06:46
 * @LastEditors: 陈杰超
 * @Description: 表单设计器示例页面
-->
<template>
  <div class="form-example">
    <!-- 编辑信息 -->
    <formMaking ref="formMaking" :formConfig="formConfig"></formMaking>
    <a-button @click="submitForm">提交</a-button>
  </div>
</template>

<script>
import formMaking from '@/components/global/FormMaking/index.vue'
export default {
  name: 'FormExample',
  components: {
    formMaking
  },
  data() {
    return {
      value: 3,
      // formMaking表单配置文件
      formConfig: {
        // 初始化表单配置
        initForm: {},
        labelCol: 6,
        wrapperCol: 16,
        width: '450px',
        formList: [
          {
            type: 'input',
            label: '账号',
            key: 'title',
            rule: 'commonInput',
            props: {
              placeholder: '请输入账号'
            }
          },
          {
            type: 'input',
            subType: 'password',
            label: '密码',
            key: 'password',
            rule: 'commonInput',
            props: {
              placeholder: '请输入密码'
            }
          },
          {
            type: 'input',
            subType: 'textarea',
            label: '描述',
            key: 'textarea',
            rule: 'commonInput',
            width: '900px',
            labelCol: 3,
            wrapperCol: 20,
            props: {
              placeholder: '请输入描述',
              rows: 3,
              allowClear: false
            }
          },
          {
            type: 'select',
            label: '接口选择',
            key: 'test',
            apiOption: 'getRegion',
            rule: 'commonSelect',
            replaceFields: {
              label: 'name',
              value: 'id'
            }
          },
          {
            type: 'select',
            label: '字典选择',
            key: 'isswitch',
            dicOption: 'salesModel',
            rule: 'commonSelect'
          },
          {
            type: 'date',
            subType: 'date',
            label: '日期',
            key: 'date',
            rule: 'commonSelect'
          },
          {
            type: 'date',
            subType: 'dateTime',
            label: '日期时间',
            key: 'dateTime',
            rule: 'commonSelect'
          },
          {
            type: 'date',
            subType: 'dateTimeRange',
            label: '日期时间范围',
            key: 'dateTimeRange',
            rule: 'commonSelect'
          },
          {
            type: 'date',
            subType: 'dateRange',
            label: '日期范围',
            key: 'dateRange',
            rule: 'commonSelect'
          },
          {
            type: 'radio',
            label: '单选项',
            key: 'couponswitch',
            dicOption: 'isCoupon',
            rule: 'commonSelect'
          },
          {
            type: 'editor',
            label: '文章内容',
            key: 'content',
            width: '100%',
            labelCol: 3,
            wrapperCol: 20,
            rule: 'editor'
          }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs.formMaking.handleSubmit().then(formData => {
        console.log(formData)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.form-example{
  width: 900px;
  margin: 0 auto;
}
</style>
