// eslint-disable-next-line
import { BasicLayout } from '@/layouts'
// import { bxAnaalyse } from '@/core/icons'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/',
    children: []
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    redirect: '/formExample',
    meta: { title: '首页' },
    children: [
      {
        path: '/formExample',
        name: 'formExample',
        component: () => import('@/views/formExample'),
        meta: { title: '示例', keepAlive: true }
      },
      {
        path: '/About',
        name: 'About',
        component: () => import('@/views/About'),
        meta: { title: '关于', keepAlive: true }
      },
      // 内容库管理
      {
        path: '/library',
        component: RouteView,
        redirect: '/library/school',
        name: 'library',
        meta: { title: '内容库管理', icon: 'folder-open', keepAlive: true },
        children: [
          {
            path: '/library/material',
            name: 'material',
            component: () => import('@/views/library/material/index'),
            meta: { title: '视频、音频、资料管理', keepAlive: true }
          },
          {
            path: '/library/lives',
            name: 'lives',
            component: () => import('@/views/library/lives/index'),
            meta: { title: '直播管理', hideHeader: true }
          }
        ]
      }
    ]
  }

]
