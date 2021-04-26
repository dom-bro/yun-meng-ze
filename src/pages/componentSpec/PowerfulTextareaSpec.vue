<template>
  <div>
    <PowerfulTextarea v-model="selected.name" placeholder="请输入"></PowerfulTextarea>
  </div>
</template>
<script>
import PowerfulTextarea from '@/components/yun/PowerfulTextarea'
export default {
  components: { PowerfulTextarea },
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
