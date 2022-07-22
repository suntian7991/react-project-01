// 将token存入localStorage
const TOKEN_KEY = 'itcast_geek_pc'

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

const setToken = (token) => {
  return localStorage.setItem(TOKEN_KEY, token)
}

const clearToken = () => {
  return localStorage.removeItem(TOKEN_KEY)
}

export { getToken, setToken, clearToken }