import pages from '@/pages.json'

// 跳转企业微信客服
export const $toCustomerService = (corpId, url) => {
    // #ifdef MP-WEIXIN
    wx.openCustomerServiceChat({
        extInfo: {
            url
        },
        corpId,
        success(res) {},
        fail: (err) => {
            console.log(err);
            uni.showToast({
                title: err?.errMsg
            })
        }
    })
    // #endif

    // #ifdef APP
    plus.share.getServices(services => {
        const sweixin = services.find(i => i.id === 'weixin')
        if (sweixin) {
            sweixin.openCustomerServiceChat({
                corpid: corpId,
                url,
            }, res => {
                console.log("success", JSON.stringify(res))
            }, err => {
                console.log("error", JSON.stringify(err))
            })
        } else {
            plus.nativeUI.alert('当前环境不支持微信操作!')
        }
    }, function() {
        uni.showToast({ title: "获取服务失败，不支持该操作。" + JSON.stringify(e), icon: 'error' })
    })
    // #endif

    // #ifdef H5
    window.location.href = url
    // #endif
}

export const $isTabBarPage = url => {
    const { tabBar } = pages
    url = url || $getCurrentPagePath()
    return !(!tabBar || !tabBar.list || !tabBar.list.length || tabBar.list.findIndex(i => '/' + i.pagePath == url) == -1)
}

export const $saveImage = async (url, tips = true) => {
    try {
        // #ifdef H5

        const link = document.createElement('a');
        link.href = url;
        link.download = url.substring(url.lastIndexOf('/') + 1);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // #endif

        // #ifndef H5

        const { statusCode, tempFilePath: filePath } = await uni.downloadFile({
            url
        })

        if (statusCode == 200) {
            await uni.saveImageToPhotosAlbum({
                filePath
            })
        } else {
            throw Error('图片下载失败')
        }

        // #endif

        tips && uni.showToast({
            title: '保存成功',
            icon: 'success'
        })
    } catch (e) {
        console.log(e);

        tips && uni.showToast({
            title: '保存失败',
            icon: 'error'
        })
    }
}

export const $pageEvent = function() {
    // #ifdef VUE2
    return this.getOpenerEventChannel()
    // #endif
    // #ifdef VUE3
    console.error('vue3 不支持这种使用方式')
    // #endif
}

export const $object2queryStr = (obj) => {
    if (!obj) return obj
    return Object.keys(obj).reduce((val, key) => {
        return `${val}${key}=${obj[key]}&`
    }, '?').slice(0, -1)
}

export const $getCurrentPagePath = (fullPath = false) => {
    const pages = getCurrentPages()
    if (pages.length === 0) return ''
    const { route, $page } = pages[pages.length - 1]
    return fullPath ? $page.fullPath : '/' + route
}

export const $html2text = (html) => {
    return String(html).replace(/<[^>]+>|&[^;]+;/g, '').replace(/\s+/g, ' ').trim();
}

// 距离当前时间过去多久
export const $timeDiffInNow = (time) => {
    const timeDiffInMilliseconds = Date.now() - new Date(time).getTime();
    const seconds = Math.floor(timeDiffInMilliseconds / 1000);
    if (seconds < 60) {
        return `${seconds}秒`;
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes}分`;
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return `${hours}小时`;
    } else {
        const days = Math.floor(seconds / 86400);
        return `${days}天`;
    }
}

export const $dataMask = (val, start, end) => {
    if (!val) return val
    const arr = String(val).split('')
    end = arr.length - end
    if (start < 0) start = 0
    if (start > end) return val
    for (let i = start; i < end; i++) {
        arr[i] = '*'
    }
    return arr.join('')
}

export const $queryElementRect = function(selector) {
    if (Array.isArray(selector)) return Promise.all(selector.map(i => $queryElementRect.call(this, i)))
    return new Promise(resolve => {
        uni.createSelectorQuery()
            .in(this).select(selector)
            .boundingClientRect(resolve)
            .exec();
    })
}

export const $log = console.log

export const $upx2px = val => uni.upx2px(parseInt(val))

export const $toast = (title, options = { duration: 2000, icon: 'none' }) => uni.showToast({ title, fail: console.log, ...options })

export const $makePhoneCall = phoneNumber => uni.makePhoneCall({ phoneNumber, fail: console.log });

export const $previewImage = (urls, current, options) => uni.previewImage({ urls, current, fail: console.log, ...options });

export const $copy = (str, options) => uni.setClipboardData({ data: String(str), fail: console.log, ...options })

export const $openMap = (lng, lat, name, address, options) => uni.openLocation({ longitude: parseFloat(lng), latitude: parseFloat(lat), name, address, fail: console.log, ...options })

export const $setStorage = (key, value) => uni.setStorageSync(key, value)