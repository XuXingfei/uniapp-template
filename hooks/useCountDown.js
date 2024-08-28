import { countDown } from '@/uni_modules/x-utils/index.js'
import { onUnmounted, ref } from 'vue'
export const useCountDown = function(formatStr = 'hh:mm:ss') {

    const countDownInfo = ref({})

    let timer

    const start = function(endTime, endCallback) {
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