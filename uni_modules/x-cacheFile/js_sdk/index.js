import { generateMappedFileName } from './utils.js'
import { sleep, promisify } from '@/uni_modules/x-tools/tools/index.js'

promisify()

// 常量定义
const CONSTANTS = {
    DB_NAME: 'CacheFileDB',
    DB_VERSION: 1,
    STORE_NAME: 'files',
    STORAGE_KEY: 'cacheFileInfo',
    SAVING_FLAG: 'saving',
    DEFAULT_RETRY_COUNT: 3,
    DEFAULT_RETRY_DELAY: 1000,
    DOWNLOAD_TIMEOUT: 0,
    GET_FILEPATH_TIMEOUT: 0,
    DB_RECONNECT_DELAY: 1000,
}

// 错误类型定义
export class CacheFileError extends Error {
    constructor(message, code, originalError) {
        super(message)
        this.name = 'CacheFileError'
        this.code = code
        this.originalError = originalError
    }
}

export class CacheFile {

    /**
     * 创建 CacheFile 实例
     * @param {Object} [options={}] - 配置选项
     * @param {number} [options.retryCount=3] - 重试次数，默认为 3
     * @param {number} [options.retryDelay=1000] - 重试延迟时间（毫秒），默认为 1000ms
     * @param {number} [options.downloadTimeout=0] - 下载超时时间（毫秒），默认为 0（无超时）
     * @param {number} [options.getFilePathTimeout=0] - 获取文件路径超时时间（毫秒），默认为 0（无超时）
     * @param {Function|null} [options.onError=null] - 错误处理回调函数
     */
    constructor(options = {}) {
        this.options = {
            retryCount: options.retryCount || CONSTANTS.DEFAULT_RETRY_COUNT,
            retryDelay: options.retryDelay || CONSTANTS.DEFAULT_RETRY_DELAY,
            downloadTimeout: options.downloadTimeout || CONSTANTS.DOWNLOAD_TIMEOUT,
            getFilePathTimeout: options.getFilePathTimeout || CONSTANTS.GET_FILEPATH_TIMEOUT,
            onError: options.onError || null,
            ...options
        }

        this.env = this.detectEnvironment()
        this.downloadPromises = new Map()
        this.h5SavePromises = new Map()
        this.getFilePathPromises = new Map()
        this.blobUrls = new Map()
        this.dbConnected = false
        this.dbConnecting = false
        this.stats = {
            hitCount: 0,
            missCount: 0,
            errorCount: 0
        }

        // 环境相关初始化
        this.initEnvironment()
    }

    detectEnvironment() {
        // #ifdef MP-WEIXIN
        return 'mp'
        // #endif

        // #ifdef APP
        return 'app'
        // #endif

        // #ifdef H5
        return 'h5'
        // #endif

        return 'unknown'
    }

    initEnvironment() {
        switch (this.env) {
            case 'mp':
                this.fileSystemManager = uni.getFileSystemManager()
                break
            case 'app':
                this.appFileInfoInit()
                break
            case 'h5':
                this.initIndexedDB()
                break
        }
    }

    // ============ IndexedDB 相关方法 ============

    async initIndexedDB() {
        if (this.env !== 'h5') return Promise.resolve()

        try {
            await this.connectIndexedDB()
        } catch (error) {
            this.handleError(error, 'initIndexedDB')
            throw new CacheFileError('IndexedDB初始化失败', 'DB_INIT_ERROR', error)
        }
    }

    async connectIndexedDB() {
        if (this.dbConnecting) {
            // 等待当前连接完成
            while (this.dbConnecting) {
                await sleep(100)
            }
            return this.db
        }

        if (this.dbConnected && this.db) {
            return this.db
        }

        this.dbConnecting = true

        try {
            this.db = await new Promise((resolve, reject) => {
                const request = indexedDB.open(CONSTANTS.DB_NAME, CONSTANTS.DB_VERSION)

                request.onerror = () => reject(new Error(`IndexedDB连接失败: ${request.error?.message}`))

                request.onsuccess = () => {
                    const db = request.result
                    this.setupDBErrorHandling(db)
                    resolve(db)
                }

                request.onupgradeneeded = (event) => {
                    const db = event.target.result

                    // 创建对象存储
                    if (!db.objectStoreNames.contains(CONSTANTS.STORE_NAME)) {
                        const store = db.createObjectStore(CONSTANTS.STORE_NAME, { keyPath: 'key' })
                        store.createIndex('url', 'url', { unique: false })
                    }
                }
            })

            this.dbConnected = true
            return this.db
        } finally {
            this.dbConnecting = false
        }
    }

    setupDBErrorHandling(db) {
        // 处理数据库连接断开
        db.onclose = () => {
            console.warn('IndexedDB 连接已关闭')
            this.dbConnected = false
            this.db = null
        }

        db.onerror = (event) => {
            console.error('IndexedDB 错误:', event.target.error)
            this.handleError(event.target.error, 'indexedDB')
        }

        // 处理版本变化
        db.onversionchange = () => {
            console.warn('IndexedDB 版本变化，关闭当前连接')
            this.dbConnected = false
            db.close()
            this.db = null
        }
    }

    async ensureDBConnection() {
        if (!this.dbConnected || !this.db) {
            await this.connectIndexedDB()
        }
        return this.db
    }

    async saveFileToIndexedDB(key, blob) {
        if (this.env !== 'h5') return null

        // 防止并发重复保存
        if (this.h5SavePromises.has(key)) {
            return await this.h5SavePromises.get(key)
        }

        const promise = this.executeSaveToIndexedDB(key, blob)
        this.h5SavePromises.set(key, promise)

        try {
            return await promise
        } finally {
            this.h5SavePromises.delete(key)
        }
    }

    async executeSaveToIndexedDB(key, blob) {
        const maxRetries = this.options.retryCount
        let lastError

        for (let i = 0; i <= maxRetries; i++) {
            try {
                const db = await this.ensureDBConnection()
                const blobUrl = await this.performDBSave(db, key, blob)
                return blobUrl
            } catch (error) {
                lastError = error
                console.warn(`保存到IndexedDB失败 (尝试 ${i + 1}/${maxRetries + 1}):`, error)

                // 如果是连接问题，重置连接状态
                if (error.name === 'InvalidStateError' || error.name === 'UnknownError') {
                    this.dbConnected = false
                    this.db = null
                }

                if (i < maxRetries) {
                    await sleep(this.options.retryDelay)
                }
            }
        }

        throw new CacheFileError('保存到IndexedDB失败', 'DB_SAVE_ERROR', lastError)
    }

    async performDBSave(db, key, blob) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([CONSTANTS.STORE_NAME], 'readwrite')
            const store = transaction.objectStore(CONSTANTS.STORE_NAME)

            const data = {
                key: key,
                blob: blob,
                url: key,
                timestamp: Date.now()
            }

            const request = store.put(data)

            request.onsuccess = () => {
                const blobUrl = URL.createObjectURL(blob)
                this.blobUrls.set(key, blobUrl)
                resolve(blobUrl)
            }

            request.onerror = () => reject(request.error)
            transaction.onerror = () => reject(transaction.error)
        })
    }

    async getFileFromIndexedDB(key) {
        if (this.env !== 'h5') return null

        // 检查是否已存在缓存的 blob URL
        if (this.blobUrls.has(key)) {
            const existingBlobUrl = this.blobUrls.get(key)
            return existingBlobUrl
        }

        const maxRetries = this.options.retryCount
        let lastError

        for (let i = 0; i <= maxRetries; i++) {
            try {
                const db = await this.ensureDBConnection()
                const result = await this.performDBGet(db, key)

                if (result) {
                    const blobUrl = URL.createObjectURL(result.blob)
                    this.blobUrls.set(key, blobUrl) // 缓存新创建的 blob URL
                    return blobUrl
                }

                return null
            } catch (error) {
                lastError = error
                console.warn(`从IndexedDB获取文件失败 (尝试 ${i + 1}/${maxRetries + 1}):`, error)

                // 如果是连接问题，重置连接状态
                if (error.name === 'InvalidStateError' || error.name === 'UnknownError') {
                    this.dbConnected = false
                    this.db = null
                }

                if (i < maxRetries) {
                    await sleep(this.options.retryDelay)
                }
            }
        }

        this.handleError(lastError, 'getFileFromIndexedDB')
        return null
    }

    async performDBGet(db, key) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([CONSTANTS.STORE_NAME], 'readonly')
            const store = transaction.objectStore(CONSTANTS.STORE_NAME)

            const request = store.get(key)
            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
            transaction.onerror = () => reject(transaction.error)
        })
    }

    async checkFileInIndexedDB(key) {
        if (this.env !== 'h5') return false

        try {
            const db = await this.ensureDBConnection()
            return await this.performDBCheck(db, key)
        } catch (error) {
            this.handleError(error, 'checkFileInIndexedDB')
            return false
        }
    }

    async performDBCheck(db, key) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([CONSTANTS.STORE_NAME], 'readonly')
            const store = transaction.objectStore(CONSTANTS.STORE_NAME)

            const request = store.get(key)
            request.onsuccess = () => resolve(!!request.result)
            request.onerror = () => reject(request.error)
        })
    }

    // ============ APP 环境相关方法 ============

    async appFileInfoInit() {
        if (this.env !== 'app') return

        this.appFileInfo = {}

        try {
            const res = await uni.getStorage({ key: CONSTANTS.STORAGE_KEY })

            let cacheFileInfo = res.data || {}

            const { fileList } = await uni.getSavedFileList()
            const filePathList = fileList.map(i => i.filePath)

            // 清理无效的文件引用
            for (const key in cacheFileInfo) {
                if (!filePathList.includes(cacheFileInfo[key])) {
                    delete cacheFileInfo[key]
                }
            }

            this.appFileInfo = cacheFileInfo
        } catch (error) {
            this.handleError(error, 'appFileInfoInit')
        } finally {
            this.appFileInfoInited = true
        }
    }

    setAppFileInfo(key, filePath) {
        if (this.env !== 'app') return

        this.appFileInfo[key] = filePath
        uni.setStorage({
            key: CONSTANTS.STORAGE_KEY,
            data: this.appFileInfo
        }).catch(error => {
            this.handleError(error, 'setAppFileInfo')
        })
    }

    // ============ 通用方法 ============

    makeAccessKey(str) {
        if (typeof str !== 'string') {
            throw new CacheFileError('参数错误: 必须是字符串', 'INVALID_PARAM')
        }

        if (this.env === 'app' || this.env === 'h5') return str

        const filename = generateMappedFileName(str)
        return `${wx.env.USER_DATA_PATH}/${filename}`
    }

    async saveFile(tempFilePath, accessKey) {
        console.log('saveFile', tempFilePath, accessKey)

        try {
            switch (this.env) {
                case 'h5':
                    return await this.saveFileH5(tempFilePath, accessKey)
                case 'mp':
                    return await this.saveFileMP(tempFilePath, accessKey)
                case 'app':
                    return await this.saveFileApp(tempFilePath, accessKey)
                default:
                    throw new CacheFileError('不支持的环境', 'UNSUPPORTED_ENV')
            }
        } catch (error) {
            this.handleError(error, 'saveFile')
            throw error
        }
    }

    async saveFileH5(tempFilePath, accessKey) {
        const response = await fetch(tempFilePath)
        const blob = await response.blob()
        return await this.saveFileToIndexedDB(accessKey, blob)
    }

    async saveFileMP(tempFilePath, accessKey) {
        return new Promise((resolve, reject) => {
            this.fileSystemManager.saveFile({
                tempFilePath,
                filePath: accessKey,
                success: res => resolve(res.savedFilePath),
                fail: reject
            })
        })
    }

    async saveFileApp(tempFilePath, accessKey) {
        const savedFilePath = this.appFileInfo[accessKey]

        // 避免重复保存
        if (savedFilePath) {
            if (savedFilePath === CONSTANTS.SAVING_FLAG) {
                // 等待保存完成
                let retryCount = 0
                const maxRetries = 50 // 最多等待5秒

                while (this.appFileInfo[accessKey] === CONSTANTS.SAVING_FLAG && retryCount < maxRetries) {
                    await sleep(100)
                    retryCount++
                }

                if (this.appFileInfo[accessKey] === CONSTANTS.SAVING_FLAG) {
                    throw new CacheFileError('保存超时', 'SAVE_TIMEOUT')
                }

                return this.appFileInfo[accessKey]
            } else {
                return savedFilePath
            }
        }

        // 标记为正在保存
        this.appFileInfo[accessKey] = CONSTANTS.SAVING_FLAG

        try {
            const result = await new Promise((resolve, reject) => {
                uni.saveFile({
                    tempFilePath,
                    success: res => resolve(res.savedFilePath),
                    fail: reject
                })
            })

            this.setAppFileInfo(accessKey, result)
            return result
        } catch (error) {
            delete this.appFileInfo[accessKey]
            throw error
        }
    }

    async access(path) {
        try {
            switch (this.env) {
                case 'h5':
                    return await this.checkFileInIndexedDB(path)
                case 'mp':
                    return await this.accessMP(path)
                case 'app':
                    return await this.accessApp(path)
                default:
                    return false
            }
        } catch (error) {
            this.handleError(error, 'access')
            return false
        }
    }

    async accessMP(path) {
        return new Promise((resolve) => {
            this.fileSystemManager.access({
                path,
                success: () => resolve(true),
                fail: () => resolve(false)
            })
        })
    }

    async accessApp(filename) {
        while (!this.appFileInfoInited) {
            await sleep(100)
        }

        return !!this.appFileInfo[filename]
    }

    async downloadFile(url) {
        // 使用 Map 避免重复下载
        if (this.downloadPromises.has(url)) {
            return await this.downloadPromises.get(url)
        }

        const promise = this.executeDownload(url)
        this.downloadPromises.set(url, promise)

        try {
            return await promise
        } finally {
            this.downloadPromises.delete(url)
        }
    }

    async executeDownload(url) {
        try {
            const accessKey = this.makeAccessKey(url)
            let downloadUrl = url

            // 兼容云存储
            if (url.startsWith('cloud://')) {
                const { fileList } = await uniCloud.getTempFileURL({
                    fileList: [url]
                })
                downloadUrl = fileList[0].tempFileURL
            }

            console.log('downloadFile', downloadUrl)

            const { downloadTimeout } = this.options

            const downloadTask = uni.downloadFile({
                url: downloadUrl,
                timeout: downloadTimeout > 0 ? downloadTimeout : undefined,
                filePath: this.env === 'mp' ? accessKey : undefined
            })

            const { statusCode, tempFilePath, filePath } = await downloadTask

            console.log('downloadFile result', statusCode, tempFilePath || filePath)

            if (statusCode !== 200) {
                throw new CacheFileError(`下载失败: HTTP ${statusCode}`, 'DOWNLOAD_ERROR')
            }

            if (this.env === 'mp') {
                return tempFilePath || filePath
            }

            return await this.saveFile(tempFilePath, accessKey)
        } catch (error) {
            this.handleError(error, 'downloadFile')
            throw error
        }
    }

    async executeGetFilePathByUrl(url) {
        if (!url) return url

        try {
            const accessKey = this.makeAccessKey(url)

            const exists = await this.access(accessKey)

            if (exists) {
                this.stats.hitCount++
                switch (this.env) {
                    case 'mp':
                        return accessKey
                    case 'app':
                        return this.appFileInfo[accessKey]
                    case 'h5':
                        return await this.getFileFromIndexedDB(accessKey)
                }
            } else {
                this.stats.missCount++
            }

            return await this.downloadFile(url)
        } catch (error) {
            this.handleError(error, 'getFilePathByUrl', { url })
            return url // 降级返回原始URL
        }
    }

    /**
     * @Func getFilePathByUrl
     * @Desc 通过 url 获取文件路径
     * @param {string} url 文件网络地址
     * @param {number} timeout 获取超时时间
     * @return {Promise<string>} 文件路径
     */
    async getFilePathByUrl(url, timeout = 0) {
        if (!url) return url

        if (this.getFilePathPromises.has(url)) {
            return await this.getFilePathPromises.get(url)
        }

        const result = new Promise((r1, r2) => {
            this.executeGetFilePathByUrl(url).then(r1).catch(r2)
            const { getFilePathTimeout } = this.options
            timeout = timeout || getFilePathTimeout
            if (timeout > 0) {
                setTimeout(() => r1(url), timeout)
            }
        })

        this.getFilePathPromises.set(url, result)

        return await result
    }

    // ============ 错误处理和统计 ============

    handleError(error, context, extra = {}) {
        this.stats.errorCount++

        const errorInfo = {
            error: error?.message || error?.errMsg,
            context,
            timestamp: Date.now(),
            env: this.env,
            ...extra
        }

        console.error('CacheFile错误:', errorInfo)

        if (this.options.onError) {
            this.options.onError(error, errorInfo)
        }
    }

    getStats() {
        return {
            ...this.stats,
            hitRate: this.stats.hitCount / (this.stats.hitCount + this.stats.missCount) || 0,
            environment: this.env,
            dbConnected: this.dbConnected,
            cachedBlobUrls: this.blobUrls.size
        }
    }

    // ============ 清理方法 ============

    revokeObjectURL(key) {
        if (this.blobUrls.has(key)) {
            const url = this.blobUrls.get(key)
            URL.revokeObjectURL(url)
            this.blobUrls.delete(key)
        }
    }

    revokeBlobUrls() {
        this.blobUrls.forEach((url, key) => {
            try {
                URL.revokeObjectURL(url)
            } catch (error) {
                // 忽略已经被释放的URL
            }
        })
        this.blobUrls.clear()
    }

    destroy() {
        // 清理 blob URLs
        this.revokeBlobUrls()

        // 清理 IndexedDB 连接
        if (this.db) {
            this.db.close()
            this.db = null
            this.dbConnected = false
        }

        // 清理 Promise 缓存
        this.downloadPromises.clear()
        this.h5SavePromises.clear()
    }
}

export const cacheFile = new CacheFile()