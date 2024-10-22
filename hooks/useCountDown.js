import { countDown } from '@/uni_modules/x-utils/index.js'
import { onUnmounted, ref } from 'vue'

/**
 * @Func useCountDown
 * @Desc 倒计时
 * @param {String} formatStr 格式化字符串
 * @return {Object} {
        countDownInfo: 倒计时信息
        start: 开始函数(传入结束时间 字符串/时间戳)
        stop: 结束函数
    }
 * @Author Xingfei Xu
 * @Email 1824159241@qq.com
*/
export const useCountDown = function(formatStr = 'hh:mm:ss') {

    const countDownInfo = ref({})

    let timer

    const start = function(endTime, endCallback) {
        stop()
        timer = countDown(endTime, (info, isEnd) => {
            countDownInfo.value = info
            isEnd && endCallback && endCallback()
        }, formatStr)
    }

    const stop = function() {
        timer && clearInterval(timer)
    }

    onUnmounted(stop)

    return {
        countDownInfo,
        start,
        stop
    }
}