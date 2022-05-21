import { useState } from 'react'
import { Popconfirm, Table, Button, message } from 'antd'
import { userService } from '@api/service'
import { IAddUser, ITableData, IUserList } from './types'
import { format } from '../../utils'

interface IData extends IAddUser {
  id: number
}

interface IProps {
  getDtaList: () => void
  tableData: ITableData
  onPageChange: (page: IPage) => void
  toogleModal: (type: number, visible: boolean, data?: IData) => void
}

export const List = (props: IProps) => {
  const [loading, setLoading] = useState(false)
  const columns = [
    {
      title: 'id',
      dataIndex: 'id'
    },
    {
      title: '用户名称',
      dataIndex: 'username'
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      render: (text:string) => <span>{format(new Date(text))}</span>
    },
    {
      title: '修改时间',
      dataIndex: 'updated_at',
      render: (text:string) => <span>{format(new Date(text))}</span>
    },
    {
      title: '备注',
      dataIndex: 'admin',
      render: (text: number) => <span>{text ? '超级管理员' : '管理员'}</span>
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'operate',
      render: (text: string, record: IUserList) => {
        return (
          <>
            <Popconfirm
              title="确认删除？"
              onConfirm={() => deleteItem(record)}
              onCancel={() => { }}
              okButtonProps={{ loading }}
              okText="是"
              cancelText="否"
            >
              <Button
                danger
                size="small"
              >
                删除
              </Button>
            </Popconfirm>
            <Button
              style={{ marginLeft: '8px' }}
              size="small"
              onClick={() => props.toogleModal(1, true, record)}
            >
              编辑
            </Button>
          </>
        )
      }
    }
  ]

  /** 删除 */
  async function deleteItem (record: IUserList) {
    setLoading(true)
    const [err, res] = await userService.delUser(record.id)
    setLoading(false)
    if (err) return message.error(err.message)
    const { errorCode, message: msg } = res.data
    if (errorCode) {
      props.getDtaList()
      message.success(msg)
    } else {
      message.error(msg)
    }
  }

  const { dataSource, total, current, pageSize } = props.tableData
  return (<Table
    dataSource={dataSource}
    columns={columns}
    rowKey={item => item.id}
    loading={props.tableData.loading}
    pagination={{
      total,
      current,
      pageSize,
      showTotal: () => `共${total}条`,
      onChange: current => props.onPageChange({ current, pageSize })
    }}
  />)
}
