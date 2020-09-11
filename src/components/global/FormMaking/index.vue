<!--
 * @Author: 陈杰超
 * @Date: 2020-06-17 18:05:29
 * @LastEditTime: 2020-09-11 09:35:35
 * @LastEditors: 陈杰超
 * @Description: 通用组件-表单设计器
-->
<template>
  <div class="header-filter-component table-page-search-wrapper">
    <a-form-model
      class="form-making-component"
      ref="ruleForm"
      :model="formData"
      :rules="rules">
      <template v-for="item in formConfig.formList">
        <div v-if="item.isShow ? item.isShow(formData) : true" :key="item.key" class="ant-show-item" :style="`width: ${item.width ? item.width : formConfig.width}`">
          <!-- 自定义区域 -->
          <template v-if="item.type === 'default'">
            <slot :name="item.key" :formData="formData" :item="item"></slot>
          </template>
          <template v-else>
            <a-divider v-if="item.dividerName" orientation="left">
              {{ item.dividerName }}
            </a-divider>
            <a-form-model-item
              :label-col="{md: {span: item.labelCol ? item.labelCol : (formConfig.labelCol ? formConfig.labelCol : 6)}}"
              :wrapper-col="{md: {span: item.wrapperCol ? item.wrapperCol : (formConfig.wrapperCol ? formConfig.wrapperCol : 16)}}"
              :prop="item.key"
              :label="item.label">
              <component :is="'action' + item.type" :action="item" :searchInfo="formData" @validate-some="validateSome"></component>
              <span v-if="item.tipName" class="form-tip" style="">{{ item.tipName }}</span>
            </a-form-model-item>
          </template>
        </div>
      </template>
    </a-form-model>
  </div>
</template>

<script>
import * as actions from '@/components/global/Action'
import checkForm from '@/utils/checkForm'
export default {
  components: { ...actions },
  props: {
    // 表单配置
    formConfig: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // 表单数据
      formData: {},
      // 校验规则
      rules: {}
    }
  },
  created() {
    this.initForm()
  },
  methods: {
    /**
     * @description: 初始化表单对象
    */
    initForm() {
      // 如果表单已存在，则重置表单
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      if (this.formConfig && this.formConfig.formList) {
        this.formConfig.formList.forEach(item => {
          // 设置表单字段
          // 如果有初始化表单配置initForm，则取initForm内的值
          if (this.formConfig.initForm && (this.formConfig.initForm[item.key] || this.formConfig.initForm[item.key] === 0)) {
            this.$set(this.formData, item.key, this.formConfig.initForm[item.key])
          } else {
            if (item.key) {
              this.$set(this.formData, item.key, undefined)
            }
          }
          // 设置校验规则
          if (item.rule && typeof item.rule === 'string') {
            if (item.rule.includes('common')) {
              this.rules[item.key] = checkForm[item.rule](item)
            } else {
              this.rules[item.key] = checkForm[item.rule] || null
            }
          } else if (item.rule && typeof item.rule === 'function') {
            this.rules[item.key] = item.rule(this.formData)
          } else if (item.rule) {
            this.rules[item.key] = item.rule
          }
        })
      }
    },
    /**
     * @description: 表单校验
    */
    handleSubmit() {
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            resolve(this.formData)
          }
        })
      })
    },
    /**
     * @description: 校验指定字段
    */
    validateSome(key) {
      this.$refs.ruleForm.validateField(key)
    },
    /**
     * @description: 设置指定字段
     * @param {String} key
     */
    setAssignKey(key, value) {
      this.$set(this.formData, key, value)
    }
  }
}
</script>

<style lang="less">
.form-making-component{
  display: flex;
  flex-wrap: wrap;
  .ant-show-item{
    width: 400px;
    .ant-radio-group{
      width: 100%;
      text-align: left;
    }
    .ant-calendar-picker{
      width: 100% !important;
    }
  }
  .form-tip{
    position: absolute;
    right: 0;
    top: -10px;
    transform: translateX(calc(100% + 12px));
    color: @text-color-secondary;
  }
  .new-btn{
    cursor: pointer;
    position: absolute;
    right: 0;
    top: -10px;
    transform: translateX(calc(100% + 12px));
    color: @primary-color;
  }
}
</style>
