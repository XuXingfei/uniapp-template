import projectLogo from '@/static/logo.png'

export const isDev = process.env.NODE_ENV == 'development'

// 安全协议
export const protocolSecure = isDev ? false : true

// 域名
export const domain = isDev ? 'localhost:3000' : 'www.xxx.com'

// 请求基础路径
export const baseUrl = `http${protocolSecure ? 's' : ''}://${domain}`

// 静态资源访问路径
export const staticBaseUrl = `http${protocolSecure ? 's' : ''}://${domain}`

// webSokcet 连接路径
export const socketUrl = `ws${protocolSecure ? 's' : ''}://${domain}/api/socket?token=`

// 文件上传路径
export const uploadUrl = baseUrl + '/api/upload'

// 请求超时时间
export const requestTimeout = 1000 * 10

// 上传文件超时时间
export const uploadTimeout = 1000 * 60

// 项目 logo
export const logo = projectLogo

// 系统信息
export const sysInfo = uni.getSystemInfoSync()

// 版本号
export const appVersion = sysInfo.appVersion