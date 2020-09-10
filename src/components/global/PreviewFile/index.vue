<!--
 * @Author: 陈杰超
 * @Date: 2020-07-02 15:11:22
 * @LastEditTime: 2020-08-11 11:40:52
 * @LastEditors: 陈杰超
 * @Description: 预览文件模态框
-->
<template>
  <a-modal
    v-model="modalShow"
    :width="848"
    :footer="false"
    title="预览文件"
  >
    <div v-if="type === 4" class="image-box">
      <img :src="previewUrl" alt="">
    </div>
    <div v-if="type === 2" class="audio-box">
      <audio v-if="modalShow" :src="previewUrl" controls="controls"></audio>
    </div>
    <div v-if="type === 1" class="video-box">
      <video v-if="modalShow" :src="previewUrl" controls="controls"></video>
    </div>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      // 文件类型
      type: 1,
      // 模态框是否显示
      modalShow: false,
      // 预览url
      previewUrl: ''
    }
  },
  methods: {
    /**
     * @description: 模态框显示
     * @param {String} 文件url
     */
    show(type, url) {
      this.type = type
      this.previewUrl = url
      this.modalShow = true
    }
  }
}
</script>

<style lang="less" scoped>
.image-box{
  text-align: center;
  // width: 800px;
  // height: 600px;
  // img{
  //   width: 100%;
  //   height: 100%;
  // }
}
.video-box{
  video{
    outline: none;
    width: 800px;
    height: 600px;
  }
}
.audio-box{
  .layoutFlex;
  width: 800px;
  height: 400px;
  audio{
    outline: none;
    width:500px;
  }
}
</style>
