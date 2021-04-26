<template>
  <div>
    <div class="link"
         v-for="item in routes"
         @click="openWebview(item)"
         :key="item.path">{{item.path}}</div>
  </div>
</template>

<script>
import router from '../router'

export default {
  name: 'Home',
  data () {
    return {
      routes: router.routes.filter(item => item.path !== '/'),
    }
  },

  methods: {
    openWebview (item) {
      this.$router.push(item)
    },
  },

  created () {
  }
}
</script>

<style scoped lang="less">
  .link {
    cursor: pointer;
    color: blue;
  }
</style>
