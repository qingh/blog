import { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Button } from 'antd'
import { IUser, IUserQuery } from '@pages/user/types'

interface IProps {
  loading: boolean
  onSearch: (val: IUserQuery) => void
  toogleModal: (type: number, visible: boolean) => void
}
export const Query = (props: IProps) => {
  const [form] = Form.useForm()
  const [loading, setLoaing] = useState(false)

  useEffect(() => {
    if (!props.loading && loading) {
      setLoaing(false)
    }
  }, [props.loading])

  /** 表单提交 */
  function onFinish (values: IUserQuery) {
    setLoaing(true)
    props.onSearch(values)
  }

  /** 重置 */
  function reset () {
    form.resetFields()
    props.onSearch(form.getFieldsValue())
  }

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Form.Item name="id" label="用户ID">
            <Input placeholder="请输入用户ID" autoComplete={'off'}/>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="username" label="用户名称">
            <Input placeholder="请输入用户名称" autoComplete={'off'}/>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Button
            type="primary"
            onClick={() => props.toogleModal(0, true)}
          >
            创建用户
          </Button>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
        <Button htmlType="button" onClick={reset}>
            重置
          </Button>
          <Button htmlType="submit" type="primary" loading={loading} style={{ marginLeft: '8px' }}>
            查询
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
