import React, { useState, useEffect, Fragment } from 'react'
import { Modal, Row, Col, Form, Input, Table, Button, Select, message } from 'antd'
import { userService } from '@api/service'
const { Option } = Select

export default () => {
  const [dataSource, setDataSource] = useState([])
  const [visible, showModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [count, setCount] = useState(0) // 此state只是为了表格里的按钮loading时能重新渲染
  const [total, setTotal] = useState(0)
  const [id, setId] = useState(0)
  const [current, setCurrent] = useState(1)
  const [type, setType] = useState(0) // 0:新建；1:编辑
  const [queryData, setQueryData] = useState({
    user_id: '',
    username: ''
  })

  const [form1] = Form.useForm()
  const [form2] = Form.useForm()

  const pagesize = 5 // 每页的条数

  useEffect(() => {
    userList()
  }, [])

  const columns = [
    {
      title: 'id',
      dataIndex: 'user_id'
    },
    {
      title: '用户名称',
      dataIndex: 'username'
    },
    {
      title: '创建时间',
      dataIndex: 'created_at'
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'operate',
      render: (text, record) => {
        return (
          <>
            <Button
              danger
              size="small"
              onClick={() => {
                delUser(record)
              }}
              loading={record.loading}
            >
              删除
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button
              size="small"
              onClick={() => {
                setType(1)
                setId(record.user_id)
                showModal(true)
                form2.setFieldsValue({
                  username: record.username
                })
              }}
            >
              编辑
            </Button>
          </>
        )
      }
    }
  ]

  // 查询列表
  const userList = async values => {
    setTableLoading(true)
    for (const key in values) {
      if (typeof values[key] === 'string') {
        values[key] = values[key].trim()
      }
    }
    const [err, res] = await userService.userList({ current: 1, pagesize, ...queryData, ...values })
    setTableLoading(false)
    if (err) {
      return message.error(err.message)
    }
    const { code, msg, data } = res.data
    if (code) {
      data.records.forEach(item => {
        item.loading = false
      })
      setDataSource(data.records)
      setTotal(data.total)
    } else {
      message.error(msg)
    }
  }

  // 创建用户
  const addUser = async values => {
    const [err, res] = await userService.addUser(values)
    setLoading(false)
    if (err) {
      return message.error(err.message)
    }
    const { code, msg } = res.data
    if (code) {
      message.success(msg)
      showModal(false)
      setCurrent(1)
      userList()
    } else {
      message.error(msg)
    }
  }

  // 删除用户
  const delUser = async record => {
    record.loading = true
    setCount(1)
    const [err, res] = await userService.delUser(record.user_id)
    record.loading = false
    setCount(2)
    if (err) {
      return message.error(err.message)
    }
    const { code, msg } = res.data
    if (code) {
      setDataSource(dataSource.filter(item => item.user_id != record.user_id))
      setTotal(total - 1)
    } else {
      message.error(msg)
    }
  }

  // 编辑用户
  const editUser = async values => {
    const [err, res] = await userService.editUser({
      ...values,
      id
    })
    setLoading(false)
    if (err) {
      return message.error(err.message)
    }
    const { code, msg } = res.data
    if (code) {
      showModal(false)
      setCurrent(1)
      userList()
    } else {
      message.error(msg)
    }
  }

  const onChange = (num, val) => {
    console.log(`selected ${num},${val}`)
  }

  const onSearch = (num, val) => {
    console.log('search:', val)
  }

  // 表单提交
  const onFinish = async (num, values) => {
    if (num === 1) {
      // 查询列表
      setCurrent(1)
      userList(values)
    } else {
      // 创建用户 or 编辑用户
      setLoading(true)
      type ? editUser(values) : addUser(values)
    }
  }
  const onReset = () => {
    form1.resetFields()
    setCurrent(1)
    setQueryData({
      user_id: '',
      username: ''
    })
    userList({
      user_id: '',
      username: ''
    })
  }

  return (
    <Fragment>
      <Form
        layout="vertical"
        form={form1}
        onFinish={values => {
          onFinish(1, values)
        }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item name="user_id" label="用户ID">
              <Input
                placeholder="请输入用户ID"
                onChange={event => {
                  setQueryData({
                    ...queryData,
                    user_id: event.target.value
                  })
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="username" label="用户名称">
              <Input
                placeholder="请输入用户名称"
                onChange={event => {
                  setQueryData({
                    ...queryData,
                    username: event.target.value
                  })
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Button
              type="primary"
              onClick={() => {
                setType(0)
                showModal(true)
              }}
            >
              创建用户
            </Button>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Col>
        </Row>
      </Form>
      <br />
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={item => item.user_id}
        loading={tableLoading}
        pagination={{
          total,
          current,
          pageSize: pagesize,
          showTotal () {
            return `共${total}条`
          },
          onChange (cur) {
            setCurrent(cur)
            userList({
              current: cur,
              pagesize
            })
          }
        }}
      />

      {/* 创建用户 or 编辑用户 */}
      <Modal
        title={type ? '编辑用户' : '创建用户'}
        destroyOnClose
        visible={visible}
        maskClosable={false}
        onOk={() => {
          form2.submit()
        }}
        onCancel={() => {
          showModal(false)
        }}
        footer={[
          <Button
            key="back"
            onClick={() => {
              showModal(false)
            }}
          >
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={() => {
              form2.submit()
            }}
          >
            确定
          </Button>
        ]}
      >
        <Form
          layout="vertical"
          form={form2}
          preserve={false}
          onFinish={values => {
            onFinish(2, values)
          }}
        >
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          {/* <Form.Item label="请选择角色" name="label_name" rules={[{ required: true, message: '请选择用户所属角色' }]}> */}
          <Form.Item label="请选择角色" name="label_name">
            <Select
              showSearch
              placeholder="请选择角色"
              optionFilterProp="children"
              onChange={values => {
                onChange(3, values)
              }}
              onSearch={values => {
                onSearch(3, values)
              }}
              filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="tom">Tom</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  )
}
