<template>
  <a-config-provider :locale="zhCN">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  mounted() {
    this.$store.dispatch('GetDicData')
  },
  data() {
    return {
      zhCN
    }
  }
}
</script>
