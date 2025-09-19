# CacheFile 使用说明文档

## 概述

一个跨平台文件缓存系统，支持微信小程序、APP 和 H5 环境。提供了统一的文件下载、缓存和访问接口，能够有效减少重复下载，提高应用性能。

## 支持平台

- **微信小程序**: 使用文件系统管理器
- **APP**: 使用本地存储
- **H5**: 使用 IndexedDB 存储

## 核心功能

### 1. 文件下载与缓存
- 自动检测文件是否已缓存
- 支持云存储文件下载
- 避免重复下载相同文件
- 提供下载失败重试机制

### 2. 多环境适配
- 自动检测运行环境
- 针对不同平台优化存储策略
- 统一的 API 接口

### 3. 错误处理
- 完善的错误处理机制
- 可配置的重试策略
- 详细的错误日志记录

## 快速开始

### 基本使用

```javascript
import { cacheFile } from '@/uni_modules/x-cacheFile/js_sdk/index.js'

// 获取文件路径（自动下载和缓存）
const filePath = await cacheFile.getFilePathByUrl('https://example.com/image.jpg')

// 检查文件是否存在
const exists = await cacheFile.access(filePath)

// 获取统计信息
const stats = cacheFile.getStats()
console.log('缓存命中率:', stats.hitRate)
```

### 自定义配置

```javascript
import { CacheFile } from '@/uni_modules/x-cacheFile/js_sdk/index.js'

const customCacheFile = new CacheFile({
    retryCount: 5,           // 重试次数
    retryDelay: 2000,        // 重试延迟（毫秒）
    downloadTimeout: 5000,   // 下载超时时间（毫秒）
    getFilePathTimeout: 1000,   // 获取 filePath 超时时间（毫秒）
    onError: (error, info) => {
        console.error('缓存错误:', error, info)
    }
})
```

## API 参考

### 主要方法

#### `getFilePathByUrl(url)`
获取文件本地路径，如果文件不存在则自动下载并缓存。

**参数:**
- `url` (string): 文件 URL

**返回值:**
- Promise<string>: 本地文件路径或 blob URL

**示例:**
```javascript
const imagePath = await cacheFile.getFilePathByUrl('https://example.com/avatar.png')
```

#### `access(path)`
检查文件是否存在于缓存中。

**参数:**
- `path` (string): 文件路径或访问键

**返回值:**
- Promise<boolean>: 文件是否存在

**示例:**
```javascript
const accessKey = cacheFile.makeAccessKey('https://example.com/file.pdf')
const exists = await cacheFile.access(accessKey)
```

#### `downloadFile(url)`
下载文件到本地缓存。

**参数:**
- `url` (string): 文件 URL

**返回值:**
- Promise<string>: 本地文件路径

**示例:**
```javascript
const localPath = await cacheFile.downloadFile('https://example.com/document.pdf')
```

#### `makeAccessKey(url)`
为 URL 生成访问键。

**参数:**
- `url` (string): 文件 URL

**返回值:**
- string: 访问键

**示例:**
```javascript
const key = cacheFile.makeAccessKey('https://example.com/image.jpg')
```

#### `getStats()`
获取缓存统计信息。

**返回值:**
- Object: 统计信息对象

**示例:**
```javascript
const stats = cacheFile.getStats()
console.log('命中次数:', stats.hitCount)
console.log('未命中次数:', stats.missCount)
console.log('错误次数:', stats.errorCount)
console.log('命中率:', stats.hitRate)
```

### 清理方法

#### `revokeObjectURL(key)`
释放特定的 blob URL（仅 H5 环境）。

**参数:**
- `key` (string): 访问键

#### `revokeBlobUrls()`
释放所有 blob URL（仅 H5 环境）。

#### `destroy()`
销毁缓存实例，清理所有资源。

## 环境特定行为

### 微信小程序
- 使用 `wx.env.USER_DATA_PATH` 存储文件
- 利用文件系统管理器进行文件操作
- 文件名通过映射函数生成

### APP 环境
- 使用 `uni.saveFile` 保存文件
- 通过 `uni.getStorage` 管理文件信息
- 自动清理无效文件引用

### H5 环境
- 使用 IndexedDB 存储文件数据
- 创建 blob URL 使用
- 支持数据库连接重连

## 错误处理

### 错误类型

#### `CacheFileError`
自定义错误类型，包含以下属性：
- `message`: 错误消息
- `code`: 错误代码
- `originalError`: 原始错误对象

### 常见错误代码

- `INVALID_PARAM`: 参数错误
- `UNSUPPORTED_ENV`: 不支持的环境
- `DB_INIT_ERROR`: 数据库初始化失败
- `DB_SAVE_ERROR`: 数据库保存失败
- `DOWNLOAD_ERROR`: 下载失败
- `SAVE_TIMEOUT`: 保存超时

### 错误处理示例

```javascript
try {
    const filePath = await cacheFile.getFilePathByUrl(url)
} catch (error) {
    if (error instanceof CacheFileError) {
        console.error('缓存错误:', error.code, error.message)
    } else {
        console.error('未知错误:', error)
    }
}
```

## 配置选项

### 构造函数选项

```javascript
const options = {
    retryCount: 3,              // 重试次数，默认 3
    retryDelay: 1000,           // 重试延迟（毫秒），默认 1000
    downloadTimeout: 5000,      // 下载超时时间（毫秒）
    getFilePathTimeout: 1000,   // 获取 filePath 超时时间（毫秒）
    onError: (error, info) => {
        // 错误处理回调
        console.error('错误:', error)
        console.error('上下文:', info)
    }
}

const cacheFile = new CacheFile(options)
```

## 性能优化

### 1. 避免重复下载
系统会自动检测并发的重复下载请求，确保相同 URL 只下载一次。

### 2. 连接池管理
H5 环境下的 IndexedDB 连接会被复用，减少连接开销。

### 3. 内存管理
- 及时释放不再使用的 blob URL
- 清理过期的 Promise 缓存
- 定期清理无效文件引用

## 最佳实践

### 1. 预加载关键资源
```javascript
// 预加载重要图片
const preloadImages = async (urls) => {
    const promises = urls.map(url => cacheFile.getFilePathByUrl(url))
    await Promise.all(promises)
}
```

### 2. 错误监控
```javascript
const cacheFile = new CacheFile({
    onError: (error, info) => {
        // 发送错误报告到监控服务
        reportError(error, info)
    }
})
```

### 3. 统计分析
```javascript
// 定期收集统计信息
setInterval(() => {
    const stats = cacheFile.getStats()
    console.log('缓存统计:', stats)
}, 60000) // 每分钟记录一次
```

### 4. 资源清理
```javascript
// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
    cacheFile.destroy()
})
```

## 注意事项

1. **云存储兼容性**: 系统会自动处理以 `cloud://` 开头的云存储 URL
2. **并发安全**: 相同文件的并发请求会被合并，避免重复下载
3. **环境检测**: 系统会自动检测运行环境并选择合适的存储策略
4. **错误降级**: 当缓存操作失败时，会降级返回原始 URL
5. **资源管理**: 在 H5 环境中，记得及时释放不再使用的 blob URL

## 故障排除

### 常见问题

1. **IndexedDB 连接失败**
   - 检查浏览器是否支持 IndexedDB
   - 确认没有超出存储配额

2. **文件下载失败**
   - 检查网络连接
   - 验证 URL 有效性
   - 检查跨域设置

3. **文件访问权限**
   - 确认文件路径正确
   - 检查存储权限