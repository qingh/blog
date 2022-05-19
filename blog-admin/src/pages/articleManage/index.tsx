import { Fragment, useState, useEffect } from 'react'
import { message } from 'antd'
import { articleService, userService, labelService } from '@api/service'
import { Query } from './query'
import { List } from './list'
import { OperateModal } from './operateModal'
import { IAddArticle, IArticleQuery, ITableData } from '@pages/articleManage/types'

interface IData extends IAddArticle {
  id: number
}

interface IModal {
  visible: boolean
  type: number
  data?: IData
}

export default () => {
  const [modal, setModal] = useState<IModal>({
    visible: false,
    type: 0// 0:新建；1:编辑
  })
  const [tableData, setTableData] = useState({ current: 1, pageSize: 10 } as ITableData)
  const [queryData, setQueryData] = useState({} as IArticleQuery)
  const [labelList, setLabelList] = useState([])
  const [userList, setUserList] = useState([])

  useEffect(() => {
    labelListAndUserList()
  }, [])

  useEffect(() => {
    getDtaList()
  }, [queryData, tableData.current])

  /** 列表 */
  async function getDtaList () {
    setTableData({
      ...tableData,
      loading: true
    })
    const { current, pageSize } = tableData
    const [err, res] = await articleService.articleList({ current, pageSize, ...queryData })
    if (err) {
      setTableData({
        ...tableData,
        loading: false
      })
      return message.error(err.message)
    }
    const { errorCode, message: msg, data } = res.data
    if (!errorCode) message.error(msg)
    setTableData({
      ...tableData,
      loading: false,
      ...errorCode === 1
        ? {
            total: data.total,
            dataSource: data.records
          }
        : {}
    })
  }

  /* 分类列表和作者列表 */
  async function labelListAndUserList () {
    try {
      const [res1, res2] = await Promise.allSettled([labelService.labelList(), userService.userList()])
      if (res1.status === 'fulfilled') {
        const [err, data] = res1.value
        if (err) {
          message.error(err.message)
        } else {
          const { errorCode, message: msg, data: res } = data.data
          if (errorCode) {
            setLabelList(res.records)
          } else {
            message.error(msg)
          }
        }
      } else {
        message.error(res1.reason)
      }
      if (res2.status === 'fulfilled') {
        const [err, data] = res2.value
        if (err) {
          message.error(err.message)
        } else {
          const { errorCode, message: msg, data: res } = data.data
          if (errorCode) {
            setUserList(res.records)
          } else {
            message.error(msg)
          }
        }
      } else {
        message.error(res2.reason)
      }
    } catch (error) {
      console.log(error)
    }
  }

  /** 新建和编辑弹窗 */
  function toogleModal (type: number, visible: boolean, data?: IData) {
    setModal({ type, visible, data })
  }

  /** 查询 */
  function onSearch (val: IArticleQuery) {
    setQueryData(val)
  }

  /** 分页 */
  function onPageChange (page:IPage) {
    setTableData({
      ...tableData,
      current: page.current,
      pageSize: page.pageSize
    })
  }
  return (
    <Fragment>
      <Query onSearch={val => onSearch(val)} toogleModal={toogleModal} labelList={labelList} userList={userList} loading={tableData.loading} />
      <br />
      <List tableData={tableData} onPageChange={onPageChange} getDtaList={getDtaList} labelList={labelList} toogleModal={toogleModal} />
      <OperateModal modal={modal} toogleModal={toogleModal} getDtaList={getDtaList} labelList={labelList} />
    </Fragment>
  )
}
