<!--
 * @Author: 陈杰超
 * @Date: 2020-06-15 20:05:50
 * @LastEditTime: 2020-09-11 11:59:27
 * @LastEditors: 陈杰超
 * @Description: 通用组件-顶部筛选表单组件
-->
<template>
  <div class="header-filter-component table-page-search-wrapper">
    <a-form layout="inline">
      <a-row :gutter="48">
        <template v-for="item in listSearch">
          <a-col v-if="item.isShow ? item.isShow(searchInfo) : true" :key="item.key" :md="8" :sm="24">
            <a-form-item :label="item.label">
              <template v-if="item.type === 'default'">
                <slot :name="item.key" :formData="searchInfo" :item="item"></slot>
              </template>
              <template v-else>
                <component :is="'action' + item.type" :action="item" :searchInfo="searchInfo"></component>
              </template>
            </a-form-item>
          </a-col>
        </template>
        <a-col :md="8" :sm="24" class="header-filter-footer">
          <a-button @click="triggerSearch" type="primary">搜索</a-button>
          <a-button class="reset-button" @click="triggerRest">重置</a-button>
          <slot name="button"></slot>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import * as actions from '@/components/global/Action'
export default {
  components: { ...actions },
  props: {
    listSearch: {
      type: Array,
      default() {
        return []
      }
    },
    searchInfo: {
      type: Object,
      default() {
          return {}
      }
    }
  },
  // data () {
  //   return {
  //     // 搜索表单信息
  //     searchInfo: {}
  //   }
  // },
  created() {
    // if (this.listSearch && this.listSearch[0]) {
    //   this.listSearch.forEach(item => {
    //     this.searchInfo[item.key] = ''
    //   })
    // }
  },
  methods: {
    triggerRest() {
      this.$emit('triggerSearch', 'reset')
    },
    triggerSearch() {
      this.$emit('triggerSearch', 'search')
    }
  }
}
</script>

<style lang="less">
@import '~ant-design-vue/es/style/themes/default.less';
.header-filter-component{
  .header-filter-footer{
    float: right;
    text-align: right;
    height:56px;
    .reset-button{
      margin-left: @pd-md;
    }
  }
}
</style>
