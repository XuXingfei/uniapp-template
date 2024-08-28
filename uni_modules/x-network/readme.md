# x-network

### 用法说明
#### Http
```js
import { http, uploadFile } from '@/uni_modules/x-network/demo/index.js'

http.get('/common/sysTime', { a: 123 }).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

http.post('/common/sysTime', { a: 321 }).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

// 上传单图
uploadFile.uploadImage({}, ({ uploadTask, filePath }) => {
    // uploadTask 用法参考 uni 官方文档 (https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile)
    console.log(uploadTask, filePath);    
}).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

// 上传多图
uploadFile.uploadImages({}, uploadTasks => {
    // uploadTask 用法参考 uni 官方文档 (https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile)
    console.log(uploadTasks);
}).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

// 上传视频
uploadFile.uploadVideo({}, ({ uploadTask, filePath }) => {
    // uploadTask 用法参考 uni 官方文档 (https://uniapp.dcloud.net.cn/api/request/network-file.html#uploadfile)
    console.log(uploadTask, filePath);
}).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})

```

#### WebSocket
``` js
import { socketUrl } from '@/uni_modules/x-network/demo/config.js'
import { webSocket, Message } from '@/uni_modules/x-network/demo/index.js'
// 初始化完成表示连接成功
await webSocket.init(socketUrl + 'token')
// 发送消息
webSocket.send(new Message('newMessage', '这是一条新消息'))
// 关闭连接
webSocket.close()
// 在接受消息的地方监听
uni.$on('newMessage', data => {
    console.log(data)
})
```

### 拦截器用法参见 uni_modules/x-network/demo/index.js 注释详细(该文件只是一个示例用法，实际使用请根据自己项目进行更改)

### 插件如果对你有帮助给个好评吧~
