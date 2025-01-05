<script setup>
    import { onLaunch, onError } from '@dcloudio/uni-app'
    import { useCommon } from '@/hooks/useCommon.js'
    import { isLoginExpire } from '@/common/network/utils.js'

    const { gProps, userStore, globalStore } = useCommon()

    const { setToken, setUserInfo } = userStore

    onLaunch(async (e) => {
        console.log('onLaunch', e);
        try {

            // 没有主题切换需求注释掉这两行代码
            globalStore.setTheme(uni.getStorageSync('theme'))
            gProps.setThemeIcon(globalStore.theme, 500)

            const token = uni.getStorageSync('token')

            if (token) {
                setToken(token)
                await setUserInfo()
            } else {
                // 强制登陆
                // gProps.$clearTo('/pages/login')
            }

        } catch (err) {
            console.log('onLaunch error', err);
            const code = err?.data?.code || err?.statusCode
            code && isLoginExpire(code)
        }
    })

    onError((err) => {
        console.log('onError', err);
    })
</script>

<style lang="scss">
    @import '@/uni_modules/x-utils/style/flex.css';
    @import '@/uni_modules/x-utils/style/normalize.css';
    @import '@/uni_modules/x-utils/style/common.scss';

    .container {
        min-height: 100vh;
        padding-bottom: 20rpx;
        background-color: #f7f7f7;
    }

    .navbar_title {
        font-weight: 400;
        font-size: 32rpx;
        color: #1A1A1A;
    }

    .placeholder-class {
        font-weight: 400;
        font-size: 28rpx;
        color: #CCCCCC;
    }
</style>