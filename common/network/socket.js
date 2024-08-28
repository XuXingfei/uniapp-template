import { MyWebSocket } from '@/uni_modules/x-network/js_sdk/webSocket.js'
export { Message } from '@/uni_modules/x-network/js_sdk/webSocket.js'
import { socketUrl } from '@/common/config.js'

// // 初始化完成表示连接成功
// await webSocket.init(socketUrl + 'token')
// // 发送消息
// webSocket.send(new Message('newMessage', '这是一条新消息'))
// // 关闭连接
// webSocket.close()
// // 在接收消息的页面或组件监听
// uni.$on('newMessage', data => {
//     console.log(data)
// })
export const webSocket = new MyWebSocket((message) => {
    console.log('收到消息 ------ ', message);
    // 在需要接收的位置监听
    uni.$emit('newMessage', message)
}, true)