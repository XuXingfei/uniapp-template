import { http } from '@/common/network/http.js'
import { useRequest, usePost, useGet } from '@/hooks/useRequest.js'

export const config = params => http.get('/api/config', params)

export const mpWxPay = params => http.get('/api/mpWxPay', params)

export const regeo = params => http.get('/api/regeo', params)