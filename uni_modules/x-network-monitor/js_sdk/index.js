/**
 * 网络状态监听器
 * @param {Object} options - 配置选项
 * @param {Function} options.onConnected - 网络连接时的回调
 * @param {Function} options.onDisconnected - 网络断开时的回调
 * @param {Function} options.onRestore - 从断网恢复时的回调
 * @returns {Function} 返回取消监听的函数
 */
export function createNetworkMonitor(options = {}) {
    const {
        onConnected = null,
            onDisconnected = null,
            onRestore = null
    } = options;

    let previousNetworkState = null;
    let wasDisconnected = false;

    const networkListener = (res) => {
        const currentIsConnected = res.isConnected && res.networkType !== 'none';
        const previousIsConnected = previousNetworkState ? previousNetworkState.isConnected : null;

        // 首次获取状态
        if (previousNetworkState === null) {
            previousNetworkState = {
                networkType: res.networkType,
                isConnected: currentIsConnected
            };

            if (!currentIsConnected) {
                wasDisconnected = true;
                if (onDisconnected) {
                    onDisconnected(res.networkType);
                }
            } else {
                if (onConnected) {
                    onConnected(res.networkType);
                }
            }
            return;
        }

        // 网络状态发生变化
        if (currentIsConnected !== previousIsConnected) {
            if (currentIsConnected) {
                // 从断网恢复
                if (wasDisconnected && onRestore) {
                    onRestore(res.networkType);
                }
                if (onConnected) {
                    onConnected(res.networkType);
                }
                wasDisconnected = false;
            } else {
                // 网络断开
                wasDisconnected = true;
                if (onDisconnected) {
                    onDisconnected(res.networkType);
                }
            }
        }

        // 更新状态记录
        previousNetworkState = {
            networkType: res.networkType,
            isConnected: currentIsConnected
        };
    };

    // 开始监听
    uni.onNetworkStatusChange(networkListener);

    // 获取初始网络状态
    uni.getNetworkType({
        success: (res) => {
            networkListener({
                networkType: res.networkType,
                isConnected: res.networkType && res.networkType !== 'none'
            });
        }
    });

    // 返回取消监听的函数
    return () => {
        uni.offNetworkStatusChange(networkListener);
    };
}