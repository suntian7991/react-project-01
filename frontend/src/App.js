// 导入路由
import { Route, Routes } from 'react-router-dom'
// import { BrowserRouter} from 'react-router-dom'
// 导入样式文件
import './App.css'
// 导入页面组件
/* import Login from './pages/Login'
import Layout from './pages/Layout' */
import Login from '@/pages/Login'
import GeekLayout from '@/pages/Layout'
import { AuthRoute } from '@/components/AuthRoute'
import Publish from './pages/Publish'
import Article from './pages/Article'
import Home from './pages/Home'
import { HistoryRouter, history } from './utils/history'


// 配置路由规则
function App () {
  return (
    <HistoryRouter history={history}>
      {/* 用HistoryRouter替换BrowserRouter */}
      {/* <BrowserRouter> */}
      <div className="App">
        <Routes>
          {/* 需要鉴权的路由 */}
          <Route path="/*" element={
            <AuthRoute>
              <GeekLayout />
            </AuthRoute>
          }>
            {/* 二级路由不加/ */}
            <Route index element={<Home />} />
            <Route path="article" element={<Article />} />
            <Route path="publish" element={<Publish />} />
          </Route>
          {/* 不需要鉴权的路由 */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
      {/* </BrowserRouter> */}
    </HistoryRouter>

  )
}

export default App
