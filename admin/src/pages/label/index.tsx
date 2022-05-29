import { useState, useEffect, Fragment } from 'react'
import { Modal, Form, Input, Button, message } from 'antd'
import { labelService } from '@api/service'
import { Query } from './query'
import { List } from './list'
import { OperateModal } from './operateModal'
import { IAddLabel, ILabelQuery, ITableData } from './types'

interface IData extends IAddLabel {
  id: number
  label:string
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
  const [queryData, setQueryData] = useState({} as ILabelQuery)
  const [labelList, setLabelList] = useState([])

  useEffect(() => {
    getDtaList()
  }, [queryData, tableData.current])

  /** 查询列表 */
  async function getDtaList () {
    setTableData({
      ...tableData,
      loading: true
    })
    const { current, pageSize } = tableData
    const [err, res] = await labelService.labelList({ current, pageSize, ...queryData })
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

  /** 新建和编辑弹窗 */
  function toogleModal (type: number, visible: boolean, data?: IData) {
    console.log(type)
    console.log(visible)
    setModal({ type, visible, data })
  }

  /** 查询 */
  function onSearch (val: ILabelQuery) {
    setQueryData(val)
    setTableData({
      ...tableData,
      current: 1
    })
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
      <Query onSearch={val => onSearch(val)} toogleModal={toogleModal} loading={tableData.loading} />
      <br />
      <List tableData={tableData} onPageChange={onPageChange} getDtaList={getDtaList} toogleModal={toogleModal} />
      <OperateModal modal={modal} toogleModal={toogleModal} getDtaList={getDtaList} labelList={labelList} />
    </Fragment>
  )
}
