import { Card, Form, Input, Button, Checkbox, message } from 'antd'
import logo from '@/assets/logo.png'
//导入样式文件
import './index.scss'
import { useStore } from '@/store'
import { useNavigate } from 'react-router-dom'

function Login () {
  // 获取跳转实例对象
  const navigate = useNavigate()
  const { loginStore } = useStore()
  const onFinish = async (values) => {
    /* // values放置的是所有表单项中用户输入的内容
    console.log("onFinish", values) */

    // 登录 验证码只能用246810 调用的黑马接口
    /* loginStore.login({
      // 注意前端名称和后端对应
      mobile: values.mobile,
      code: values.code
    }) */
    // 获取跳转实例对象
    const { mobile, code } = values

    try {
      // 登录 验证码只能用246810 调用的黑马接口

      await loginStore.login({ mobile, code })
      // 跳转
      navigate('/', { replace: true })
      message.success('登录成功')
    } catch (e) {
      message.error(e.response?.data?.message || '登录失败')
    }
  }

  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* 登录表单 */}
        {/* 子项用到的触发事件 需要在Form里声明 */}
        <Form
          onFinish={onFinish}
          validateTrigger={['onBlur', 'onChange']}
        >
          <Form.Item
            name="mobile"
            rules={[
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号码格式不对',
                validateTrigger: 'onBlur'
              },
              { required: true, message: '请输入手机号' }
            ]}
          >
            {/* placeholder="请输入手机号"配置初始值 */}
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[
              { len: 6, message: '验证码6个字符', validateTrigger: 'onBlur' },
              { required: true, message: '请输入验证码' }
            ]}
          >
            <Input size="large" placeholder="请输入验证码" maxLength={6} />
          </Form.Item>
          <Form.Item
            name="remember" valuePropName="checked"
          >
            <Checkbox className="login-checkbox-label">
              我已阅读并同意「用户协议」和「隐私条款」
            </Checkbox>
          </Form.Item>

          <Form.Item>
            {/* <!-- 渲染Button组件为submit按钮 --> */}
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
export default Login