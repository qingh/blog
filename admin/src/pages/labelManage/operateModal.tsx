import { useState, useEffect } from 'react'
import { Modal, Form, Input, Button, Select, message } from 'antd'
import { labelService } from '@api/service'
import { IAddLabel } from './types'
import { ILabel } from '@pages/labelManage/types'

interface IData extends IAddLabel {
  id: number
}

interface IModal {
  visible: boolean, type: number, data?: IData
}

interface IProps {
  labelList: ILabel[]
  modal: IModal
  toogleModal: (type: number, visible: boolean, data?: { id: number } & IAddLabel) => void
  getDtaList: () => void
}
export const OperateModal = (props: IProps) => {
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(0)
  const [form] = Form.useForm()

  useEffect(() => {
    const modal = props.modal
    if (modal.type === 1) {
      if (modal.data) {
        const { id, name } = modal.data
        setId(id)
        form.setFieldsValue({ name })
      }
    }
  }, [props.modal])

  /** 发布 */
  async function addItem (values: IAddLabel) {
    setLoading(true)
    const [err, res] = await labelService.addLabel(values)
    setLoading(false)
    if (err) return message.error(err.message)
    const { errorCode, message: msg } = res.data
    if (errorCode) {
      // 刷新列表
      props.toogleModal(props.modal.type, false)
      props.getDtaList()
      return message.success(msg)
    }
    message.error(msg)
  }

  /** 编辑 */
  async function editItem (values: IAddLabel & { id: number }) {
    setLoading(true)
    const [err, res] = await labelService.editLabel(values)
    setLoading(false)
    if (err) return message.error(err.message)
    const { errorCode, message: msg } = res.data
    if (errorCode) {
      // 刷新列表
      props.toogleModal(props.modal.type, false)
      props.getDtaList()
      return message.success(msg)
    }
    message.error(msg)
  }

  return (
    <Modal
      title={props.modal.type ? '编辑标签' : '新建标签'}
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
          onClick={() => form.submit()}
        >
            确定
        </Button>
      ]}
    >
      <Form
        layout="vertical"
        form={form}
        preserve={false}
        onFinish={(values: IAddLabel) => props.modal.type ? editItem({ ...values, id }) : addItem(values)}
      >
        <Form.Item label="标签名称" name="label" rules={[{ required: true, message: '请输入标签名称' }]}>
          <Input placeholder="请输入标签名称" autoComplete={'off'}/>
        </Form.Item>
      </Form>
    </Modal>
  )
}
