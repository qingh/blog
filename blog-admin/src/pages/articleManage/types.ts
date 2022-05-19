export interface IArticle {
  id: number
  title: string
  label_id: number
  content: string
  author: string
  browser: number
  created_at: string
  updated_at: string
}

export interface IArticleQuery {
  article_id: number
  author: string
  label_id: number
  title: string
}

export interface IAddArticle {
  title: string
  label_id: number
  content: string
}

export interface ITableData extends ITable {
  dataSource:IArticle[]
}
