import { Link, useNavigate, } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space, Popconfirm } from 'antd'
// 配置中文日期显示
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '@/assets/error.png'
import { http } from '@/utils'
import { useEffect, useState } from 'react'
import { useStore } from '@/store'
import { observer } from 'mobx-react-lite'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  // 频道列表管理 
  /*   //hook里管理数据用useState
  const [channels, setChannels] = useState([])
    // 获取频道列表 调接口用useEffect
      // 函数写在外面 由于有依赖项 每次更新的时候都会重新执行
         // 只要涉及到异步请求的函数 都放到useEffect内部 
      const fetchChannels = async () => {
        const res = await http.get('/channels')
        setChannels(res.data.channels)
      }
      useEffect(() => {
        fetchChannels()
      }, []) */

  /*   useEffect(() => {
      async function fetchChannels () {
        const res = await http.get('/channels')
        setChannels(res.data.channels)
      }
      fetchChannels()
    }, []) */
  // 频道列表管理 
  const { channelStore } = useStore()

  // 文章列表管理
  // 文章列表数据管理 统一管理数据 将来修改给setArticleList传对象
  const [article, setArticleList] = useState({
    list: [],//文章列表
    count: 0 //文章数量
  })

  // 参数管理
  const [params, setParams] = useState({
    page: 1,
    per_page: 5

  })

  // 发送接口请求
  /*   // 函数写在外面 由于有依赖项 每次更新的时候都会重新执行
       // 只要涉及到异步请求的函数 都放到useEffect内部 
    const fetchArticleList = async () => {
      const res = await http.get('/mp/articles', { params })
      const { results, total_count } = res.data
      setArticleList({
        list: results,
        count: total_count
      })
    }
    useEffect(() => {
      fetchArticleList()
    }, [params]) */
  /* 本质区别：
              写在外面每次组件更新都会重新进行函数初始化 这本身就是一次性能消耗
              写在useEffect中 只会在依赖发生变化的时候 函数才会进行重新初始化 避免性能损失   */
  useEffect(() => {
    async function fetchArticleList () {
      const res = await http.get('/mp/articles', { params })
      // 解构赋值只访问一次 不解构每次都会访问数据 浪费性能
      const { results, total_count } = res.data
      setArticleList({
        list: results,
        count: total_count
      })
    }
    fetchArticleList()
  }, [params])


  // 筛选功能 核心：修改依赖项params参数 触发文章接口再次发起
  const onSearch = (values) => {
    const { status, channel_id, date } = values
    // 格式化表单数据
    const _params = {}
    // 格式化status
    _params.status = status
    if (channel_id) {
      _params.channel_id = channel_id
    }
    if (date) {
      // 查看接口数据是什么
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    // 修改params参数 触发接口再次发起 对象的合并是一个整体覆盖
    setParams({
      ...params,//保留之前的筛选和分页
      ..._params
    })
  }
  // 分页
  // TODO:翻页回到页面最上方
  const pageChange = (page) => {
    // 拿到当前页参数 修改params 引起接口更新
    setParams({
      ...params,
      page
    })
  }

  // 删除回调
  const delArticle = async (data) => {
    await http.delete(`/mp/articles/${data.id}`)
    // 更新列表
    setParams({
      ...params,
      // page: 1
    })
    // pageChange()
  }
  const navigate = useNavigate()
  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`)
  }

  const columns = [
    {
      title: '封面',
      // 用dataIndex于拿到的数据进行匹配
      dataIndex: 'cover',
      width: 120,
      /* 比较复杂的模板需要用到render来渲染 */
      render: cover => {
        /* console.log(cover)
        cover是一个对象 不能直接用 cover || img404 */
        return <img src={cover[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: '标题',
      dataIndex: 'title',
      width: 220
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: data => <Tag color="green">审核通过</Tag>
    },
    {
      title: '发布时间',
      dataIndex: 'pubdate'
    },
    {
      title: '阅读数',
      dataIndex: 'read_count'
    },
    {
      title: '评论数',
      dataIndex: 'comment_count'
    },
    {
      title: '点赞数',
      dataIndex: 'like_count'
    },
    {
      title: '操作',
      render: data => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              // onClick={() => history.push(`/home/publish?id=${data.id}`)}
              onClick={() => goPublish(data)}
            />
            <Popconfirm
              title="确认删除该条文章吗?"
              onConfirm={() => delArticle(data)}
              okText="确认"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Space>
        )
      }
    }
  ]



  // 模拟数据 大量数据需要调接口获得
  /*   const data = [
      {
        id: '8218',
        comment_count: 0,
        cover: {
          images: ['http://geek.itheima.net/resources/images/15.jpg'],
        },
        like_count: 0,
        pubdate: '2019-03-11 09:00:00',
        read_count: 2,
        status: 2,
        title: 'wkwebview离线化加载h5资源解决方案'
      }
    ] */

  return (
    <div>
      {/* 筛选区 */}
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form
          onFinish={onSearch}
          initialValues={{ status: null }}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={null}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="频道" name="channel_id">
            <Select
              placeholder="请选择文章频道"
              style={{ width: 150 }}
            >
              {/* 数据来自后端接口 可临时存储也可放入store */}
              {/* {channels.map(channel => (
                <Option key={channel.id} value={channel.id}>
                  {channel.name}
                </Option>
              ))} */}
              {/* <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option> */}
              {/* 数据来自后端接口 放入store */}
              {channelStore.channelList.map(channel => (
                <Option key={channel.id} value={channel.id}>
                  {channel.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性 控制中文显示*/}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* 文章列表区 */}
      {/* 示例代码 */}
      {/* <Card title={`根据筛选条件共查询到 count 条结果：`}>
        <Table rowKey="id" columns={columns} dataSource={data} />
      </Card> */}
      <Card title={`根据筛选条件共查询到 ${article.count} 条结果：`}>
        <Table
          dataSource={article.list}
          columns={columns}
          pagination={{
            position: ['bottomCenter'],
            current: params.page,
            pageSize: params.per_page,
            total: article.count,
            onChange: pageChange
          }}
        />
      </Card>
    </div>
  )
}


export default observer(Article)