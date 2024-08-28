import pages from '@/pages.json'

const isTabbar = url => {
	const { tabBar } = pages
	return !(!tabBar || !tabBar.list || !tabBar.list.length || tabBar.list.findIndex(i => '/' + i.pagePath == url) == -1)
}

let flag = false // 防止重复添加拦截器
export const initInterceptor = () => {
	if (flag) return
	flag = true
	// #ifdef VUE2
	uni.addInterceptor({
		returnValue(res) {
			if (!(!!res && (typeof res === "object" || typeof res === "function") && typeof res.then === "function")) {
				return res;
			}
			return new Promise((resolve, reject) => {
				res.then((res) => res[0] ? reject(res[0]) : resolve(res[1]));
			});
		},
	});
	// #endif

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