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
 * @return {object} {pagingInfo: 请求结果, getData: 请求装载数据方法, dataUpdated: 注册数据改变回调}
 * @Author 海绵宝宝
 * @Date 2023-06-12 12:47:50
 * @LastEditTime 2023-06-12
 */
export function usePaging(api, params = {}, mountedGet = true, autoGet = true, pageSize = 15, mode = 'push') {

    const pagingInfo = ref({
        data: [], // 分页数据
        count: 0, // 总条数
        pages: 0, // 总页数
        pageNo: 0 // 页码
    })


    let update

    const dataUpdated = fun => update = fun

    // reset 是否重置到第一页数据
    async function getData(reset = false, type = 'default') {
        try {
            if (reset) {
                const res = await api({
                    ...params,
                    pageNo: 1,
                    pageSize,
                })

                res.data.forEach(i => i._checked = false)

                res.pageNo = 1

                pagingInfo.value = res

                if (typeof update == 'function') update(res, type)

                return res
            }

            if (pagingInfo.value.pageNo >= pagingInfo.value.pages) return

            const res = await api({
                ...params,
                pageNo: pagingInfo.value.pageNo + 1,
                pageSize
            })

            res.data.forEach(i => i._checked = false)

            res.pageNo = pagingInfo.value.pageNo = pagingInfo.value.pageNo + 1

            pagingInfo.value.data[mode](...res.data)

            if (typeof update == 'function') update(res, type)

            return res

        } catch (error) {
            return Promise.reject(error)
        }
    }

    let timer = null

    if (autoGet && isReactive(params)) {
        watch(params, () => {
            timer && clearTimeout(timer);
            timer = setTimeout(() => getData(true, 'watch'), 500);
        })
    }

    if (mountedGet) {
        onMounted(() => getData(true, 'mounted'));
    }

    return {
        pagingInfo,
        getData,
        dataUpdated
    }
}