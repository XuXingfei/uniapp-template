export * from '@/uni_modules/x-tools/tools/index.js'

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