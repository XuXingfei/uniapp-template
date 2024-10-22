import { http } from '@/common/network/http.js'
import { useRequest } from '@/hooks/useRequest.js'

export const login = params => http.post('/api/login', params)

export const register = params => http.post('/api/register', params)

export const getCode = params => http.post('/api/getCode', params)

export const forgetPwd = params => http.post('/api/forgetPwd', params)

export const getUserInfo = params => http.get('/api/getUserInfo', params)