<template>
  <div>
    1. 后台系统页面主角：表单和表格（贡献80%工作量）
  </div>
</template>
<script>
// Vue 选项顺序固定
export default {
  components: {},
  data () {
    return {
      // 接口数据
      model: {},
      // 常量
      constants: {},
      // 弹窗
      popup: {},
      // 加载状态
      loading: {},
      // 写前端交互辅助用
      helper: {},
      // 用户输入
      selected: {},
      /*
       * 有些状态会比较模糊，既可以放在helper里，也可以放在selected里，
       * 这种情况更偏向于把中间态放在helper里，把最终态放在selected里
       */

      /* `````````````🤔```````````` */
      form: {}, // 表单
      table: {}, // 表格
      pagination: {}, // 分页
    }
  },
  methods: {},
  computed: {},
  watch: {},
  created () {},
  mounted () {}
}
</script>
<style lang="less" scoped>
@import "~@/common/css/common";
</style>
