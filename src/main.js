import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import router from './router'

import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'

import 'ant-design-vue/dist/antd.css'
import AntDesign, { Icon } from 'ant-design-vue'

Vue.use(ElementUI)

Vue.use(AntDesign)

Vue.use(VueRouter)

Vue.config.productionTip = false

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1641656_wagpy0cvz8i.js',
})

Vue.component('icon-font', IconFont)

new Vue({
  router: new VueRouter(router),
  render: h => h(App)
}).$mount('#app')
