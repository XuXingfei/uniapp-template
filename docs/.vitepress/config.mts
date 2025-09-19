import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Uni-App Vue3 模版文档",
  description: "基于 Vue3 的 uni-app 基础模版，集成 uv-ui 与 IconPark，支持 Promise 风格请求拦截、WebSocket 消息与心跳重连、CSS 变量主题切换、自定义全局 Loading 及多端工具函数。",
  base: "/uniapp-template/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
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
        // label: '本页目录',
        level: [2, 3], // 表示显示 H2 和 H3 标题
    }
  }
})
