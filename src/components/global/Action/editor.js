/*
 * @Author: 陈杰超
 * @Date: 2020-09-03 16:54:28
 * @LastEditTime: 2020-09-03 17:12:48
 * @LastEditors: 陈杰超
 * @Description: 富文本组件
 */
import Editor from '@/components/Editor/WangEditor'
export default {
  components: {
    Editor
  },
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
    onChange(e) {
      // eslint-disable-next-line
      if (/<img.*?src=[\"|\']?(.*?)[\"|\']?\s.*?>/i.test(e)) {
        this.searchInfo[this.action.key] = e
      } else if (!this.$refs.editor.editor.txt.text()) {
        this.searchInfo[this.action.key] = ''
      } else {
        this.searchInfo[this.action.key] = e
      }
    }
  },
  render() {
    return (
      <Editor ref="editor" value={this.searchInfo[this.action.key]}></Editor>
    )
  }
}
