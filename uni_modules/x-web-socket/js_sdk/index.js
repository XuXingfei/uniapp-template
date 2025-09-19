// 定义消息体
export class Message {
    constructor(event, data) {
        this.event = event;
        this.data = data;
    }
}


/**
 * @Desc uni webSocket 封装
 * @Author Xingfei Xu
 * @Email 1824159241@qq.com
 */

export class MyWebSocket {
    options = {} // 连接配置
    onMessage = null // 接收到服务器消息回调
    logInfo = true // 是否打印信息
    connected = false // 是否连接
    socketTask = null // webSocket 实例
    heartbeatTimer = null
    heartbeatIntervalTime = 1000 * 30 // 心跳间隔
    reconnectTimer = null
    reconnectDelayTime = 1000 * 3 // 延迟多久发起重连
    reconnectTimes = 0 // 尝试重连次数
    reconnectMaxTimes = 100 // 最大尝试重连次数
    closeFlag = true // 是否关闭连接

    constructor(onMessage, logInfo = true) {
        if (typeof onMessage != 'function') throw Error('onMessage 应该是一个函数')
        this.onMessage = onMessage
        this.logInfo = logInfo
    }

    /**
     * @Func init
     * @Desc 初始化
     * @param {Object} options 连接参数，详见 https://uniapp.dcloud.net.cn/api/request/websocket.html#connectsocket
     * @return {Promise}
     */
    init(options = {}, type = 'init') {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.socketTask) {
                    await this.close().catch(console.log)
                }

                if (!options.url || typeof options.url != 'string') {
                    reject('options.url 应该是一个字符串')
                    return
                }

                if (typeof options.complete != 'function') options.complete = () => {}

                this.options = options

                this.log(`------ WebSocket 初始化 ------`);

                if (this.connected) return

                this.socketTask = uni.connectSocket(options);

                this.socketTask.onOpen((res) => {
                    this.log(`------ WebSocket 连接成功, type：${type} ------`, res);
                    resolve(res)
                    this.connected = true
                    this.closeFlag = false
                    this.reconnectTimes = 0
                    this.heartbeat()
                })

                this.socketTask.onMessage(({
                    data
                }) => {
                    this.log('------ WebSocket 收到消息 ------', data);
                    try {
                        if (typeof data == 'string') {
                            const message = JSON.parse(data)
                            this.log('------ WebSocket 解析消息 ------', message);
                            if (message.event != 'ping' && message.event != 'pong') {
                                this.onMessage(message)
                            }
                        }
                        if (data instanceof ArrayBuffer) {
                            // 处理 ArrayBuffer 类型
                        }
                    } catch (e) {
                        this.log('------ WebSocket 预处理消息错误 ------', e);
                    }
                })

                this.socketTask.onError((res) => {
                    this.connected = false
                    this.log('------ WebSocket 错误信息 ------', res);
                })

                this.socketTask.onClose(({
                    code,
                    reason
                }) => {
                    this.connected = false
                    this.log('------ WebSocket 连接关闭 ------', code, reason);
                    this.reconnect()
                })
            } catch (e) {
                reject(e)
            }
        })
    }

    // 发送消息
    send(message, verifyFormat = true) {
        if (!this.connected) return Promise.reject('WebSocket 连接未开启')
        if (!(message instanceof Message) && verifyFormat) return Promise.reject('消息格式错误')
        return new Promise((resolve, reject) => {
            this.log('------ WebSocket 发送消息 ------', message);
            this.socketTask.send({
                data: JSON.stringify(message),
                success: resolve,
                fail: reject
            })
        })
    }

    // 心跳
    heartbeat() {
        const msg = new Message('ping')
        this.send(msg).catch(console.log)
        this.heartbeatTimer && clearInterval(this.heartbeatTimer)
        this.heartbeatTimer = setInterval(() => {
            if (this.connected) {
                this.send(msg).catch(console.log)
            } else {
                this.reconnect()
            }
        }, this.heartbeatIntervalTime)
    }

    // 重连
    reconnect() {
        this.reconnectTimer && clearTimeout(this.reconnectTimer)
        if (this.closeFlag || this.reconnectTimes >= this.reconnectMaxTimes) return
        this.reconnectTimer = setTimeout(() => {
            this.log('------ WebSocket 尝试重连 ------');
            this.init(this.options, 'reconnect').catch(console.log)
            this.reconnectTimes++
        }, this.reconnectDelayTime)
    }

    // 关闭连接
    close(options = {}) {
        this.closeFlag = true
        this.heartbeatTimer && clearInterval(this.heartbeatTimer)
        this.reconnectTimer && clearTimeout(this.reconnectTimer)
        if (!this.connected) {
            console.error('WebSocket 连接未开启')
            return Promise.reject('WebSocket 连接未开启')
        }
        return new Promise((resolve, reject) => {
            this.socketTask.close({
                ...options,
                success: resolve,
                fail: reject,
                complete: () => {
                    this.connected = false
                    this.socketTask = null
                }
            })
        })
    }

    log(...args) {
        if (this.logInfo) console.log(...args)
    }
}