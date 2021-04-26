// webpack 支持动态地 require，但会导致所有可能用到的模块都包含在 bundle 中！！！贼吃CPU！！！
// https://webpack.docschina.org/guides/dependency-management/

// let pages = require.context(
//   // 其组件目录的相对路径
//   '@/pages',
//   // 是否查询其子目录
//   false,
//   // 匹配基础组件文件名的正则表达式
//   /(?<!index)\.vue$/i
// )
//
// pages = pages.keys().map(fileName => {
//   return 'pages' + fileName.substr(1)
// })
//
// let indexes = require.context(
//   // 其组件目录的相对路径
//   '@/pages',
//   // 是否查询其子目录
//   true,
//   // 匹配基础组件文件名的正则表达式
//   /index\.vue$/i
// )
//
// indexes = indexes.keys().map(fileName => {
//   return 'pages' + fileName.substr(1)
// })

const pages = [
  'src/pages/AntDesign/AntDesign.vue',
  'src/pages/AntDesign/AntDesignRealtimePreview.vue',
  'src/pages/AntDesign/AntDesignTable.vue',

  'src/pages/EventTest/index.vue',

  'src/pages/M/MTextareaSpec.vue',
  'src/pages/M/SlipAnimatedNumberSpec.vue',

  'src/pages/ElementUI.vue',
  'src/pages/EventTest.vue',
  'src/pages/FilterTest.vue',
  'src/pages/HelloWorld.vue',
  'src/pages/QRCode.vue',
  'src/pages/TensorFlow.vue',
]

export default {
  routes: [
    {
      path: '/',
      component: () => import('@/pages/Index'),
    },
    ...pages.map(path => {
      return {
        path: '/' + path,
        component: () => import('.' + path.replace(/^src/, ''))
      }
    })
  ]
}
