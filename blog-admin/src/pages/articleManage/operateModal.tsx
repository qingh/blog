import { Fragment, useState, useEffect } from 'react'
import { Modal, Row, Col, Form, Input, Table, Button, Select, message } from 'antd'
import { articleService, labelService } from '@api/service'

const { TextArea } = Input
const { Option } = Select

interface IData extends IAddArticle {
  id: number
}

interface IModal {
  visible: boolean, type: number, data?: IData
}

interface IProps {
  labelList: ILabel[]
  modal: IModal
  toogleModal: (type: number, visible: boolean, data?: { id: number } & IAddArticle) => void
  articleList: () => void
}
export const OperateModal = (props: IProps) => {
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(0)
  const [form1] = Form.useForm()

  useEffect(() => {
    const modal = props.modal
    if (modal.type === 1) {
      if (modal.data) {
        const { id, title, label_id, content } = modal.data
        setId(id)
        form1.setFieldsValue({
          title, label_id, content
        })
      }
    }
  }, [props.modal])

  /** 发布文章 */
  async function addArticle (values: IAddArticle) {
    setLoading(true)
    const [err, res] = await articleService.addArticle(values)
    setLoading(false)
    if (err) return message.error(err.message)
    const { errorCode, message: msg } = res.data
    if (errorCode) {
      // 刷新列表
      props.toogleModal(props.modal.type, false)
      props.articleList()
      return message.success(msg)
    }
    message.error(msg)
  }

  /** 编辑文章 */
  async function editArticle (values: IAddArticle & { id: number }) {
    setLoading(true)
    const [err, res] = await articleService.editArticle(values)
    setLoading(false)
    if (err) return message.error(err.message)
    const { errorCode, message: msg } = res.data
    if (errorCode) {
      // 刷新列表
      props.toogleModal(props.modal.type, false)
      props.articleList()
      return message.success(msg)
    }
    message.error(msg)
  }

  return (
    <Modal
      title={props.modal.type ? '编辑文章' : '新建文章'}
      destroyOnClose
      visible={props.modal.visible}
      maskClosable={false}
      onCancel={() => props.toogleModal(props.modal.type, false)}
      footer={[
        <Button
          key="back"
          onClick={() => props.toogleModal(props.modal.type, false)}
        >
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form1.submit()}
        >
          {props.modal.type ? '编辑' : '发布'}
        </Button>
      ]}
    >
      <Form
        layout="vertical"
        form={form1}
        preserve={false}
        onFinish={(values: IAddArticle) => props.modal.type ? editArticle({ ...values, id }) : addArticle(values)}
      >
        <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入文章标题' }]}>
          <Input placeholder="请输入文章标题" />
        </Form.Item>
        <Form.Item label="文章分类" name="label_id" rules={[{ required: true, message: '请选择文章分类' }]}>
          <Select
            showSearch
            placeholder="请选择文章分类"
            optionFilterProp="children"
            filterOption={(input, option) => option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            {props.labelList.map((item: ILabel) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="内容" name="content" rules={[{ required: true, message: '请输入文章内容' }]}>
          {/* 此处应该是一个富文本 */}
          <TextArea rows={4} placeholder="请输入文章内容" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
