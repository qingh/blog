import { useState } from 'react'
import { Popconfirm, Table, Button, message } from 'antd'
import { articleService } from '@api/service'
import { IArticle, IAddArticle, ITableData } from './types'
import { ILabel } from '@pages/label/types'
import { format } from '@utils/index'

interface IData extends IAddArticle {
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
      title: '标题',
      dataIndex: 'title'
    },
    {
      title: '分类',
      dataIndex: 'label'
    },
    {
      title: '发布日期',
      dataIndex: 'created_at',
      render: (text:string) => <span>{format(new Date(text))}</span>
    },
    {
      title: '更新日期',
      dataIndex: 'updated_at',
      render: (text:string) => <span>{format(new Date(text))}</span>
    },
    {
      title: '浏览量',
      dataIndex: 'browser'
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '操作',
      dataIndex: 'operate',
      render: (text: string, record: IArticle) => (
        <>
          <Popconfirm
            title="文章被删除后，相关的评论也会被一并删除，请确认？"
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

  /** 删除 */
  async function deleteItem (record: IArticle) {
    setLoading(true)
    const [err, res] = await articleService.delArticle(record.id)
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
