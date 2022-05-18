import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Checkbox, message } from 'antd'
import css from './index.module.less'
import { userService } from '@api/service'

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
const tailLayout = {
  wrapperCol: { offset: 5, span: 19 }
}

export const Login = () => {
  const navigate = useNavigate()
  const onFinish = async (values: ILogin) => {
    const [err, res] = await userService.login(values)
    if (err) return message.error(err.message)
    const { errorCode, message: msg } = res.data
    if (errorCode) return navigate('/')
    message.error(msg)
  }
  return (
    <div id={css.login}>
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password placeholder="请输入密码" />
        </Form.Item>

        <Form.Item {...tailLayout} name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
