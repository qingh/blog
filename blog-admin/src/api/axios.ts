import axios from 'axios'

// 请求拦截器
axios.interceptors.request.use(
  config => {
    // 此处可检查登录状态
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.common.token = token
    }
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
      // router.history.push('/login')
    }
    return Promise.reject(error)
  }
)
