import { useState, useEffect } from 'react'
import { Row, Col, Form, Input, Button } from 'antd'
import { ICommentQuery } from './types'

interface IProps {
  loading: boolean
  onSearch: (val: ICommentQuery) => void
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
  function onFinish (values: ICommentQuery) {
    setLoaing(true)
    props.onSearch(values)
  }

  /** 重置 */
  function reset () {
    form.resetFields()
    props.onSearch(form.getFieldsValue())
  }

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Form.Item name="id" label="评论ID">
              <Input placeholder="请输入评论ID" autoComplete={'off'}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="comment" label="评论内容">
              <Input placeholder="请输入评论内容" autoComplete={'off'}/>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="title" label="文章标题">
              <Input placeholder="请输入文章标题" autoComplete={'off'}/>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
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
