export * from '@/uni_modules/x-tools/tools/sugar.js'

export { getCurrentPagePath, isTabBarPage, } from '@/uni_modules/x-tools/tools/index.js'

// 距离当前时间过去多久
export const timeDiffInNow = (time) => {
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