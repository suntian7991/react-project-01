// 先把所有的工具函数导出的模块在此导入，然后统一导出

import { http } from './http'
import { getToken, setToken, clearToken } from './token'

export { http, getToken, setToken, clearToken }
