import { MyWebSocket, Message } from '@/uni_modules/x-web-socket/js_sdk/index.js'

// 创建 webSocket 实例, 调用初始化方法连接到服务器 webSocket.init(options)
export const webSocket = new MyWebSocket((message) => {
    console.log('收到消息 ------ ', message);
    uni.$emit(message.event, message.data)
}, false)


// 初始化 （初始化成功才能收发消息）
webSocket.init({
    url: 'ws://localhost:3000/api/socket?token=xxx'
}).then(res => {
    uni.$on('newMessage', data => {
        console.log('收到 newMessage', data);
    })

    // 发送消息
    webSocket.send(new Message('newMessage'))
})

// 关闭连接
webSocket.close()