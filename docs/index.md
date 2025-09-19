---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "uni-app-vue3-template"
  text: "Uni-App Vue3 模版"
#   tagline: 基于 uv-ui 和 IconPark 的 uni-app Vue3 跨平台开发模版
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/start
    - theme: alt
      text: 核心功能
      link: /guide/components

features:
  - title: 🧩 组件库集成
    details: 集成 uv-ui 组件库和 IconPark 图标库，提供丰富的 UI 组件和图标资源
  - title: 🌐 网络请求
    details: 基于 Promise 风格的网络请求封装，支持自定义拦截器和统一 Loading 处理
  - title: 🔌 WebSocket
    details: 完整的 WebSocket 实现，包含消息收发、心跳检测和自动重连机制
  - title: 🎨 主题系统
    details: 基于 CSS 变量的主题方案，支持动态切换主题色
  - title: ⚡ 全局 Loading
    details: 自定义全局 Loading 组件，提供更好的用户体验
  - title: 🛠️ 工具函数
    details: 多平台实用工具函数集合，提升开发效率
---

## 项目简介

`uni-app-vue3-template` 是一个基于 Vue3 的 uni-app 跨平台开发模板，集成了常用的组件库、网络请求、WebSocket、主题系统等功能，旨在为开发者提供一个开箱即用的开发基础。

## 主要特性

- **技术栈**：Vue3 + Pinia + uv-ui + IconPark + WebSocket
- **跨平台**：支持小程序、H5、App 等多端运行
- **组件丰富**：集成 uv-ui 组件库和 IconPark 图标库
- **网络优化**：Promise 风格网络请求，支持拦截器和统一 Loading
- **实时通信**：完整的 WebSocket 实现，支持心跳和重连
- **主题定制**：基于 CSS 变量的主题系统，轻松切换主题色
- **全局状态**：使用 Pinia 进行状态管理
- **工具齐全**：提供多平台实用工具函数

## 适用场景

本模板适用于需要快速搭建跨平台应用的开发团队，特别适合：

- 需要同时支持小程序、H5、App 的项目
- 对 UI 组件和图标有较高要求的项目
- 需要实时通信功能的项目
- 需要统一主题和样式的项目

开始使用请查看 [快速开始](/guide/start) 指南。
