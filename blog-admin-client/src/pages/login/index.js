import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import css from './index.scss';
import { userService } from '@api';
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};
const tailLayout = {
  wrapperCol: { offset: 5, span: 19 },
};

export default props => {
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };
  const onFinish = async values => {
    let [err, res] = await userService.login(values);
    if (err) {
      return message.error(err.message);
    }
    let { code, msg } = res.data;
    if (code) {
      props.history.push('/home');
    } else {
      message.error(msg);
    }
  };
  return (
    <div id={css.login}>
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
      {/* <form action="http://localhost:8080/api/v1/login?age=30" method="post" encType="multipart/form-data">
        <input type="text" name="user_name" />
        <input type="file" name="f1" />
        <input type="submit" value="提交" />
      </form> */}
    </div>
  );
};
