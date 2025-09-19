# 全局 Loading 使用指南

本项目实现了自定义的全局 Loading 机制，提供更好的用户体验。

## Loading 状态管理

Loading 状态通过 Pinia 全局状态管理：

```javascript
// stores/global.js
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useGlobalStore = defineStore("global", () => {
    const theme = ref("light");

    function setTheme(payload) {
        theme.value = payload || "light";
        uni.setStorageSync("theme", payload);
    }

    const containerStyle = ref({});

    function setContainerStyle(payload) {
        Object.assign(containerStyle.value, payload);
    }

    const loading = ref(false);

    function setLoading(payload) {
        loading.value = payload;
    }
    return {
        theme,
        setTheme,
        containerStyle,
        setContainerStyle,
        loading,
        setLoading
    };
});
```

## 网络请求中的 Loading

Loading 状态在网络请求中自动管理：

```javascript
// common/network/http.js
const excludeLoadingUrl = ['/api/xxx'] // 不显示 loading 的 url
let requestLoadingCount = 0

// 请求拦截器
const requestInterceptor = async function(options) {
  // 统一 loading 处理
  if (!excludeLoadingUrl.includes(options.url.replace(baseUrl, ''))) {
    const { loading, setLoading } = useGlobalStore()
    setLoading(true)
    requestLoadingCount++
  }
}

// 响应拦截器
const responseInterceptor = async function(res) {
  // 统一 loading 处理
  if (!excludeLoadingUrl.includes(reqConf.url.replace(baseUrl, ''))) {
    requestLoadingCount--
    if (!requestLoadingCount) {
      const { setLoading } = useGlobalStore()
      setLoading(false)
    }
  }
}
```

## 手动控制 Loading

### 显示 Loading

```javascript
import { useGlobalStore } from '@/stores/global.js'

// 显示 Loading
const showLoading = () => {
  const globalStore = useGlobalStore()
  globalStore.setLoading(true)
}

// 在异步操作中使用
const fetchData = async () => {
  showLoading()
  try {
    const result = await someAsyncOperation()
    // 处理结果
  } catch (error) {
    // 处理错误
  } finally {
    hideLoading()
  }
}
```

### 隐藏 Loading

```javascript
import { useGlobalStore } from '@/stores/global.js'

// 隐藏 Loading
const hideLoading = () => {
  const globalStore = useGlobalStore()
  globalStore.setLoading(false)
}
```

## 最佳实践

1. **统一管理**：所有 Loading 状态通过全局状态管理，避免状态不一致
2. **按需显示**：对于不需要显示 Loading 的接口，添加到 excludeLoadingUrl 数组中
3. **及时隐藏**：确保在请求完成后及时隐藏 Loading，避免用户长时间等待
4. **性能优化**：避免频繁切换 Loading 状态，合理使用防抖机制

通过合理使用全局 Loading 机制，可以提升用户体验并保持界面的一致性。
