
export interface ILabel {
  id: number
  label: string
}

export interface ILabelQuery {// 此处不要继承上面
  id: number
  name: string
  author: string
}

export interface IAddLabel {
  name: string
}

export interface ILabelList {
  id: number
  name: string
  author: string
  created_at: string
  updated_at: string
}

export interface ITableData extends ITable {
  dataSource: ILabelList[]
}
