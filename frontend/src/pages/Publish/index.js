import { Card, Breadcrumb, Form, Button, Radio, Input, Upload, Space, Select, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { http } from '@/utils'
import { useEffect, useState, useRef } from 'react'
import { useStore } from '@/store'
import { observer } from 'mobx-react-lite'

const { Option } = Select

const Publish = () => {

  // 频道列表
  /*   const [channels, setChannels] = useState([])
    useEffect(() => {
      async function fetchChannels () {
        const res = await http.get('/channels')
        setChannels(res.data.channels)
      }
      fetchChannels()
    }, []) */
  const { channelStore } = useStore()
  const [maxCount, setMaxCount] = useState(1)
  // 1. 声明一个暂存仓库 在整个组件重新渲染的时候ref不受影响 一直在内存中
  const fileListRef = useRef([])

  const [fileList, setFileList] = useState([])
  // 上传成功回调
  const onUploadChange = ({ fileList }) => {
    // console.log(fileList)
    /* setFileList(fileList)
    fileListRef.current = fileList */
    // 关键位置在onUploadChange中重新给image赋值
    const formatList = fileList.map(file => {
      // 做数据处理
      if (file.response) {
        // console.log('file.response.data.url', file.response.data.url)
        return {
          // 图片上传完毕
          url: file.response.data.url

        }
      }
      // 上传中 不做处理
      return file
    })
    setFileList(formatList)
    fileListRef.current = formatList
  }

  const changeType = e => {
    const count = e.target.value
    setMaxCount(count)
    // 从仓库里取对应的图片数量 交给用来渲染图片列表的fileList
    // 这里不能用maxCount来判断，因为拿到的是上一次的值
    if (count === 1) {
      // 单图，只展示第一张
      const firstImg = fileListRef.current[0]
      setFileList(!firstImg ? [] : [firstImg])
    } else if (count === 3) {
      // 三图，展示所有图片
      setFileList(fileListRef.current)
    }
  }


  const navigate = useNavigate()
  const onFinish = async (values) => {
    // 数据的二次处理 重点是处理cover字段
    const { channel_id, content, title, type } = values
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        // images: fileList.map(item => item.response.data.url)
        //不需要这么多数据 在进行数据修改 重新上传图片后 新数据格式与旧的数据格式不一致 item.response.data.url是上传图片才有的response
        // 在onUploadChange中重新赋值
        images: fileList.map(item => item.url)
      }
    }
    // console.log('values', values)
    // console.log('params', params)
    if (articleId) {
      // 编辑
      await http.put(`/mp/articles/${articleId}?draft=false`, params)
    } else {
      // 新增
      await http.post('/mp/articles?draft=false', params)
    }

    navigate('/article')
    message.success(`${articleId ? '更新成功' : '发布成功'}`)
  }
  // 提交表单
  /* const onFinish = async (values) => {
    const { type, ...rest } = values
    const data = {
      ...rest,
      // 注意：接口会按照上传图片数量来决定单图 或 三图
      cover: {
        type,
        images: fileList.map(item => item.url)
      }
    }
    if (articleId) {
      // 编辑
      await http.put(`/mp/articles/${data.id}?draft=false`, data)
    } else {
      // 新增
      await http.post('/mp/articles?draft=false', data)
    }
  } */

  // 编辑功能
  // 文案适配 路由参数id 判断条件
  // 1.通过路由参数拿到文章id
  const [params] = useSearchParams()
  const articleId = params.get('id')
  // console.log('route:', articleId)

  // 数据回填 1.表单回填 2.暂存列表 3.Upload组件fileList
  // Upload回填 1.Upload回显列表 fileList   2. 暂存列表 cacheImgList   3. 图片数量 imgCount 
  // 核心要点：fileList和暂存列表要求格式统一
  const form = useRef(null)//获取表单实例
  useEffect(() => {
    async function getArticle () {
      const res = await http.get(`/mp/articles/${articleId}`)
      // console.log('res:', res)
      const { cover, ...formValue } = res.data
      form.current.setFieldsValue({ ...formValue, type: cover.type })
      // 格式化封面图片数据
      const imageList = cover.images.map(url => ({ url }))
      // 调用setFileList方法回填upload
      setFileList(imageList)
      setMaxCount(cover.type)
      // 暂存图片列表 格式需要和fileList回显列表数据格式保持一致
      fileListRef.current = imageList
    }
    if (articleId) {
      // 拉取数据回显
      getArticle()
      console.log('form:', form.current)
    }
  }, [articleId])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{articleId ? '修改文章' : '发布文章'}</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          // 注意：此处需要为富文本编辑表示的 content 文章内容设置默认值
          initialValues={{ content: '' }}
          // onFinish={(values) => onFinish(values)}
          onFinish={onFinish}
          ref={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 150 }}>

              {/* 数据来自后端接口 放入store */}
              {channelStore.channelList.map(channel => (
                <Option key={channel.id} value={channel.id}>
                  {channel.name}
                </Option>
              ))}
              {/* {channels.map(item => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))} */}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={changeType}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {maxCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                // 上传时是否显示已经上传的所有图片预览列表
                showUploadList
                // 配置要上传的接口地址
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                // 每次文件变化都会执行回调 上传前中后 会执行三次 最后一次才会拿到response中的url
                onChange={onUploadChange}
                maxCount={maxCount}
                multiple={maxCount > 1}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}

          </Form.Item>
          {/* 这里的富文本组件 已经被Form.Item控制
              它的输入内容 会在onFinish回调中收集起来 */}
          {/* FIXME:打不了中文 react18不兼容 中文打字 用2.0beta版本*/}
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }} >
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {articleId ? '修改文章' : '发布文章'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)