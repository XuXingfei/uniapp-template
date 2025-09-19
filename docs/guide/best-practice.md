# 最佳实践

本指南提供了一些在使用 `uni-app-vue3-template` 开发项目时的最佳实践建议。

## 页面组织

### 主包与分包

合理组织主包和分包可以优化应用的启动速度和运行性能。

#### 主包 (pagesMain)

主包应包含应用的核心页面，如：

- 首页
- 个人中心
- 重要功能入口页面

```json
// pages.json
{
  "pages": [{
    "path": "pagesMain/home",
    "style": {
      "navigationBarTitleText": "首页"
    }
  }, {
    "path": "pagesMain/user",
    "style": {
      "navigationBarTitleText": "我的"
    }
  }]
}
```

#### 分包 (pages)

将业务功能相关的页面组织成分包：

```json
// pages.json
{
  "subPackages": [{
    "root": "pages",
    "pages": [{
      "path": "login",
      "style": {
        "navigationBarTitleText": "登录"
      }
    }, {
      "path": "register",
      "style": {
        "navigationBarTitleText": "注册"
      }
    }]
  }]
}
```

### TabBar 页面

合理设计 TabBar 页面，建议：

1. TabBar 页面数量控制在 3-5 个
2. TabBar 页面放在主包中
3. 为 TabBar 页面设计统一的图标和主题

```javascript
// common/utils/index.js
export const setThemeIcon = function(theme, ms = 0) {
  // 设置 TabBar 主题图标
  ['home', 'me'].forEach((i, index) => {
    uni.setTabBarItem({
      index,
      selectedIconPath: `/static/tabIcon/${i}_${theme}.png`
    })
  })
}
```

### 页面结构

#### 基本页面

```vue
<template>
    <my-container>
        <view class="container">
            <x-nav-bar>
                <text class="navbar_title">标题</text>
            </x-nav-bar>
        </view>
    </my-container>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { onLoad, onShow, onPullDownRefresh } from '@dcloudio/uni-app'
    import { useCommon } from '@/hooks/useCommon.js'
    import {} from '@/common/api/index.js'

    const { gProps, userStore, globalStore } = useCommon()

    const query = reactive({});

    onLoad((e) => {
        Object.assign(query, e)
    })

    onShow(() => {

    })

    const refresh = () => {
        // getData(1)
    }

    onPullDownRefresh(() => {
        refresh()
    })
</script>

<style lang="scss" scoped>
    .container {}
</style>
```

#### 列表页面

```vue
<template>
    <my-container>
        <view class="container">
            <x-nav-bar>
                <text class="navbar_title">标题</text>
            </x-nav-bar>
        </view>
    </my-container>
</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { onLoad, onShow, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'
    import { useCommon } from '@/hooks/useCommon.js'
    import { usePaging } from '@/hooks/usePaging.js'
    import {} from '@/common/api/index.js'

    const { gProps, userStore, globalStore } = useCommon()

    const query = reactive({});

    const params = reactive({})
    // const { pagingInfo, getData } = usePaging(, params)

    onLoad((e) => {
        Object.assign(query, e)
    })

    onShow(() => {

    })

    onReachBottom(() => {
        // getData()
    })

    const refresh = () => {
        // getData(1)
    }

    onPullDownRefresh(() => {
        refresh()
    })
</script>

<style lang="scss" scoped>
    .container {}
</style>
```

## 代码规范与格式化

### 代码风格配置

项目使用 `.jsbeautifyrc` 配置代码格式化规则：

```json
// .jsbeautifyrc
{
  "indent_size": 2,
  "indent_char": " ",
  "indent_with_tabs": false,
  "eol": "\n",
  "end_with_newline": true,
  "indent_level": 0,
  "preserve_newlines": true,
  "max_preserve_newlines": 10,
  "space_in_paren": false,
  "space_in_empty_paren": false,
  "jslint_happy": false,
  "space_after_anon_function": false,
  "brace_style": "collapse",
  "unindent_chained_methods": false,
  "break_chained_methods": false,
  "keep_array_indentation": false,
  "unescape_strings": false,
  "wrap_line_length": 0,
  "e4x": false,
  "comma_first": false,
  "operator_position": "before-newline"
}
```

### Vue 组件规范

#### 组件结构

```vue
<template>
  <view class="component-name">
    <!-- 组件内容 -->
  </view>
</template>

<script>
// 导入语句按功能分组
import { useGlobalStore } from '@/stores/global.js'

export default {
  name: 'ComponentName',
  components: {
    // 组件注册
  },
  props: {
    // 属性定义
  },
  data() {
    return {
      // 数据定义
    }
  },
  computed: {
    // 计算属性
  },
  watch: {
    // 监听器
  },
  created() {
    // 生命周期钩子
  },
  mounted() {
    // 生命周期钩子
  },
  methods: {
    // 方法定义
  }
}
</script>

<style scoped>
/* 样式定义 */
.component-name {
  /* 样式内容 */
}
</style>
```

#### 命名规范

1. 组件名使用大驼峰命名法：`UserProfile.vue`
2. 变量和方法使用小驼峰命名法：`getUserInfo()`
3. 常量使用大写字母和下划线：`const MAX_RETRY_COUNT = 3`
4. CSS 类名使用短横线分隔：`.user-profile`

## 状态管理 (Pinia)

### Store 设计原则

1. 按功能模块划分 Store
2. 保持 Store 的纯净性
3. 合理使用 Getters 和 Actions

```javascript
// stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: uni.getStorageSync('token') || ''
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    userName: (state) => state.userInfo?.name || ''
  },
  actions: {
    setToken(token) {
      this.token = token
      uni.setStorageSync('token', token)
    },
    clearToken() {
      this.token = ''
      uni.removeStorageSync('token')
    },
    async login(loginData) {
      try {
        const result = await http.post('/api/auth/login', loginData)
        this.setToken(result.token)
        this.userInfo = result.userInfo
        return result
      } catch (error) {
        this.clearToken()
        throw error
      }
    }
  }
})
```

### Store 使用规范

```javascript
// 在组件中使用 Store
import { useUserStore } from '@/stores/user.js'

export default {
  computed: {
    // 使用 mapState 简化访问
    ...mapState(useUserStore, ['userInfo', 'isLoggedIn']),
    userName() {
      return useUserStore().userName
    }
  },
  methods: {
    async handleLogin() {
      const userStore = useUserStore()
      try {
        await userStore.login(this.loginForm)
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })
        uni.switchTab({
          url: '/pagesMain/home'
        })
      } catch (error) {
        uni.showToast({
          title: '登录失败',
          icon: 'none'
        })
      }
    }
  }
}
```

## 网络请求最佳实践

### 请求封装使用

1. 统一使用封装的 http 实例
2. 合理处理 Loading 状态
3. 正确处理错误情况

```javascript
// api/user.js
import { http } from '@/common/network/http.js'

export const userApi = {
  // 获取用户信息
  getUserInfo() {
    return http.get('/api/user/info')
  },
  // 更新用户信息
  updateUserInfo(userData) {
    return http.post('/api/user/update', userData)
  },
  // 上传头像
  uploadAvatar(filePath) {
    return uploadFile.upload({
      url: '/api/user/upload/avatar',
      filePath: filePath,
      name: 'file'
    })
  }
}
```

### 错误处理

```javascript
// 在组件中处理请求错误
export default {
  methods: {
    async fetchUserInfo() {
      try {
        const userInfo = await userApi.getUserInfo()
        this.userInfo = userInfo
      } catch (error) {
        // 根据错误类型进行不同处理
        if (error.statusCode === 401) {
          // 未授权，跳转到登录页
          uni.navigateTo({
            url: '/pages/login'
          })
        } else {
          // 其他错误，显示提示
          uni.showToast({
            title: '获取用户信息失败',
            icon: 'none'
          })
        }
      }
    }
  }
}
```

## 主题与样式最佳实践

### CSS 变量使用

1. 统一使用主题变量定义颜色
2. 避免硬编码颜色值

```scss
/* 推荐 */
.button {
  background-color: var(--theme-color);
  color: white;
}

/* 不推荐 */
.button {
  background-color: #87ceeb;
  color: white;
}
```

### 响应式设计

```scss
/* 使用 rpx 单位适配不同屏幕 */
.container {
  padding: 20rpx;
  font-size: 28rpx;
}
```

## 性能优化建议

### 图片优化

1. 使用适当的图片格式
2. 压缩图片大小
3. 使用懒加载

```vue
<template>
  <view>
    <!-- 使用 lazy-load 属性 -->
    <image
      src="/static/images/avatar.png"
      lazy-load
      mode="aspectFill"
    />
  </view>
</template>
```

### 列表优化

1. 使用虚拟列表处理长列表
2. 合理使用 v-if 和 v-show

```vue
<template>
  <view>
    <!-- 长列表使用虚拟滚动 -->
    <uv-list>
      <uv-list-item
        v-for="item in visibleItems"
        :key="item.id"
        :title="item.title"
      />
    </uv-list>
  </view>
</template>
```

## 调试与测试

### 开发环境日志

```javascript
// 在开发环境中输出详细日志
// main.js
export function createApp() {
  // #ifdef H5
  if (process.env.NODE_ENV == 'production')
    for (let key in console) console[key] = () => {} // 生产环境清除 log
  // #endif
}
```

### 网络请求调试

```javascript
// common/network/http.js
const responseInterceptor = async function(res) {
  // 输出请求信息, 方便 app 调试
  // #ifndef APP
  console.groupCollapsed(reqConf.url.replace(baseUrl, ''))
  // #endif
  console.log('REQ URL', reqConf.url);
  console.log('REQ HEADER', reqConf.header);
  console.log('REQ DATA', reqConf.data);
  console.log('RES DATA', res.data);
  // #ifndef APP
  console.groupEnd(reqConf.url.replace(baseUrl, ''))
  // #endif
}
```

通过遵循这些最佳实践，可以提升代码质量、开发效率和用户体验。