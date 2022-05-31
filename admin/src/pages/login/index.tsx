import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Checkbox, message } from 'antd'
import css from './index.module.less'
import { userService } from '@api/service'
import { ILogin } from '@pages/user/types'
import { useEffect } from 'react'

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 }
}
const tailLayout = {
  wrapperCol: { offset: 5, span: 19 }
}

export const Login = () => {
  const navigate = useNavigate()
  useEffect(() => {
    logout()
  }, [])

  async function logout () {
    const [err, res] = await userService.logut()
    if (err) return message.error(err.message)
    const { errorCode, message: msg } = res.data
    if (errorCode) {
      sessionStorage.clear()
    } else {
      message.error(msg)
    }
  }

  async function onFinish (values: ILogin) {
    const [err, res] = await userService.login(values)
    if (err) return message.error(err.message)
    const { errorCode, message: msg, data } = res.data
    if (errorCode) {
      const { id, user } = data
      sessionStorage.setItem('isLogin', 'true')
      sessionStorage.setItem('id', id)
      sessionStorage.setItem('user', user)
      return navigate('/')
    }
    message.error(msg)
  }
  return (
    <div id={css.login}>
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true, username: 'test', password: '123456' }}
        onFinish={onFinish}
      >
        <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input placeholder="请输入用户名" autoComplete={'off'} />
        </Form.Item>

        <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password placeholder="请输入密码" autoComplete={'off'} />
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
