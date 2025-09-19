## 使用说明

### 1\. 初始化

单独一个文件创建 `MyWebSocket` 实例**(通常单例使用)**, 在需要使用的页面或组件中导入使用

```javascript
import { MyWebSocket } from '@/uni_modules/x-web-socket/js_sdk/index.js'

// onMessage 回调函数，用于处理接收到的消息
export const myWebSocket = new MyWebSocket((message) => {
    console.log('收到消息:', message);
    // 根据 message.event 处理不同类型的消息
    if (message.event === 'welcome') {
        console.log('欢迎消息:', message.data);
    }
}, true); // 第二个参数为是否打印日志，默认为 true
```

### 2\. 连接 WebSocket

通常在登录成功后调用 `init` 方法连接 WebSocket 服务器。

```javascript
myWebSocket.init({
    url: 'ws://your-websocket-server-url', // 你的 WebSocket 服务器地址
    // header: {
    //     'content-type': 'application/json'
    // },
    // protocols: ['protocol1']
}).then(res => {
    console.log('WebSocket 连接成功', res);
}).catch(err => {
    console.error('WebSocket 连接失败', err);
});
```

### 3\. 发送消息

使用 `send` 方法发送消息**(需要成功调用 init 方法后使用)**。消息体需要是 `Message` 类的实例。(可以设置第二个参数为 false 不验证消息体)

```javascript
import { Message } from '@/uni_modules/x-web-socket/js_sdk/index.js'

// 创建一个 Message 实例
const messageToSend = new Message('chat', { content: '你好，服务器！' });

myWebSocket.send(messageToSend).then(() => {
    console.log('消息发送成功');
}).catch(err => {
    console.error('消息发送失败', err);
});

// 如果不验证消息格式，可以设置第二个参数为 false
// myWebSocket.send({ event: 'customEvent', data: 'some data' }, false);
```

### 4\. 关闭连接

当不再需要 WebSocket 连接时，调用 `close` 方法关闭。

```javascript
myWebSocket.close().then(() => {
    console.log('WebSocket 连接已关闭');
}).catch(err => {
    console.error('关闭连接失败', err);
});
```

## API

### `MyWebSocket` 类

#### 构造函数

  * `constructor(onMessage: Function, logInfo: boolean = true)`
      * `onMessage`: (必填) 当接收到服务器消息时的回调函数。
      * `logInfo`: (可选) 是否在控制台打印日志信息，默认为 `true`。

#### 属性

  * `options`: 连接配置，详见 [uni.connectSocket](https://uniapp.dcloud.net.cn/api/request/websocket.html#connectsocket)。
  * `onMessage`: 接收到服务器消息回调函数。
  * `logInfo`: 是否打印信息。
  * `connected`: (只读) WebSocket 连接状态，`true` 表示已连接。
  * `socketTask`: (只读) uni-app 的 WebSocket 实例。

#### 方法

  * `init(options: Object, type: string = 'init'): Promise<any>`

      * 初始化并连接 WebSocket。
      * `options`: 连接参数，详见 [uni.connectSocket](https://uniapp.dcloud.net.cn/api/request/websocket.html#connectsocket)。
      * `type`: (内部使用) 连接类型，默认为 `'init'`。
      * 返回一个 `Promise`，成功时解析连接信息，失败时解析错误信息。

  * `send(message: Message | Object, verifyFormat: boolean = true): Promise<any>`

      * 发送消息到服务器。
      * `message`: 要发送的消息，建议是 `Message` 类的实例。
      * `verifyFormat`: (可选) 是否验证消息格式为 `Message` 实例，默认为 `true`。如果为 `false`，则可以发送任意对象（但会尝试 JSON.stringify）。
      * 返回一个 `Promise`，成功时解析发送成功信息，失败时解析错误信息。

  * `close(options: Object = {}): Promise<any>`

      * 关闭 WebSocket 连接。
      * `options`: 关闭连接的参数，详见 [uni.closeSocket](https://www.google.com/search?q=https://uniapp.dcloud.net.cn/api/request/websocket.html%23closesocket)。
      * 返回一个 `Promise`，成功时解析关闭成功信息，失败时解析错误信息。

### `Message` 类

用于定义发送和接收的消息体结构。

#### 构造函数

  * `constructor(event: string, data: any)`
      * `event`: 消息事件类型（字符串）。
      * `data`: 消息携带的数据（可以是任意类型）。

## 核心功能

  * **自动重连**: 当 WebSocket 连接意外关闭时，会自动尝试重新连接。
  * **心跳检测**: 定期发送心跳消息（ping）以保持连接活跃。
  * **消息格式化**: 提供 `Message` 类规范消息结构，方便消息的发送和解析。
  * **日志输出**: 可选的日志输出功能，方便调试。

## 注意事项

  * 确保 `uni-app` 环境可用。
  * `options.url` 必须是有效的 WebSocket 服务器地址，以 `ws://` 或 `wss://` 开头。
  * 服务器需要能够处理心跳消息（`event: 'ping'` 和 `event: 'pong'`），本库默认忽略 `ping` 和 `pong` 消息。
  * 接收到的消息会尝试进行 JSON 解析，如果服务器发送的不是 JSON 字符串，`onMessage` 可能无法正确处理。



### 插件如果对你有帮助给个好评吧~
