
import { Layout, Menu, Popconfirm } from 'antd'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import { useStore } from '@/store'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'



const { Header, Sider } = Layout

const GeekLayout = () => {

  const location = useLocation()
  // console.log(location)
  // 这里是当前浏览器上的路径地址
  const selectedKey = location.pathname

  const { userStore, loginStore, channelStore } = useStore()
  // userStore.getUserInfo()只需要在一开始执行一次  使用useEffect函数 传一个空数组作为依赖 为了不报错 加入userStore声明一下
  useEffect(() => {
    userStore.getUserInfo()
    channelStore.loadChannelList()
  }, [userStore, channelStore])

  // 确定登出
  // useNavigate()算是hook函数 不能在mobx的store中使用
  const navigate = useNavigate()
  const onLogout = () => {
    // 退出登录 删除token 跳回登录页
    loginStore.loginOut()
    navigate('/login')
  }

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          {/* 如果不加observer 刷新后用户名就没有了 
          因为UserStore 中 userInfo初始值为空 使用它渲染第一次
          调用异步接口返回数据并更改属于第二次渲染
          如果不加observer，第二次渲染没有连接，无法通知视图 */}
          <span className="user-name">{userStore.userInfo.mobile}</span>
          <span className="user-logout">
            <Popconfirm title="是否确认退出？" okText="退出" cancelText="取消" onConfirm={onLogout}>
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          {/* 高亮原理：selectedKeys === item key */}
          {/* 获取当前激活的path路径 */}
          <Menu
            mode="inline"
            theme="dark"
            //defaultSelectedKeys={['1']}
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.Item icon={<HomeOutlined />} key="/">
              <Link to="/">数据概览</Link>
            </Menu.Item>
            <Menu.Item icon={<DiffOutlined />} key="/article">
              <Link to="/article">内容管理</Link>
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />} key="/publish">
              <Link to="/publish">发布文章</Link>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 放置二级路由出口 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default observer(GeekLayout)