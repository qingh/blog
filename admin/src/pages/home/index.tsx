import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default () => {
  const navigate = useNavigate()
  useEffect(() => {
    const isLogin: null | string = sessionStorage.getItem('isLogin')
    if (isLogin === null || isLogin === 'false') {
      navigate('/login')
    }
  }, [])

  return <h1>欢迎使用博客后台管理系统</h1>
}
