<template>
  <pro-layout
    :title="title"
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleCollapse="handleCollapse"
    :handleMediaQuery="handleMediaQuery"
    :logo="logoRender"
    :i18nRender="i18nRender"
    v-bind="settings"
  >
    <template v-slot:rightContentRender>
      <right-content :top-menu="settings.layout === 'topmenu'" :is-mobile="isMobile" :theme="settings.theme" />
    </template>
    <template v-slot:footerRender>
      <!-- <global-footer /> -->
      <div></div>
    </template>
    <router-view />
  </pro-layout>
</template>

<script>
import { SettingDrawer } from '@ant-design-vue/pro-layout'
import { mapState } from 'vuex'
// import { SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'

import defaultSettings from '@/config/defaultSettings'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'
import LogoSvg from '../assets/icon/logo.svg?inline'

import { constantRouterMap } from '@/config/router.config'

export default {
  name: 'BasicLayout',
  components: {
    SettingDrawer,
    RightContent,
    GlobalFooter
  },
  data() {
    return {
      // base
      menus: [],
      // 侧栏收起状态
      collapsed: true,
      title: defaultSettings.title,
      settings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        // 定宽: true / 流式: false
        contentWidth: defaultSettings.contentWidth,
        // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
        // 主色调
        primaryColor: defaultSettings.primaryColor,
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        colorWeak: defaultSettings.colorWeak,

        hideHintAlert: false,
        hideCopyButton: false
      },
      // 媒体查询
      query: {},

      // 是否手机模式
      isMobile: false
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      // mainMenu: state => state.permission.addRouters
    })
  },
  created() {
    // const routes = this.mainMenu.find(item => item.path === '/')
    // this.menus = (routes && routes.children) || []
    this.menus = constantRouterMap[0].children || []
    // 处理侧栏收起状态
    // this.$watch('collapsed', () => {
    //   this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    // })
  },
  mounted() {
    // const userAgent = navigator.userAgent
    // if (userAgent.indexOf('Edge') > -1) {
    //   this.$nextTick(() => {
    //     this.collapsed = !this.collapsed
    //     setTimeout(() => {
    //       this.collapsed = !this.collapsed
    //     }, 16)
    //   })
    // }
    // updateTheme(this.settings.primaryColor)
  },
  methods: {
    i18nRender(key) {
      return key
    },
    handleCollapse(val) {
      this.collapsed = val
    },
    handleMediaQuery(val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
        this.settings.contentWidth = false
        this.settings.fixSiderbar = false
      }
    },
    logoRender() {
      return <LogoSvg style="width:40px;height:40px"/>
    }
  }
}
</script>

<style lang="less">
@import "./BasicLayout.less";
</style>
