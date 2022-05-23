import axios from 'axios'
import { baseUrl } from '../config';



axios.defaults.baseURL = `${baseUrl}/api/v1`
axios.defaults.timeout = 3000
axios.defaults.withCredentials = true



interface IHttp {
  url: string
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  data?: { [key: string]: any }
  headers?: { [key: string]: any }
}

function http({ url, method = 'GET', data }: IHttp) {
  if (method === 'GET' || method === 'DELETE') {
    let params = ''
    for (const key in data) {
      if (typeof data[key] !== 'undefined') params += `&${key}=${data[key]}`
    }
    if (params !== '') url = `${url}?` + params.substring(1)
  }
  return axios({
    method,
    url,
    data
  }).then(res => [null, res]).catch(error => [error])
}

const service = {
  articleList: (data: { current: 1, pageSize: 10 }) => http({ url: '/articles', data }),
  articleNumOfLabel: () => http({ url: '/labels/articleNumOfLabel' }),
  articleContext: (id: number) => http({ url: `/articles/${id}/context` }),
  addComment: (data: FormData) => http({ method: 'POST', url: `/comments`, data }),
  commentOfarticle: (id:number) => http({ url: `/articles/articlesDetailAndCommentList/${id}`, }),

}

export {
  service
}