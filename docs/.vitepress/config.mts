import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Uni-App Vue3 模版文档',
  description: '基于 uv-ui、IconPark 的 uni-app Vue3 模版',
  base: "/uniapp-template/",
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/start' },
      { text: '使用指南', link: '/guide/components' }
    ],
    sidebar: {
      '/guide/': [
        { text: '快速开始', link: '/guide/start' },
        { text: '项目结构说明', link: '/guide/structure' },
        {
          text: '核心功能',
          items: [
            { text: '组件库', link: '/guide/components' },
            { text: '网络请求', link: '/guide/network' },
            { text: 'WebSocket', link: '/guide/websocket' },
            { text: '主题与样式', link: '/guide/theme' },
            { text: '全局 Loading', link: '/guide/loading' },
            { text: '工具函数', link: '/guide/utils' },
            { text: '内置 Hooks', link: '/guide/hooks' }
          ]
        },
        { text: '最佳实践', link: '/guide/best-practice' },
        { text: '附录', link: '/guide/appendix' }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/XuXingfei/uniapp-template' }
    ],
    outline: {
      level: [2, 3]
    }
  }
})