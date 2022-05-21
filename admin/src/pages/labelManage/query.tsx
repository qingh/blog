import { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Button, Select, message } from 'antd'
import { IAddLabel, ILabelQuery } from './types'
import { IUser } from '@pages/userManage/types'
import { userService } from '@api/service'
const { Option } = Select

interface IProps {
  loading: boolean
  onSearch: (val: ILabelQuery) => void
  toogleModal: (type: number, visible: boolean) => void
}
export const Query = (props: IProps) => {
  const [form] = Form.useForm()
  const [loading, setLoaing] = useState(false)
  const [userList, setUserList] = useState<IUser[]>([])

  useEffect(() => {
    if (!props.loading && loading) {
      setLoaing(false)
    }
  }, [props.loading])

  useEffect(() => {
    getUserList()
  }, [])

  async function getUserList () {
    const [err, res] = await userService.userList()
    if (err) return message.error(err.message)
    const { errorCode, message: msg, data } = res.data
    if (errorCode) {
      setUserList(data.records)
    } else {
      message.error(msg)
    }
  }

  // 表单提交
  function onFinish (values: ILabelQuery) {
    setLoaing(true)
    props.onSearch(values)
  }

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
    >
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Form.Item name="label_id" label="标签ID">
            <Input placeholder="请输入标签ID" autoComplete={'off'} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="label_name" label="标签名称">
            <Input placeholder="请输入标签名称" autoComplete={'off'} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="author" label="创建人">
            <Select<string | number, { value: string; children: string }>
              showSearch
              placeholder="请输入创建人名称"
              optionFilterProp="children"
              filterOption={(input, option) => option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {userList.map((item: IUser) => (
                <Option key={item.id} value={item.id}>
                  {item.username}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={12}>
          <Button
            type="primary"
            onClick={() => props.toogleModal(0, true)}
          >
            新建标签
          </Button>
        </Col>
        <Col span={12} style={{ textAlign: 'right' }}>
          <Button htmlType="button" onClick={() => form.resetFields()}>
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