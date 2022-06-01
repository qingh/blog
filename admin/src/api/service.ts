import { http } from './axios'
import { IAddArticle, IArticleQuery } from '@pages/article/types'
import { ICommentQuery } from '@pages/comment/types'
import { IAddLabel, ILabelQuery } from '@pages/label/types'
import { ILogin, IUserQuery, IAddUser } from '@pages/user/types'

const articleService = {
  articleList: (data: IArticleQuery & IPage) => http({ url: '/articles', data }),
  addArticle: (data: IAddArticle) => http({ method: 'POST', url: '/articles', data }),
  delArticle: (params: number) => http({ url: `/articles/${params}`, method: 'DELETE' }),
  editArticle: (params: IAddArticle & { id: number }) => http({ url: `/articles/${params.id}`, method: 'PATCH', data: params })
}

const commentService = {
  commentList: (data: ICommentQuery & IPage) => http({ url: '/comments', data }),
  delComment: (id: number) => http({ method: 'DELETE', url: `/comments/${id}` })
}
const labelService = {
  labelList: (data?: ILabelQuery & IPage) => http({ url: '/labels', data }),
  addLabel: (data: IAddLabel) => http({ method: 'POST', url: '/labels', data }),
  delLabel: (id: number) => http({ method: 'DELETE', url: `/labels/${id}` }),
  editLabel: (data: IAddLabel & { id: number }) => http({ url: `/labels/${data.id}`, method: 'PATCH', data })
}

const userService = {
  login: (data: ILogin) => http({ url: '/users/login', method: 'POST', data }),
  logut: () => http({ url: '/users/logout' }),
  userList: (data?:IUserQuery & IPage) => http({ url: '/users', data }),
  addUser: (data:IAddUser) => http({ method: 'POST', url: '/users', data }),
  delUser: (id:number) => http({ method: 'DELETE', url: `/users/${id}` }),
  editUser: (data:IAddUser& { id: number }) => http({ method: 'PATCH', url: `/users/${data.id}`, data })
}

export { articleService, commentService, labelService, userService }
