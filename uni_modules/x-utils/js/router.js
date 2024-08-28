const router = {
    $navBackAndEvent: (eventChannel, backData, timeout = 0, delta = 1) => {
        if (timeout) {
            setTimeout(() => {
                eventChannel.emit('backData', backData)
                uni.navigateBack({
                    delta
                })
            }, timeout)
        } else {
            eventChannel.emit('backData', backData)
            uni.navigateBack({
                delta
            })
        }
    },
    $navToAndEvent: (url, data, acceptCallback, timeout = 0) => {
        if (timeout) {
            setTimeout(() => {
                uni.navigateTo({
                    url,
                    events: {
                        backData: acceptCallback
                    },
                    success: ({ eventChannel }) => {
                        if (eventChannel && eventChannel.emit) {
                            eventChannel.emit('navData', data)
                        }
                    },
                    fail: console.log,
                })
            }, timeout)
        } else {
            uni.navigateTo({
                url,
                events: {
                    backData: acceptCallback
                },
                success: ({ eventChannel }) => {
                    if (eventChannel && eventChannel.emit) {
                        eventChannel.emit('navData', data)
                    }
                },
                fail: console.log,
            })
        }
    },
    $navTo: (url, options, timeout = 0) => {
        if (timeout) {
            setTimeout(() => {
                uni.navigateTo({
                    url,
                    fail: console.log,
                    ...options
                })
            }, timeout)
        } else {
            uni.navigateTo({
                url,
                fail: console.log,
                ...options
            })
        }
    },
    $redTo: (url, timeout = 0) => {
        if (timeout) {
            setTimeout(() => {
                uni.redirectTo({
                    url,
                    fail: console.log
                })
            }, timeout)
        } else {
            uni.redirectTo({
                url,
                fail: console.log
            })
        }
    },
    $clearTo: (url, timeout = 0) => {
        if (timeout) {
            setTimeout(() => {
                uni.reLaunch({
                    url,
                    fail: console.log
                })
            }, timeout)
        } else {
            uni.reLaunch({
                url,
                fail: console.log
            })
        }
    },
    $tabTo: (url, timeout = 0) => {
        if (timeout) {
            setTimeout(() => {
                uni.switchTab({
                    url,
                    fail: console.log
                })
            }, timeout)
        } else {
            uni.switchTab({
                url,
                fail: console.log
            })
        }
    },
    $shTab: (url, timeout = 0) => {
        if (timeout) {
            setTimeout(() => {
                uni.switchTab({
                    url,
                    fail: console.log
                })
            }, timeout)
        } else {
            uni.switchTab({
                url,
                fail: console.log
            })
        }
    },
    $navBack: (timeout = 0, delta = 1) => {
        if (timeout) {
            setTimeout(() => {
                uni.navigateBack({
                    delta
                })
            }, timeout)
        } else {
            uni.navigateBack({
                delta
            })
        }
    }
}

export default router