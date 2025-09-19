# 网络状态监听器使用说明

## 概述

用于监听网络状态变化的工具函数。它能够检测网络连接、断开和恢复状态，并在相应事件发生时执行回调函数。

## 功能特性

- 🌐 实时监听网络状态变化
- 🔄 自动检测网络断开和恢复
- 🎯 提供三种不同的事件回调
- 🚀 轻量级，易于集成

## 安装与导入

```javascript
import { createNetworkMonitor } from '@/uni_modules/x-check-network/js_sdk/index.js'
```

## API 参考

### createNetworkMonitor(options)

创建一个网络状态监听器。

#### 参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| options | Object | {} | 配置选项对象 |
| options.onConnected | Function | null | 网络连接时的回调函数 |
| options.onDisconnected | Function | null | 网络断开时的回调函数 |
| options.onRestore | Function | null | 从断网恢复时的回调函数 |

#### 返回值

- **类型**: Function
- **描述**: 返回一个取消监听的函数，调用该函数可停止网络状态监听

#### 回调函数参数

所有回调函数都会接收一个参数 `networkType`，表示当前的网络类型：

- `wifi` - WiFi 网络
- `2g` - 2G 网络
- `3g` - 3G 网络
- `4g` - 4G 网络
- `5g` - 5G 网络
- `ethernet` - 以太网
- `none` - 无网络连接

## 使用示例

### 基础用法

```javascript
// 创建网络监听器
const stopMonitoring = createNetworkMonitor({
  onConnected: (networkType) => {
    console.log(`网络已连接: ${networkType}`);
  },
  onDisconnected: (networkType) => {
    console.log('网络已断开');
  },
  onRestore: (networkType) => {
    console.log(`网络已恢复: ${networkType}`);
  }
});

// 在适当的时候停止监听
// stopMonitoring();
```

### Vue 组件中使用

```javascript
export default {
  data() {
    return {
      networkStatus: '检测中...',
      stopNetworkMonitor: null
    };
  },
  
  onLoad() {
    this.initNetworkMonitor();
  },
  
  onUnload() {
    // 页面卸载时停止监听
    if (this.stopNetworkMonitor) {
      this.stopNetworkMonitor();
    }
  },
  
  methods: {
    initNetworkMonitor() {
      this.stopNetworkMonitor = createNetworkMonitor({
        onConnected: (networkType) => {
          this.networkStatus = `已连接 (${networkType})`;
          uni.showToast({
            title: '网络已连接',
            icon: 'success'
          });
        },
        
        onDisconnected: () => {
          this.networkStatus = '网络断开';
          uni.showToast({
            title: '网络连接已断开',
            icon: 'none'
          });
        },
        
        onRestore: (networkType) => {
          this.networkStatus = `已恢复 (${networkType})`;
          uni.showToast({
            title: '网络连接已恢复',
            icon: 'success'
          });
          
          // 网络恢复后可以执行一些操作，如重新加载数据
          this.reloadData();
        }
      });
    },
    
    reloadData() {
      // 重新加载数据的逻辑
      console.log('重新加载数据...');
    }
  }
};
```

## 事件区别说明

### onConnected vs onRestore

- **onConnected**: 每次检测到网络连接时都会触发
- **onRestore**: 仅在从断网状态恢复到连网状态时触发

```javascript
// 场景示例：
// 1. 应用启动时有网络 → 触发 onConnected
// 2. 网络断开 → 触发 onDisconnected
// 3. 网络恢复 → 触发 onRestore 和 onConnected
// 4. 切换网络类型(4G→WiFi) → 触发 onConnected
```

## 注意事项

1. **内存管理**: 记得在页面卸载或组件销毁时调用返回的停止函数
2. **初始状态**: 监听器会主动获取初始网络状态
3. **网络类型**: 不同平台对网络类型的支持可能有差异


## 常见问题

### Q: 为什么有时候网络明明是连接的，但是显示断开？

A: 这可能是因为网络类型返回了 'none'，监听器会将此情况判断为断网状态。

### Q: 如何在网络恢复后自动重试请求？

A: 在 `onRestore` 回调中实现重试逻辑，这个回调专门用于处理从断网恢复的场景。

### Q: 可以同时创建多个监听器吗？

A: 可以，但通常一个应用只需要一个全局的网络状态监听器。