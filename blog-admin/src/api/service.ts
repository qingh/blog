// import axios from './axios';
import axios, { AxiosResponse } from 'axios'

axios.defaults.baseURL = '/api/v1'
axios.defaults.timeout = 3000
// axios.defaults

function wrapAwait (promise: Promise<AxiosResponse>) {
  return promise.then(res => [null, res]).catch(error => [error])
}

interface IHttp {
  url: string
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  data?: { [key: string]: any }
  headers?: { [key: string]: any }
}

function http ({ url, method = 'GET', data, headers }: IHttp) {
  if (method === 'GET' || method === 'DELETE') {
    let params = ''
    for (const key in data) {
      if (typeof data[key] !== 'undefined') {
        params += `&${key}=${data[key]}`
      }
    }
    if (params !== '') {
      url = `${url}?` + params.substring(1)
    }
  }
  return axios({
    method,
    url,
    data
  }).then(res => [null, res]).catch(error => [error])
}

const menuService = {
  getMenuList: params => wrapAwait(axios.get('/getMenuList', params))
}

const fileService = {
  download: params => wrapAwait(axios.get('/download', params))
  // upload: params => wrapAwait(axios.upload('/upload', params),
}

const articleService = {
  articleList: (params: IArticleQuery & IPage) => http({ url: '/articles', data: params }),
  addArticle: (params: IAddArticle) => http({ method: 'POST', url: '/articles', data: params }),
  delArticle: (params:number) => http({ url: `/articles/${params}`, method: 'DELETE' }),
  editArticle: (params:IAddArticle & { id: number }) => http({ url: `/articles/${params.id}`, method: 'PATCH', data: params })
}

const commentService = {
  commentList: params => wrapAwait(axios.get('/comments', params)),
  delComment: params => wrapAwait(axios.delete(`/comments/${params}`))
}

const labelService = {
  labelList: () => http({ url: '/labels' }),
  addLabel: params => wrapAwait(axios.post('/labels', params)),
  delLabel: params => wrapAwait(axios.delete(`/labels/${params}`)),
  editLabel: params => http({ url: `/labels/${params.id}`, method: 'PATCH', data: params })
}

const userService = {
  // login: (params: ILogin) => wrapAwait(axios.post('/users/login', params)),
  login: (params: ILogin) => http({ url: '/users/login', method: 'POST', data: params }),
  userList: () => http({ url: '/users' }),
  addUser: params => wrapAwait(axios.post('/users', params)),
  delUser: params => wrapAwait(axios.delete(`/users/${params}`)),
  editUser: params => wrapAwait(axios.patch(`/users/${params.id}`, params))
}

export { menuService, fileService, articleService, commentService, labelService, userService }
