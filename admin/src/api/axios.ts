import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8888/api/v1'
axios.defaults.timeout = 5000
axios.defaults.withCredentials = true

// 请求拦截器
axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  res => {
    return res
  },
  error => {
    if (error.response.status === 401) {
      location.href = '/login'
      return Promise.reject(new Error('登录信息过期'))
    }
  }
)

interface IHttp {
  url: string
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  data?: { [key: string]: any }
  headers?: { [key: string]: any }
}

function http ({ url, method = 'GET', data }: IHttp) {
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

export { http }
