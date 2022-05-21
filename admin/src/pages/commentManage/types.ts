export interface ICommentQuery {
  id: number
  comment: string
  title: string
}

export interface IComment {
  id: number
  title: string
  comment: string
  nick_name:string
  created_at: string
}

export interface ITableData extends ITable {
  dataSource:IComment[]
}
