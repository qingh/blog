import { Fragment, useState, useEffect } from 'react'
import { Popconfirm, Table, Button, message } from 'antd'
import { articleService, labelService } from '@api/service'

interface IData extends IAddArticle{
  id: number
}

interface IProps {
  labelList: ILabel[]
  articleList: () => void
  tableData: ITable
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
      dataIndex: 'label_id',
      render: (id: number) => {
        const obj = props.labelList.find(item => item.id === id)
        return <span>{obj?.name}</span>
      }
    },
    {
      title: '发布日期',
      dataIndex: 'created_at'
    },
    {
      title: '更新日期',
      dataIndex: 'updated_at'
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
            title="确认删除？"
            onConfirm={() => delArticle(record)}
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

  /** 删除标签 */
  async function delArticle (record: IArticle) {
    setLoading(true)
    const [err, res] = await articleService.delArticle(record.id)
    setLoading(false)
    if (err) return message.error(err.message)
    const { errorCode, message: msg } = res.data
    if (errorCode) {
      props.articleList()
      message.success(msg)
    } else {
      message.error(msg)
    }
  }

  return (<Table
    dataSource={props.tableData.dataSource}
    columns={columns}
    rowKey={item => item.id}
    loading={props.tableData.loading}
    pagination={{
      total: props.tableData.total,
      // current,
      // pageSize: pagesize,
      showTotal () {
        return `共${props.tableData.total}条`
      },
      onChange (cur) {
        // setCurrent(cur)
        // articleList({
        //   current: cur,
        //   pagesize
        // })
      }
    }}
  />)
}
