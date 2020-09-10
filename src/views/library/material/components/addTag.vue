<!--
 * @Author: 陈杰超
 * @Date: 2020-07-01 20:01:40
 * @LastEditTime: 2020-09-07 16:58:53
 * @LastEditors: 陈杰超
 * @Description: 内容库-资料管理-新建标签
-->
<template>
  <a-modal
    v-model="modalShow"
    :confirmLoading="modalLoading"
    :width="600"
    okText="保存"
    :title="type === 'add' ? '添加标签' : '编辑标签'"
    @ok="handleOk"
  >
    <formMaking v-if="modalShow" ref="formMaking" :formConfig="formConfig"></formMaking>
  </a-modal>
</template>

<script>
import formMaking from '@/components/global/FormMaking/index.vue'
export default {
  components: {
    formMaking
  },
  data() {
    return {
      // 添加/编辑
      type: 'add',
      // 模态框是否显示
      modalShow: false,
      // loading
      modalLoading: false,
      // formMaking表单配置文件
      formConfig: {
        // 初始化表单配置
        initForm: {},
        formList: [
          {
            type: 'input',
            label: '标签名称',
            key: 'name',
            rule: 'commonInput'
          }
        ]
      }
    }
  },
  methods: {
    /**
     * @description: 模态框保存
     */
    handleOk() {
      this.$refs.formMaking.handleSubmit().then(formData => {
        this.modalLoading = true
        if (this.type === 'edit') {
          this.editTag(formData)
        } else {
          this.newTag(formData)
        }
      })
    },
    /**
     * @description: 创建标签
     */
    newTag(formData) {
      this.$ajax.post('labelApi', formData).then(res => {
        if (res.success) {
          this.$message.success('创建成功')
          this.$emit('queryTag', res.data)
          this.modalShow = false
        } else {
          this.$message.error(res.message || '创建失败')
        }
        this.modalLoading = false
      })
    },
    /**
     * @description: 编辑标签
     */
    editTag(formData) {
      this.$ajax.put('labelApi', Object.assign(formData, { id: this.formConfig.initForm.id })).then(res => {
        if (res.success) {
          this.$message.success('更新成功')
          this.$emit('queryTag')
          this.modalShow = false
        } else {
          this.$message.error(res.message || '更新失败')
        }
        this.modalLoading = false
      })
    },
    /**
     * @description: 模态框显示
     * @param {String} type add/edit
     * @param {String} data 初始化数据
     */
    show(type, data) {
      // 初始化表单
      if (data) {
        this.formConfig.initForm = data
      } else {
        this.formConfig.initForm = {}
      }
      this.type = type
      this.modalShow = true
      // 重置数据
      if (this.$refs.formMaking) {
        this.$refs.formMaking.initForm()
      }
    }
  }
}
</script>
