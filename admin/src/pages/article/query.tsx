import { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Button, Select } from 'antd'
import { IArticleQuery } from './types'
import { ILabel } from '@pages/label/types'
import { IUser } from '@pages/user/types'
const { Option } = Select

interface IProps {
  loading: boolean
  labelList: ILabel[]
  userList: IUser[]
  onSearch: (val: IArticleQuery) => void
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
  function onFinish (values: IArticleQuery) {
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
        <Col span={6}>
          <Form.Item name="id" label="文章ID">
            <Input placeholder="请输入文章ID" autoComplete={'off'}/>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="title" label="文章标题">
            <Input placeholder="请输入文章标题" autoComplete={'off'}/>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="label_id" label="文章分类">
            <Select<string | number, { value: string; children: string }>
              showSearch
              placeholder="请选择分类"
              optionFilterProp="children"
              onChange={value => { }}
              onSearch={value => { }}
              filterOption={(input, option) => option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {props.labelList.map((item: ILabel) => (
                <Option key={item.id} value={item.id}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name="user_id" label="作者">
            <Select<string | number, { value: string; children: string }>
              showSearch
              placeholder="请选择作者"
              optionFilterProp="children"
              filterOption={(input, option) => option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              {props.userList.map((item: IUser) => (
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
            新建文章
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
