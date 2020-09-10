<template>
  <div :class="prefixCls">
    <div ref="editor" class="editor-wrapper"></div>
  </div>
</template>

<script>
import WEditor from 'wangeditor'
import moment from 'moment'
import md5 from 'md5'
import axios from 'axios'
import { getOssPolicy } from '@/api/apiList'

export default {
  name: 'WangEditor',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-editor-wang'
    },
    // eslint-disable-next-line
    value: {
      type: String
    }
  },
  data() {
    return {
      editor: null,
      editorContent: null,
      ajaxData: {}
    }
  },
  watch: {
    value: {
      handler(val) {
        this.editorContent = val
        this.editor.txt.html(val)
      }
    }
  },
  mounted() {
    // this.getossPolicy()
    this.initEditor()
  },
  methods: {
    /**
     * @description: 初始化editor
     */
    initEditor() {
      this.editor = new WEditor(this.$refs.editor)
      // this.editor.onchangeTimeout = 200
      this.editor.customConfig.onchange = (html) => {
        this.editorContent = html
        this.$emit('change', this.editorContent)
      }
      this.editor.customConfig.uploadImgMaxLength = 1
      const _this = this
      this.editor.customConfig.customUploadImg = function(files, insert) {
          const file = files[0]
          const fileName = md5(file.name + moment().valueOf()) + _this.getSuffix(file.name)
          const formData = new FormData()
          formData.append('OSSAccessKeyId', _this.ajaxData.accessid)
          formData.append('success_action_status', '200')
          formData.append('key', _this.ajaxData.dir + fileName)
          formData.append('policy', _this.ajaxData.policy)
          formData.append('signature', _this.ajaxData.signature)
          formData.append('file', file)
          axios({
            method: 'post',
            url: _this.ajaxData.host,
            data: formData,
            headers: {
              'Content-type': 'multipart/form-data'
            }
          }).then(res => {
            if (res.status === 200) {
              insert(_this.ajaxData.host + '/' + _this.ajaxData.dir + fileName)
            }
          })
      }
      this.editor.create()
      if (this.value) {
        this.editor.txt.html(this.value)
      }
    },
    /**
     * @description: 初始化上传
     */
    getossPolicy() {
      getOssPolicy().then(res => {
        if (res.success) {
          this.ajaxData = res.data || {}
          this.initEditor()
        } else {
          this.$message.error(res.message || '查询失败')
        }
      })
    },
    /**
     * @description: 获取文件后缀名
     * @param {String} 文件名
     */
    getSuffix(filename) {
      const pos = filename.lastIndexOf('.')
      let suffix = ''
      if (pos !== -1) {
        suffix = filename.substring(pos)
      }
      return suffix
    }
  }
}
</script>

<style lang="less" scoped>
.ant-editor-wang {
  .editor-wrapper {
    text-align: left;
  }
}
</style>
