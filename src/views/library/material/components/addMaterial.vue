<!--
 * @Author: 陈杰超
 * @Date: 2020-07-01 20:21:25
 * @LastEditTime: 2020-09-07 16:58:00
 * @LastEditors: 陈杰超
 * @Description: 内容库-资料管理-上传素材
-->
<template>
  <div>
    <a-modal
      v-model="modalShow"
      :confirmLoading="modalLoading"
      :width="600"
      okText="保存"
      :title="type === 'add' ? '添加内容' : '编辑内容'"
      @ok="handleOk"
    >
      <formMaking v-if="modalShow" ref="formMaking" :formConfig="formConfig">
        <div slot="vodtypeflagsId" slot-scope="{ item, formData }">
          <a-form-model-item
            :label-col="{md: {span: 6 }}"
            :wrapper-col="{md: {span: 15 }}"
            :prop="item.key"
            :label="item.label">
            <a-select
              :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
              v-model="formData[item.key]">
              <div slot="dropdownRender" slot-scope="menu">
                <v-nodes :vnodes="menu" />
                <a-divider style="margin: 0;" />
                <div
                  class="select-add"
                  @mousedown="e => e.preventDefault()"
                  @click="addItem"
                >
                  <a-icon type="plus" /> 新建标签
                </div>
              </div>
              <a-select-option
                v-for="dept in tagList"
                :key="dept.id"
                :value="dept.id">
                {{ dept.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
        </div>
      </formMaking>
    </a-modal>
    <!-- 添加标签 -->
    <add-tag ref="addTag" @queryTag="getTagList"></add-tag>
  </div>

</template>

<script>
import formMaking from '@/components/global/FormMaking/index.vue'
import addTag from '@/views/library/material/components/addTag'
import _ from 'lodash'
export default {
  components: {
    formMaking,
    addTag,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
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
            label: '文件名称',
            key: 'name',
            rule: 'commonInput'
          },
          {
            type: 'default',
            label: '文件标签',
            key: 'vodtypeflagsId',
            rule: 'commonSelect'
          }
          // {
          //   type: 'uploader',
          //   mode: 'fileList',
          //   label: '资源文件',
          //   key: 'uploadfile',
          //   limit: 1,
          //   rule: 'commonSelect'
          // }
        ]
      },
      // 标签列表
      tagList: []
    }
  },
  created() {
    this.getTagList()
  },
  methods: {
    /**
     * @description: 模态框保存
     */
    handleOk() {
      this.$refs.formMaking.handleSubmit().then(formData => {
        this.modalLoading = true
        const data = _.cloneDeep(formData)
        data.uploadfile = data.uploadfile.map(item => item.url).join(',')
        if (this.type === 'edit') {
          this.editMaterial(data)
        } else {
          this.newMaterial(data)
        }
      })
    },
    /**
     * @description: 创建内容
     */
    newMaterial(formData) {
      formData.vodtypeId = this.getSuffix(formData.uploadfile)
      this.$ajax.post('publicResourceApi', formData).then(res => {
        if (res.success) {
          this.$message.success('添加成功')
          this.$emit('queryMaterial')
          this.modalShow = false
        } else {
          this.$message.error(res.message || '添加失败')
        }
        this.modalLoading = false
      })
    },
    /**
     * @description: 编辑内容
     */
    editMaterial(formData) {
      formData.vodtypeId = this.getSuffix(formData.uploadfile)
      this.$ajax.put('publicResourceApi', Object.assign(formData, { id: this.formConfig.initForm.id })).then(res => {
        if (res.success) {
          this.$message.success('更新成功')
          this.$emit('queryMaterial')
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
    show(type, data, vodtypeId) {
      // 获取标签
      this.getTagList()
      // 初始化表单
      if (data) {
        this.formConfig.initForm = data
        if (this.formConfig.initForm.vodtypeflagsId === 0) this.formConfig.initForm.vodtypeflagsId = undefined
        if (type === 'edit') {
          this.formConfig.initForm.uploadfile = [
            {
              uid: '1',
              name: data.name,
              url: data.uploadfile,
              status: 'done'
            }
          ]
        } else {
          this.formConfig.initForm.uploadfile = []
        }
      } else {
        this.formConfig.initForm = {}
        this.formConfig.initForm.uploadfile = []
      }
      // 初始化文件类型
      if (vodtypeId) {
        this.formConfig.formList[2].sonType = vodtypeId
      }
      this.type = type
      this.modalShow = true
      // 重置数据
      if (this.$refs.formMaking) {
        this.$refs.formMaking.initForm()
      }
    },
    /**
     * @description: 根据文件名获取文件类型
     * @param {String} 文件名
     */
    getSuffix(filename) {
      const pos = filename.lastIndexOf('.')
      let suffix = ''
      if (pos !== -1) {
        suffix = filename.substring(pos)
      }
      if (['.mp4'].includes(suffix)) {
        return 1
      } else if (['.mp3'].includes(suffix)) {
        return 2
      } else if (['.doc', '.docx', '.xls', '.xlsx', '.pdf'].includes(suffix)) {
        return 3
      } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(suffix)) {
        return 4
      }
    },
    /**
     * @description: 获取标签列表
     * @param {String} 刚新建的标签id
     */
    getTagList(id) {
      this.$emit('getTagList', id)
      this.$ajax.get('labelApi').then(res => {
        if (res.success) {
          this.tagList = res.data || []
          if (id) this.$refs.formMaking.setAssignKey('vodtypeflagsId', id)
        } else {
          this.tagList = []
        }
      })
    },
    /**
     * @description: 新建标签
     */
    addItem() {
      this.$refs.addTag.show()
    }
  }
}
</script>
