# 网络请求使用指南

本项目封装了基于 Promise 风格的网络请求库，支持拦截器、统一 Loading 处理等功能。

## 基础配置

网络请求的基础配置在 `common/config.js` 中定义：

```javascript
// common/config.js
export const baseUrl = 'https://api.example.com' // 基础 URL
export const requestTimeout = 10000 // 请求超时时间（毫秒）
export const uploadTimeout = 30000 // 上传超时时间（毫秒）
```

## 请求封装

网络请求封装在 `common/network/http.js` 中，基于 uni-app 的 `uni.request` API。

### 请求实例

项目导出了两个请求实例：

```javascript
// common/network/http.js
export const http = new Request({ /* 配置 */ }) // 普通请求实例
export const uploadFile = new UploadFile({ /* 配置 */ }) // 文件上传实例
```

## 基本使用

### GET 请求

```javascript
import { http } from '@/common/network/http.js'

// 基本 GET 请求
const getUserInfo = async () => {
  try {
    const userInfo = await http.get('/api/user/info')
    console.log('用户信息:', userInfo)
  } catch (error) {
    console.error('请求失败:', error)
  }
}

// 带参数的 GET 请求
const getUserList = async (page, size) => {
  try {
    const params = { page, size }
    const userList = await http.get('/api/user/list', params)
    console.log('用户列表:', userList)
  } catch (error) {
    console.error('请求失败:', error)
  }
}
```

### POST 请求

```javascript
// 基本 POST 请求
const createUser = async (userData) => {
  try {
    const result = await http.post('/api/user/create', userData)
    console.log('创建成功:', result)
  } catch (error) {
    console.error('创建失败:', error)
  }
}

// 带请求头的 POST 请求
const login = async (loginData) => {
  try {
    const headers = { 'Custom-Header': 'value' }
    const result = await http.post('/api/auth/login', loginData, headers)
    console.log('登录成功:', result)
  } catch (error) {
    console.error('登录失败:', error)
  }
}
```

### 文件上传

```javascript
import { uploadFile } from '@/common/network/http.js'

// 上传文件
const uploadAvatar = async (filePath) => {
  try {
    const result = await uploadFile.uploadFile(filePath)
    console.log('上传成功:', result)
  } catch (error) {
    console.error('上传失败:', error)
  }
}
```

## 拦截器

### 请求拦截器

请求拦截器在 `common/network/http.js` 中定义：

```javascript
const requestInterceptor = async function(options) {
  // 添加 token
  options.header['token'] = uni.getStorageSync('token')

  // 文件大小限制
  if (options.filePath) fileLimit(options)

  // 参数过滤
  if (options.data) paramsFilter(options.data, options)

  // 显示 loading
  if (!excludeLoadingUrl.includes(options.url.replace(baseUrl, ''))) {
    const { setLoading } = useGlobalStore()
    setLoading(true)
    requestLoadingCount++
  }
}
```

### 响应拦截器

响应拦截器处理返回数据和错误：

```javascript
const responseInterceptor = async function(res) {
  const { reqConf, err } = res

  // 隐藏 loading
  if (!excludeLoadingUrl.includes(reqConf.url.replace(baseUrl, ''))) {
    requestLoadingCount--
    if (!requestLoadingCount) {
      const { setLoading } = useGlobalStore()
      setLoading(false)
    }
  }

  if (res.statusCode == 200) {
    // 处理成功响应
    if (res.data.code == 200) {
      dataFactory(res.data.data)
      return res.data.data
    } else {
      // 处理业务错误
      logReqErr(res)
      uni.showToast({
        icon: "none",
        title: res.data.msg || res.data.message || `Error code ${res.data.code || 'none'}`,
        duration: 2000,
      })
      return Promise.reject(res)
    }
  } else {
    // 处理网络错误
    logReqErr(res)
    uni.showToast({
      icon: "none",
      title: "Server error",
      duration: 2000,
    })
    return Promise.reject(res)
  }
}
```

## 统一 Loading 处理

项目实现了统一的 Loading 处理机制：

```javascript
// 在 global store 中管理 loading 状态
const excludeLoadingUrl = ['/api/xxx'] // 不显示 loading 的 url
let requestLoadingCount = 0

// 显示 loading
if (!excludeLoadingUrl.includes(options.url.replace(baseUrl, ''))) {
  const { setLoading } = useGlobalStore()
  setLoading(true)
  requestLoadingCount++
}

// 隐藏 loading
if (!excludeLoadingUrl.includes(reqConf.url.replace(baseUrl, ''))) {
  requestLoadingCount--
  if (!requestLoadingCount) {
    const { setLoading } = useGlobalStore()
    setLoading(false)
  }
}
```

## 错误处理

### 网络错误

网络错误会统一提示"Server error"：

```javascript
uni.showToast({
  icon: "none",
  title: "Server error",
  duration: 2000,
})
```

### 业务错误

业务错误会显示后端返回的错误信息：

```javascript
uni.showToast({
  icon: "none",
  title: res.data.msg || res.data.message || `Error code ${res.data.code || 'none'}`,
  duration: 2000,
})
```

## 最佳实践

1. **统一入口**：所有网络请求都通过封装的 http 实例发起
2. **错误处理**：在业务代码中正确处理 Promise 的 reject 情况
3. **参数校验**：发送请求前对参数进行必要的校验
4. **Loading 控制**：对于不需要显示 Loading 的接口，添加到 excludeLoadingUrl 数组中
5. **请求日志**：开发环境下会输出详细的请求日志，便于调试

通过合理使用网络请求封装，可以提升代码的可维护性和用户体验。