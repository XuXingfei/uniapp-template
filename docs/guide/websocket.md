# WebSocket 使用指南

本项目实现了完整的 WebSocket 功能，包括消息收发、心跳检测和自动重连机制。

## 基础配置

WebSocket 的基础配置在 `common/config.js` 中定义：

```javascript
// common/config.js
export const socketUrl = 'wss://socket.example.com' // WebSocket 服务器地址
```

## 核心实现

WebSocket 核心实现在 `common/network/socket.js` 中：

```javascript
// common/network/socket.js
import { MyWebSocket } from '@/uni_modules/x-network/js_sdk/webSocket.js'
export { Message } from '@/uni_modules/x-network/js_sdk/webSocket.js'

export const webSocket = new MyWebSocket((message) => {
  console.log('收到消息 ------ ', message)
  // 在需要接收的位置监听
  uni.$emit('newMessage', message)
}, true) // true 表示启用心跳检测
```

## 基本使用

### 初始化连接

```javascript
import { webSocket } from '@/common/network/socket.js'

// 初始化 WebSocket 连接
const initWebSocket = async () => {
  try {
    const token = uni.getStorageSync('token')
    await webSocket.init(socketUrl + '?token=' + token)
    console.log('WebSocket 连接成功')
  } catch (error) {
    console.error('WebSocket 连接失败:', error)
  }
}
```

### 发送消息

```javascript
import { webSocket, Message } from '@/common/network/socket.js'

// 发送消息
const sendMessage = (data) => {
  const message = new Message('newMessage', data)
  webSocket.send(message)
}

// 发送不同类型的消息
const sendChatMessage = (content) => {
  const messageData = {
    type: 'chat',
    content: content,
    timestamp: Date.now()
  }
  const message = new Message('chatMessage', messageData)
  webSocket.send(message)
}

const sendHeartbeat = () => {
  const message = new Message('heartbeat', { timestamp: Date.now() })
  webSocket.send(message)
}
```

### 接收消息

```javascript
// 在页面或组件中监听消息
export default {
  onLoad() {
    // 监听新消息
    uni.$on('newMessage', this.handleNewMessage)
  },
  beforeDestroy() {
    // 取消监听
    uni.$off('newMessage', this.handleNewMessage)
  },
  methods: {
    handleNewMessage(message) {
      console.log('收到新消息:', message)
      // 处理消息逻辑
      switch (message.type) {
        case 'chatMessage':
          this.handleChatMessage(message.data)
          break
        case 'notification':
          this.showNotification(message.data)
          break
        default:
          console.log('未知消息类型:', message.type)
      }
    },
    handleChatMessage(data) {
      // 处理聊天消息
      this.messageList.push(data)
    },
    showNotification(data) {
      // 显示通知
      uni.showToast({
        title: data.content,
        icon: 'none'
      })
    }
  }
}
```

## 心跳检测

WebSocket 实现了自动心跳检测机制，确保连接的稳定性

## 自动重连

WebSocket 具备自动重连机制

## 关闭连接

```javascript
// 关闭 WebSocket 连接
const closeWebSocket = () => {
  webSocket.close()
  console.log('WebSocket 连接已关闭')
}
```

## 消息格式

WebSocket 消息采用统一格式：

```javascript
// Message 类定义
class Message {
  constructor(event, data) {
    this.event = event // 消息类型
    this.data = data // 消息数据
  }
}
```

## 最佳实践

1. **连接管理**：在应用启动时初始化连接，在应用退出时关闭连接
2. **消息监听**：在页面加载时注册监听器，在页面销毁时取消监听
3. **错误处理**：正确处理连接失败和重连失败的情况
4. **资源释放**：及时关闭不需要的连接，避免资源浪费
5. **消息类型**：定义清晰的消息类型，便于业务处理

通过合理使用 WebSocket 功能，可以实现实时通信需求，提升用户体验。