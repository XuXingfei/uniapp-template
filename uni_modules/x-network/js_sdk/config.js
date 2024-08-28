export const baseUrl = 'http://192.168.1.158:3000/api'

export const socketUrl = 'ws://192.168.1.158:3000/api/socket?token='

export const uploadUrl = baseUrl + '/common/upload'

// 是否打印信息
// #ifdef APP
export const reqLog = true
// #endif
// #ifndef APP
export const reqLog = false
// #endif