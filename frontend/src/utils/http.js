import axios from 'axios'
import { getToken, clearToken } from './token'
import { history } from './history'

const http = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
})
// 添加请求拦截器
http.interceptors.request.use((config) => {
  // if not login add token
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data
}, (error) => {
  console.dir(error)
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (error.response.status === 401) {
    // 删除token
    clearToken()
    // 跳转到登录页
    /* reactRouter默认状态下 不支持在组件之外完成路由跳转需要自己手动实现 
       window.location.href='/login'据弹幕可用 实验不行*/

    history.push('/login')
  }
  return Promise.reject(error)
})

export { http }