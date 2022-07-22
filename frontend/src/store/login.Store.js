// 登录模块
import { makeAutoObservable } from "mobx"
import { http, getToken, setToken, clearToken } from '@/utils'

class LoginStore {
  token = getToken() || ''
  constructor() {
    makeAutoObservable(this)
  }
  // 登录
  login = async ({ mobile, code }) => {
    // 调用登录接口
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile,
      code
    })
    // 存入token
    // console.log(res.data)
    this.token = res.data.token
    // 将token存入localStorage
    setToken(this.token)
  }
  // 退出登录
  loginOut = () => {
    this.token = ''
    // 清除本地token
    clearToken()
  }
}
export default LoginStore