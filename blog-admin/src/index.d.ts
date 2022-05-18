declare module '*.png';
declare module '*.svg';

declare global {

  interface IArticle {
    id: number
    label_id: number
    title: string
    content: string
    author: string
    browser: number
    created_at: string
    updated_at: string
  }

  interface ITable {
    total: number
    loading: boolean
    dataSource: IArticle[]
  }

  interface ILogin {
    username: string
    password: string
  }

  interface ILabel {
    id: number
    name: string
  }

  interface IUser {
    id: number
    username: string
  }

  interface IAddArticle {
    title: string
    label_id: number
    content: string
  }

  interface IArticleQuery {
    article_id: number
    author: string
    label_id: number
    title: string
  }

  interface IPage {
    current: number, pageSize: number
  }
}

export { }
