<template>
  <a-button class="x-btn-style" type="default" shape="round" :icon="icon" :class="`${type}-color`">{{ label }}</a-button>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'success'
    }
  }
}
</script>

<style lang="less" scoped>
.x-btn-style{
  margin-left: 12px;
  border: none;
  background-color: @btn-back-color;
  &:hover{
    color: @white;
    /deep/ .anticon{
      color: @white;
    }
  }
  &:focus{
    color: @white;
  }
}
.success-color{
  &:hover{
    background-color: @success-color;
  }
  /deep/ .anticon{
    color: @success-color;
  }
}
.warning-color{
  &:hover{
    background-color: @warning-color;
  }
  /deep/ .anticon{
    color: @warning-color;
  }
}
.error-color{
  &:hover{
    background-color: @error-color;
  }
  /deep/ .anticon{
    color: @error-color;
  }
}
</style>
