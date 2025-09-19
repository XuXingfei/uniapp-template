# 工具函数使用指南

本项目提供了一系列实用的工具函数，帮助开发者提升开发效率。

## 位置相关工具

### 获取当前位置

```javascript
import { getLocation } from '@/common/utils/index.js'

// 获取位置信息
const getCurrentLocation = async () => {
  try {
    const location = await getLocation()
    console.log('当前位置:', location)
    // 返回格式:
    // {
    //   longitude: 114.055198,
    //   latitude: 22.520922,
    //   province: "广东省",
    //   city: "深圳市",
    //   area: "福田区"
    // }
  } catch (error) {
    console.error('获取位置失败:', error)
  }
}

// 仅获取经纬度
const getCoordinates = async () => {
  try {
    const location = await getLocation(false) // false 表示不进行逆地理编码
    console.log('坐标:', location)
    // 返回格式:
    // {
    //   longitude: 114.055198,
    //   latitude: 22.520922
    // }
  } catch (error) {
    console.error('获取坐标失败:', error)
  }
}
```

### 选择位置

```javascript
import { chooseLocation } from '@/common/utils/index.js'

// 选择位置
const selectLocation = async () => {
  try {
    const location = await chooseLocation()
    console.log('选择的位置:', location)
    // 返回格式:
    // {
    //   name: "国际西岸商务大厦",
    //   address: "广东省深圳市宝安区海秀路19号",
    //   longitude: 114.036043,
    //   latitude: 22.526018,
    //   province: "广东省",
    //   city: "深圳市",
    //   area: "宝安区"
    // }
  } catch (error) {
    console.error('选择位置失败:', error)
  }
}
```

## 登录相关工具

### 检查登录状态

```javascript
import { hasLogin } from '@/common/utils/index.js'

// 检查是否登录
const checkLoginStatus = () => {
  const isLoggedIn = hasLogin()
  if (isLoggedIn) {
    console.log('用户已登录')
  } else {
    console.log('用户未登录')
  }
}

// 检查登录并显示提示框
const checkLoginWithModal = () => {
  // 会自动弹出登录提示框
  const isLoggedIn = hasLogin(true)
  return isLoggedIn
}
```

### 微信小程序手机号登录

```javascript
import { mpWxPhoneLogin } from '@/common/utils/index.js'

// 微信小程序手机号登录
const loginWithPhone = async (phoneNumberInfo) => {
  try {
    const token = await mpWxPhoneLogin(phoneNumberInfo)
    // 保存 token
    uni.setStorageSync('token', token)
    console.log('登录成功')
  } catch (error) {
    console.error('登录失败:', error)
  }
}
```

## 支付相关工具

### 微信支付

```javascript
import { wxPay } from '@/common/utils/index.js'

// 微信支付
const payOrder = async (orderNo) => {
  try {
    await wxPay(orderNo)
    console.log('支付成功')
    uni.showToast({
      title: '支付成功',
      icon: 'success'
    })
  } catch (error) {
    console.error('支付失败:', error)
    uni.showToast({
      title: '支付失败',
      icon: 'none'
    })
  }
}
```

### 微信小程序支付

```javascript
import { mpWxPay } from '@/common/utils/index.js'

// 微信小程序支付
const payOrderByMP = async (orderNo) => {
  try {
    await mpWxPay(orderNo)
    console.log('支付成功')
    uni.showToast({
      title: '支付成功',
      icon: 'success'
    })
  } catch (error) {
    console.error('支付失败:', error)
    uni.showToast({
      title: '支付失败',
      icon: 'none'
    })
  }
}
```

## 格式化工具

### 金额格式化

```javascript
import { formatAmount } from '@/common/utils/index.js'

// 格式化金额
const formatPrice = (amount) => {
  const formatted = formatAmount(amount)
  console.log('格式化金额:', formatted)
  // 示例:
  // formatAmount(1000) => "1,000"
  // formatAmount(1000000) => "1,000,000"
}

// 在模板中使用
export default {
  data() {
    return {
      price: 1234567
    }
  },
  computed: {
    formattedPrice() {
      return formatAmount(this.price)
    }
  }
}
```

## 主题相关工具

### 设置主题图标

```javascript
import { setThemeIcon } from '@/common/utils/index.js'

// 设置 TabBar 主题图标
const updateThemeIcon = (themeName) => {
  setThemeIcon(themeName)
}

// 延迟设置主题图标
const updateThemeIconWithDelay = (themeName) => {
  setThemeIcon(themeName, 300) // 延迟 300ms
}
```

## 其他实用工具

### 设备判断工具

项目中集成了 `x-tools` 工具库，提供更多实用函数：

```javascript
import { isTabBarPage, isAndroid, isIOS } from '@/uni_modules/x-tools/tools/index.js'

// 判断是否为 TabBar 页面
const checkTabBarPage = () => {
  if (isTabBarPage()) {
    console.log('当前是 TabBar 页面')
  }
}
```

## 工具函数扩展

### 添加自定义工具函数

在 `common/utils/index.js` 中添加自定义工具函数：

```javascript
// common/utils/index.js

// 时间格式化工具
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

// 防抖函数
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
```

## 最佳实践

1. **统一导入**：工具函数统一从 `@/common/utils/index.js` 导入，便于维护
2. **错误处理**：在使用异步工具函数时，正确处理 Promise 的 reject 情况
3. **按需使用**：根据实际需求选择合适的工具函数，避免不必要的依赖
4. **扩展性**：在需要时可以扩展工具函数，但要保持函数的通用性和可复用性
5. **文档注释**：为自定义工具函数添加清晰的注释，说明用途和参数

通过合理使用这些工具函数，可以显著提升开发效率并保证代码质量。