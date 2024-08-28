import {
    ref,
    watch,
    isReactive,
    onMounted
} from 'vue'

/**
 * @func usePaging
 * @desc 分页查询
 * @param {Function} api 返回值为Promise的请求方法
 * @param {Object} params reactive | Object
 * @param {Boolean} mountedGet 页面挂载自动获取一次
 * @param {Boolean} autoGet 监听 params 改变自动获取第一页数据
 * @param {Number} pageSize 每一页条数
 * @param {String} mode 加载更多时数据插入的位置 push | unshift (默认 push)
 * @return {object} {pagingInfo: 请求结果, getData: 请求装载数据方法}
 * @Author 海绵宝宝
 * @Date 2023-06-12 12:47:50
 * @LastEditTime 2023-06-12
 */
export function usePaging(api, params = {}, mountedGet = true, autoGet = true, pageSize = 20, mode = 'push') {

    const pagingInfo = ref({
        records: [], // 分页数据
        total: 0, // 总条数
        pages: 0, // 总页数
        pageSize: 0 // 页大小
    })

    // reset 是否重置到第一页数据
    async function getData(reset = false) {
        try {
            if (reset) {
                const res = await api({
                    ...params,
                    recordIndex: 0,
                    pageSize,
                })
                pagingInfo.value = res
                return res
            }

            const res = await api({
                ...params,
                recordIndex: pagingInfo.value.records.length,
                pageSize
            })
            if (pagingInfo.value.records.length) {
                if (mode == 'push')
                    res.records = [...pagingInfo.value.records, ...res.records]
                else
                    res.records = [...res.records, ...pagingInfo.value.records]
            }
            pagingInfo.value = res
            return res

        } catch (error) {
            return Promise.reject(error)
        }
    }

    if (autoGet && isReactive(params)) {
        watch(params, () => getData(true))
    }

    if (mountedGet) {
        onMounted(() => {
            getData(true)
        })
    }

    return {
        pagingInfo,
        getData,
    }
}