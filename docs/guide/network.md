# 网络请求使用指南

模板基于 `uni.request` 封装了 Promise 风格的网络层，默认集成请求/响应拦截、统一 Loading、错误提示与文件上传能力。

## 基础配置

所有网络相关配置集中在 `common/config.js`：

```javascript
export const baseUrl = 'https://api.example.com' // 基础 URL
export const requestTimeout = 10000 // 普通请求超时（毫秒）
export const uploadTimeout = 30000 // 上传超时（毫秒）
```

根据环境修改 `domain`、`protocolSecure` 等变量即可影响 `baseUrl`、`staticBaseUrl`、`socketUrl` 等派生配置。

## 请求实例

`common/network/http.js` 暴露两类实例：

```javascript
export const http = new Request({ /* 配置 */ })       // 普通请求
export const uploadFile = new UploadFile({ /* 配置 */ }) // 文件上传
```

在业务代码中可直接导入 `http` 发起请求。

## 基本用法

### GET 请求

```javascript
import { http } from '@/common/network/http.js'

const getUserInfo = async () => {
  const userInfo = await http.get('/api/user/info')
  console.log('用户信息', userInfo)
}

const getUserList = async (page, size) => {
  const params = { page, size }
  const list = await http.get('/api/user/list', params)
  console.log(list)
}
```

### POST 请求

```javascript
const createUser = async (payload) => {
  const res = await http.post('/api/user/create', payload)
  console.log('创建成功', res)
}

const login = async (payload) => {
  const headers = { 'Custom-Header': 'value' }
  return http.post('/api/auth/login', payload, headers)
}
```

### 文件上传

```javascript
import { uploadFile } from '@/common/network/http.js'

const uploadAvatar = async (filePath) => {
  const result = await uploadFile.uploadFile(filePath)
  console.log('上传成功', result)
}
```

## 拦截器

### 请求拦截

`requestInterceptor` 会在请求发出前执行：

- 自动附加本地 `token` 到请求头。
- 根据 `excludeLoadingUrl` 判断是否展示全局 Loading。
- 在上传场景下校验文件大小（使用 `fileLimit`）。
- 对参数执行 `paramsFilter`，将 `null/undefined` 统一置空、数组转字符串等。

### 响应拦截

`responseInterceptor` 在请求完成后执行：

- 打印请求/响应日志，便于调试。
- 关闭对应的全局 Loading。
- 将成功响应的 `data` 字段交给 `dataFactory` 处理，再返回业务数据。
- 对业务错误弹出 `uni.showToast`，并返回 `Promise.reject`。
- 对网络错误统一提示 "Server error"，保留详细错误日志。

## 内置拦截行为

`common/network/utils.js` 中还实现了额外的默认逻辑：

- **登录过期自动处理**：收到 `401/402/403` 时会清空 token，触发登录提示，避免在登录页重复弹窗。
- **文件大小限制**：图片默认 0.5 MB、视频 20 MB，超出限制会抛出错误信息，可通过捕获异常自定义提示。
- **Loading 白名单**：将无需 Loading 的接口加入 `excludeLoadingUrl`，可减少频繁请求造成的闪屏。

如需调整，可根据项目需求修改对应函数。

## 错误处理

- **网络错误**：统一提示 "Server error"，同时在控制台输出请求/响应体便于排查。
- **业务错误**：根据后端返回的 `msg` 或 `message` 提示用户，可在业务层通过 `try/catch` 获取详细信息。

## 最佳实践

1. **统一入口**：所有接口集中通过 `http` 发起，便于全局维护。
2. **善用拦截器**：在 `excludeLoadingUrl`、`paramsFilter` 中加入业务约束，减少重复代码。
3. **错误兜底**：业务层应捕获 `Promise.reject`，针对不同错误码给出更友好的处理。
4. **上传策略**：上传大文件前提示用户大小限制，必要时在前端自行压缩或分片。