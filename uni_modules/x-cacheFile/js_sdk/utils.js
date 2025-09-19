/**
 * 解析查询字符串，将其转换为键值对数组
 * @param {string} queryString - 查询字符串（不包含问号）
 * @returns {Array<[string, string]>} 键值对数组，每个元素是 [key, value] 格式
 * @example
 * parseQueryString('width=200&height=300&format=webp')
 * // 返回: [['width', '200'], ['height', '300'], ['format', 'webp']]
 */
function parseQueryString(queryString) {
    const params = [];
    if (!queryString) return params;

    const pairs = queryString.split('&');
    for (const pair of pairs) {
        const [key, value = ''] = pair.split('=');
        if (key) {
            // URL 解码
            const decodedKey = decodeURIComponent(key);
            const decodedValue = decodeURIComponent(value);
            params.push([decodedKey, decodedValue]);
        }
    }

    return params;
}

/**
 * 清理字符串，移除或替换不安全的字符，生成适合用作文件名的字符串
 * @param {string} str - 需要清理的字符串
 * @returns {string} 清理后的安全字符串
 * @example
 * sanitizeString('image/resize,w_100')
 * // 返回: 'image_resize_w_100'
 * 
 * @example
 * sanitizeString('___test___')
 * // 返回: 'test'
 */
function sanitizeString(str) {
    if (!str) return '';
    return str
        .replace(/[^a-zA-Z0-9\-_.]/g, '_') // 替换特殊字符
        .replace(/_{2,}/g, '_') // 合并连续下划线
        .replace(/^_+|_+$/g, ''); // 去除首尾下划线
}


/**
 * 根据URL生成映射的文件名，可以将查询参数安全地集成到文件名中
 * @param {string} url - 需要处理的URL字符串
 * @param {Object} [options={}] - 配置选项
 * @param {boolean} [options.includeParams=true] - 是否在文件名中包含查询参数
 * @param {string[]} [options.excludeParams=[]] - 要排除的参数名数组
 * @param {string[]} [options.includeOnlyParams=[]] - 仅包含的参数名数组（优先级高于excludeParams）
 * @param {number} [options.maxLength=255] - 生成文件名的最大长度
 * @param {string} [options.paramSeparator='_'] - 参数之间的分隔符
 * @param {string} [options.keyValueSeparator='-'] - 参数键值对之间的分隔符
 * @param {string} [options.fallbackName='unknown_file'] - 处理失败时的回退文件名
 * @returns {string} 生成的安全文件名
 * @example
 * // 默认行为：包含所有参数
 * generateMappedFileName('https://example.com/photo.jpg?width=200&height=300')
 * // 返回: 'photo_width-200_height-300.jpg'
 * 
 * @example
 * // 排除特定参数
 * generateMappedFileName('https://example.com/file.pdf?download=true&version=v1&temp=123', {
 *   excludeParams: ['temp', 'download']
 * })
 * // 返回: 'file_version-v1.pdf'
 * 
 * @example
 * // 仅包含特定参数
 * generateMappedFileName('https://example.com/image.png?x-oss-process=resize&token=abc', {
 *   includeOnlyParams: ['x-oss-process']
 * })
 * // 返回: 'image_x-oss-process-resize.png'
 */
export const generateMappedFileName = (url, options = {}) => {
    try {
        // 配置选项
        const config = {
            includeParams: options.includeParams !== false, // 默认包含参数
            excludeParams: options.excludeParams || [], // 排除的参数名
            includeOnlyParams: options.includeOnlyParams || [], // 仅包含的参数名
            maxLength: options.maxLength || 255, // 最大文件名长度
            paramSeparator: options.paramSeparator || '_', // 参数分隔符
            keyValueSeparator: options.keyValueSeparator || '-', // 键值分隔符
            fallbackName: options.fallbackName || 'unknown_file',
            ...options
        };

        // 分离 URL 和查询参数
        const [basePath, queryString] = url.split('?');

        // 提取文件名
        const fileName = basePath.split('/').pop() || 'unnamed';
        const dotIndex = fileName.lastIndexOf('.');
        const namePart = dotIndex !== -1 ? fileName.slice(0, dotIndex) : fileName;
        const extPart = dotIndex !== -1 ? fileName.slice(dotIndex) : '';

        // 如果不包含参数或没有查询字符串，直接返回原文件名
        if (!config.includeParams || !queryString) {
            return fileName;
        }

        // 解析查询参数
        const params = parseQueryString(queryString);
        const paramParts = [];

        for (const [key, value] of params) {
            // 检查排除列表
            if (config.excludeParams.includes(key)) {
                continue;
            }

            // 检查包含列表（如果指定了）
            if (config.includeOnlyParams.length > 0 && !config.includeOnlyParams.includes(key)) {
                continue;
            }

            // 清理键和值
            const safeKey = sanitizeString(key);
            const safeValue = sanitizeString(value);

            if (safeKey && safeValue) {
                paramParts.push(`${safeKey}${config.keyValueSeparator}${safeValue}`);
            } else if (safeKey) {
                paramParts.push(safeKey);
            }
        }

        // 生成最终文件名
        let mappedName = fileName;
        if (paramParts.length > 0) {
            const paramString = paramParts.join(config.paramSeparator);
            mappedName = `${namePart}${config.paramSeparator}${paramString}${extPart}`;
        }

        // 处理文件名长度限制
        if (mappedName.length > config.maxLength) {
            const availableLength = config.maxLength - extPart.length;
            mappedName = `${mappedName.slice(0, availableLength)}${extPart}`;
        }

        return mappedName;

    } catch (err) {
        console.error('处理 URL 时出错:', url, err);
        return config.fallbackName;
    }
}
