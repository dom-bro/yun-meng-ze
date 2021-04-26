<template>
  <div>
    <OnelineWithPopover :value="selected.name" style="width: 50px;overflow: hidden"/>
  </div>
</template>
<script>
import OnelineWithPopover from '@/components/yun/OnelineWithPopover'

export default {
  components: { OnelineWithPopover },
  data () {
    return {
      model: {},
      constants: {},
      popup: {},
      loading: {},
      helper: {},
      selected: {
        name: '我要抱抱芃菲',
      },
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
