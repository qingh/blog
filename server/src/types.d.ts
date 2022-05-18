
interface IArticle {
  title: string
  label_id: number
  content: string
}

interface ISearch extends Partial<IArticle> {
  id?: number
  current: number
  pageSize: number
}
