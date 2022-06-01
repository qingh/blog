import { useState, useEffect, useContext } from 'react'
import { Modal, Form, Input, Button, message } from 'antd'
import { userService } from '@api/service'
import { userContext } from '@context/userContext'
import { IAddUser } from './types'

interface IData extends IAddUser {
  id: number
}

interface IModal {
  visible: boolean, type: number, data?: IData
}

interface IProps {
  modal: IModal
  toogleModal: (type: number, visible: boolean, data?: { id: number } & IAddUser) => void
  getDtaList: () => void
}
export const OperateModal = (props: IProps) => {
  const [loading, setLoading] = useState(false)
  const [id, setId] = useState(0)
  const { setUser } = useContext(userContext)
  const [form] = Form.useForm()

  useEffect(() => {
    const modal = props.modal
    if (modal.type === 1) {
      if (modal.data) {
        const { id, username } = modal.data
        setId(id)
        form.setFieldsValue({ username })
      }
    }
  }, [props.modal])

  /** 发布 */
  async function addItem (values: IAddUser) {
    setLoading(true)
    const [err, res] = await userService.addUser(values)
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
  async function editItem (values: IAddUser & { id: number }) {
    setLoading(true)
    const [err, res] = await userService.editUser(values)
    setLoading(false)
    if (err) return message.error(err.message)
    const { errorCode, message: msg, data } = res.data

    if (errorCode) {
      // 刷新列表
      props.toogleModal(props.modal.type, false)
      props.getDtaList()
      const user_id = sessionStorage.getItem('id')
      if (user_id !== null) {
        if (Number(user_id) === id) {
          sessionStorage.setItem('user', data.username)
          setUser(data.username)
        }
      }

      return message.success(msg)
    }
    message.error(msg)
  }

  return (
    <Modal
      title={props.modal.type ? '编辑用户' : '创建用户'}
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
        onFinish={(values: IAddUser) => props.modal.type ? editItem({ ...values, id }) : addItem(values)}
      >
        <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input placeholder="请输入用户名" autoComplete={'off'} />
        </Form.Item>
      </Form>
    </Modal>
  )
}
