const pages = [
  'src/pages/ele/ElementUISpec.vue',
  'src/pages/ant/AntDesignVueSpec.vue',
  'src/pages/componentSpec/PowerfulTextareaSpec.vue',
  'src/pages/componentSpec/OnelineWithPopoverSpec.vue'
]

export default {
  mode: 'history',
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
