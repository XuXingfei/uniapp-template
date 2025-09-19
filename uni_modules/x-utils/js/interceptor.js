import pages from '@/pages.json'
import { promisify } from '@/uni_modules/x-tools/tools/index.js'

const isTabbar = url => {
    const { tabBar } = pages
    return !(!tabBar || !tabBar.list || !tabBar.list.length || tabBar.list.findIndex(i => '/' + i.pagePath == url) == -1)
}

let flag = false // 防止重复添加拦截器
export const initInterceptor = () => {
    if (flag) return
    flag = true

    promisify()

    const routerInterceptor = {
        invoke(args) {
            console.log('url ----->', args.url);
            const url = args.url.split('?')[0]
            const whiteList = []
            if (whiteList.length && (!url || !whiteList.includes(url))) {
                uni.showToast({
                    title: '开发中...',
                    icon: 'none'
                })
                return false
            } else {
                return true
            }
        },
        fail(err) {
            console.log('interceptor-fail', err)
        }
    }

    uni.addInterceptor('navigateTo', routerInterceptor)
    uni.addInterceptor('redirectTo', routerInterceptor)
    uni.addInterceptor('reLaunch', routerInterceptor)
    uni.addInterceptor('switchTab', routerInterceptor)

    const routerCorrect = {
        invoke(args) {
            const url = args.url.split('?')[0]
            if (url == '/') return true
            if (isTabbar(url)) {
                console.log('routerCorrect', url);
                uni.switchTab({
                    url: args.url
                })
                return false
            }
        },
        fail(err) {
            console.log('interceptor-fail', err)
        }
    }
    uni.addInterceptor('navigateTo', routerCorrect)
    uni.addInterceptor('redirectTo', routerCorrect)
    uni.addInterceptor('switchTab', {
        invoke(args) {
            const url = args.url.split('?')[0]
            if (url == '/') return true
            if (isTabbar(url)) return true
            console.log('routerCorrect', url);
            uni.reLaunch({
                url: args.url
            })
            return false
        },
        fail(err) {
            console.log('interceptor-fail', err)
        }
    })
}