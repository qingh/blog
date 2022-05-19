import { Fragment, useState, useEffect } from 'react'
import { Popconfirm, Table, Button, message } from 'antd'
import { commentService } from '@api/service'
import { IComment, ITableData } from './types'

interface IProps {
  getDtaList: () => void
  tableData: ITableData
  onPageChange: (page: IPage) => void
}

export const List = (props: IProps) => {
  const [loading, setLoading] = useState(false)
  const columns = [
    {
      title: 'id',
      dataIndex: 'id'
    },
    {
      title: '文章标题',
      dataIndex: 'title'
    },
    {
      title: '评论内容',
      dataIndex: 'comment'
    },
    {
      title: '昵称',
      dataIndex: 'nick_name'
    },
    {
      title: '评论日期',
      dataIndex: 'created_at'
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'operate',
      render: (text: string, record: IComment) => (
          <Popconfirm
            title="确认删除？"
            onConfirm={() => deleteItem(record)}
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
      )
    }
  ]

  /** 删除 */
  async function deleteItem (record:IComment) {
    setLoading(true)
    const [err, res] = await commentService.delComment(record.id)
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
      total: props.tableData.total,
      current,
      pageSize,
      showTotal: () => `共${total}条`,
      onChange: current => props.onPageChange({ current, pageSize })
    }}
  />)
}
