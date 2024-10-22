import { ref, watch, isReactive, onMounted } from 'vue'
import { http } from '@/common/network/http.js'


/**
 * @Func useRequest
 * @Desc 网络请求
 * @param {String} method 请求方式(get | post)
 * @param {String} url 请求路径
 * @return {Object} { 
        data: 响应数据
        getData: 获取数据
        dataUpdated: 注册数据改变回调
    }
 * @Author Xingfei Xu
 * @Email 1824159241@qq.com
 */
export const useRequest = function(
    method,
    url,
    params = {},
    initValue = {},
    mountedGet = true,
    autoGet = true
) {
    const data = ref(initValue);

    let update

    const dataUpdated = fun => update = fun

    async function getData(type = 'default') {
        try {
            const res = await http[method](url, params);
            data.value = res;
            if (typeof update == 'function') update(res, type)
            return res;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    let timer;

    if (autoGet && isReactive(params)) {
        watch(params, () => {
            timer && clearTimeout(timer);
            timer = setTimeout(() => getData('watch'), 500);
        });
    }

    if (mountedGet) {
        onMounted(() => getData('mounted'));
    }

    return {
        data,
        getData,
        dataUpdated
    };
};