# 内置 Hooks 指南

模板提供了一组常用的组合式函数，统一封装状态获取、分页、请求与倒计时代码，可直接从 `@/hooks/` 导入使用。

## useCommon

- 来源：`hooks/useCommon.js`
- 场景：在 `setup` 中快速获取 `proxy`、`Pinia` 仓库以及全局属性。

```javascript
import { useCommon } from '@/hooks/useCommon.js'

const { proxy, userStore, globalStore, gProps } = useCommon()

proxy.$joinUrl('/static/logo.png')
```

`gProps` 与 `proxy` 上的全局属性保持一致，方便在组合式函数中复用。

## usePaging

- 来源：`hooks/usePaging.js`
- 场景：处理分页列表，自动维护 `pageNo`、`pages`、`data` 等字段，并在查询参数变化时触发刷新。

```javascript
import { usePaging } from '@/hooks/usePaging.js'
import { http } from '@/common/network/http.js'
import { reactive } from 'vue'

const query = reactive({ status: 'all' })
const getOrderList = (params) => http.get('/api/order/list', params)
const { pagingInfo, getData, dataUpdated } = usePaging(getOrderList, query)

dataUpdated((res, type) => {
  console.log('数据来源', type, res)
})

// 首次 onMounted 会自动拉取第一页，可调用 getData(false) 加载更多
```

参数说明：

- `api`：返回 Promise 的请求函数，分页参数会自动拼接。
- `params`：普通对象或 `reactive` 对象；若为响应式并开启 `autoGet`，会在 500ms 防抖后自动重置分页。
- `mountedGet` / `autoGet` / `pageSize` / `mode`：可定制初次拉取、自动监听以及数据追加模式。

## useRequest

- 来源：`hooks/useRequest.js`
- 场景：包装单接口请求，统一 Loading 时机，并在参数变更时自动重新拉取。

```javascript
import { useRequest } from '@/hooks/useRequest.js'
import { reactive } from 'vue'

const filters = reactive({ keyword: '' })
const { data, getData } = useRequest('get', '/api/user/info', filters, {})

// 手动刷新
await getData()
```

默认会在 `onMounted` 时调用一次，并在 `filters` 变化时以 500ms 防抖重新请求。

## useCountDown

- 来源：`hooks/useCountDown.js`
- 场景：生成倒计时信息，适用于验证码倒计时、活动结束提醒等。

```javascript
import { useCountDown } from '@/hooks/useCountDown.js'

const { countDownInfo, start, stop } = useCountDown('mm:ss')

start(Date.now() + 60 * 1000, () => {
  uni.showToast({ title: '倒计时结束', icon: 'none' })
})
```

`countDownInfo` 会实时返回 `formatStr` 中的各字段，可结合模板直接渲染。

## 最佳实践

- 在页面级逻辑中优先复用 hooks，减少模板代码重复。
- 扩展或调整 hooks 时，请同步更新注释与文档，确保团队统一认知。
- 搭配 `my-container` 的全局 Loading 使用，可保持一致的用户反馈体验。