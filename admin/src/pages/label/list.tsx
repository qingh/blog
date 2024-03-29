import { Fragment, useState, useEffect } from 'react'
import { Popconfirm, Table, Button, message } from 'antd'
import { articleService, labelService } from '@api/service'
import { IAddLabel, ITableData, ILabelList } from './types'
import { format } from '@utils/index'

interface IData extends IAddLabel {
  id: number
  label: string
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
      title: '分类名称',
      dataIndex: 'label'
    },
    {
      title: '创建人',
      dataIndex: 'author'
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      render: (text:string) => <span>{format(new Date(text))}</span>
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      render: (text:string) => <span>{format(new Date(text))}</span>
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'operate',
      render: (text: string, record: ILabelList) => (
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
  ]

  /** 删除分类 */
  async function deleteItem (record: ILabelList) {
    setLoading(true)
    const [err, res] = await labelService.delLabel(record.id)
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
