import { useState, useEffect, Fragment } from 'react'
import { message } from 'antd'
import { commentService } from '@api/service'
import { Query } from './query'
import { List } from './list'
import { ICommentQuery, ITableData } from './types'

export default () => {
  const [tableData, setTableData] = useState({
    current: 1, pageSize: 10
  } as ITableData)
  const [queryData, setQueryData] = useState({} as ICommentQuery)

  useEffect(() => {
    getDtaList()
  }, [queryData])

  /** 列表 */
  async function getDtaList () {
    setTableData({
      ...tableData,
      loading: true
    })
    const { current, pageSize } = tableData
    const [err, res] = await commentService.commentList({ current, pageSize, ...queryData })
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

  /** 查询 */
  function onSearch (val: ICommentQuery) {
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
      <Query onSearch={val => onSearch(val)} loading={tableData.loading}/>
      <br />
      <List tableData={tableData} onPageChange={onPageChange} getDtaList={getDtaList}/>
    </Fragment>
  )
}
