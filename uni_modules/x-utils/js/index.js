export const _typeof = val => Object.prototype.toString.call(val).slice(8, -1).toLowerCase()

export const sleep = ms => new Promise(r => setTimeout(r, ms))

// 将对象值置空
export const initData = function(obj) {
    if (obj instanceof Array) {
        return []
    } else if (obj instanceof Object) {
        for (let key in obj) {
            obj[key] = initData(obj[key])
        }
        return obj
    } else {
        if (typeof obj == 'number') return 0
        return ''
    }
}


/**
 * @desc 倒计时
 * @func countDown
 * @param {String | Number} endTime 结束时间
 * @param {Function} callback 倒计时字符串更新回调函数 (info, isEnd) => {}
 * @param {String} formatStr 倒计时字符串显示格式 d=天, h=时, m=分, s=秒, 默认(hh:mm:ss)
 * @param {Number} refreshRate 更新频率 默认(100)
 * @return {Number} 定时器 id 用于结束倒计时
 */
export const countDown = function(endTime, callback, formatStr = 'hh:mm:ss', refreshRate = 100) {
    const targetTime = new Date(endTime).getTime();
    let cacheStr
    const intervalId = setInterval(function() {

        const currentTime = new Date().getTime();

        const distance = targetTime - currentTime;

        const date = {
            d: Math.floor(distance / (1000 * 60 * 60 * 24)),
            h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            s: Math.floor((distance % (1000 * 60)) / 1000)
        }

        if (!formatStr.includes('d')) {
            date.h += date.d * 24;
            date.d = 0;
        }

        if (!formatStr.includes('h')) {
            date.m += date.h * 60;
            date.h = 0;
        }

        if (!formatStr.includes('m')) {
            date.s += date.m * 60;
            date.m = 0;
        }

        let str = formatStr

        Object.keys(date).forEach(key => {
            if (date[key] < 0) date[key] = 0
            if (str.includes(key)) {
                if (str.includes(key + key)) {
                    str = str.replace(key + key, date[key].toString().padStart(2, 0))
                } else {
                    str = str.replace(key, date[key])
                }
            }
        })
        if (cacheStr != str) {
            cacheStr = str
            if (date.d + date.h + date.m + date.s <= 0) {
                clearInterval(intervalId);
                callback && callback({ str, ...date }, true)
            } else {
                callback && callback({ str, ...date }, false)
            }
        }
    }, refreshRate);
    return intervalId
}


/**
 * @desc 轮询函数(等待结果)
 * @func pollingForResult
 * @param {Function} fun 返回值为 Promise 的函数
 * @param {Array} params fun函数调用的参数列表 ( 例: [param,param] )
 * @param {Function} judgeFun 拿到 fun 函数返回结果 res, 然后调用 judgeFun(res), judgeFun函数应返回 success 或 fail , 没有返回值即忽略本次
 * @param {Number} ms 最快多长时间调用一次 ( 默认 1000ms )
 * @param {Number} timeout 超时时间 ( 默认 1min )
 * @return {Promise} judgeFun 函数返回 success 或 fail 的调用结果
 */
export const pollingForResult = function(fun, params, judgeFun, ms = 1000, timeout = 1000 * 60) {
    // console.time('polling-time')
    console.log('polling-params', arguments);
    let startTime = Date.now()
    let prevCallTime = 0
    if (typeof judgeFun != 'function') throw new Error('judgeFun 参数应为一个 function');
    if (!(params instanceof Array)) params = [params]
    if (ms <= 0) ms = 1
    return new Promise((resolve, reject) => {
        function fun_call() {
            if ((prevCallTime + ms) > Date.now()) {
                setTimeout(() => {
                    fun_call()
                }, (prevCallTime + ms) - Date.now());
                return
            }
            if ((timeout + startTime) < Date.now()) {
                reject('Timeout')
                return
            }
            prevCallTime = Date.now()
            // console.time('fun-call-time')
            fun(...params).then(res => {
                console.log('fun-call-res', res);
                // console.timeEnd('fun-call-time')
                if (judgeFun(res) === 'success') {
                    resolve(res)
                    // console.timeEnd('polling-time')
                } else if (judgeFun(res) === 'fail') {
                    reject(res)
                    // console.timeEnd('polling-time')
                } else {
                    fun_call()
                }
            }).catch(err => {
                console.log('fun-call-err', err);
                // console.timeEnd('fun-call-time')
                fun_call()
            })
        }
        fun_call()
    })
}

/**
 * @desc 轮询函数(获取数据)
 * @func pollingForData
 * @param {Function} fun 返回值为 Promise 的函数
 * @param {Array} params fun函数调用的参数列表 ( 例: [param,param] )
 * @param {Function} callback 每次调用的结果  ( 例: (err, res, count) => {} )
 * @param {Number} ms 最快多长时间调用一次 ( 默认 1000ms )
 * @return {Function} 结束轮询函数
 */
export const pollingForData = function(fun, params, callback, ms = 1000) {
    console.log('polling-params', arguments);
    let prevCallTime = 0
    let endFlag = false
    let count = 0
    if (typeof callback != 'function') throw new Error('callback 参数应为一个 function');
    if (!(params instanceof Array)) params = [params]
    if (ms <= 0) ms = 1

    function fun_call() {
        if (endFlag) return
        if ((prevCallTime + ms) > Date.now()) {
            setTimeout(() => {
                fun_call()
            }, (prevCallTime + ms) - Date.now());
            return
        }
        prevCallTime = Date.now()
        count++
        fun(...params).then(res => {
            callback && callback(null, res, count)
            fun_call()
        }).catch(err => {
            callback && callback(err, null, count)
            fun_call()
        })
    }
    fun_call()
    return () => {
        console.log('polling-end');
        endFlag = true
    }
}