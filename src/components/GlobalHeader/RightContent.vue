<template>
  <div :class="wrpCls">
    <notice-icon></notice-icon>
    <span class="school-name">湖南分校</span>
    <avatar-dropdown :menu="showMenu" :current-user="userInfo" :class="prefixCls" />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import NoticeIcon from '@/components/NoticeIcon'
export default {
  name: 'RightContent',
  components: {
    AvatarDropdown,
    NoticeIcon
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showMenu: true,
      currentUser: {}
    }
  },
  computed: {
    userInfo() {
      return this.$store.getters.userInfo
    },
    wrpCls() {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.school-name{
  font-size: @fs-lg;
  margin-right: 24px;
}
</style>
