import { useState, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Icon from '@ant-design/icons'
import Loading from '../loading'
import { router } from '@router/index'
import { MenuComponent } from './sidebar'
import { TopHeader } from './header'
import { UserContextComponent } from '@context/userContext'
import css from './index.module.less'

const { Sider, Content, Footer } = Layout

const Logo = () => {
  return (
    <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="30" height="30">
      <path d="M1023.02436 69.151c-2.656-5.193-9.635-5.793-14.656-5.793-17.393 0-51.435 8.91-102.958 22.397l-16.83 4.399c-78.224 20.406-153.137 78.135-185.126 102.785l-1.24 0.955c29.174-38.092 106.371-155.666 99.952-169.313-0.715-1.517-2.115-2.39-3.837-2.39-7.043 0-14.876 7.743-29.1 21.796-20.258 20.019-54.165 53.525-115.31 93.793-39.243 25.841-81.582 62.782-118.933 95.37-47.951 41.841-93.247 81.36-114.642 81.36-4.012 0-6.987-1.435-9.096-4.386-27.78-38.892-56.352-59.82-84.918-62.2-6.054-0.505-12.312-1.027-18.675-1.027-23.957 0-51.052 6.606-86.771 54.52-7.942 10.653-84.91 19.44-141.107 25.858-29.84 3.407-55.616 6.35-69.308 9.155-7.465 1.53-10.752 2.335-10.44 5.425 0.304 2.989 3.164 3.24 11.927 3.24 10.611 0 29.716-0.809 51.838-1.744 33.763-1.427 75.78-3.205 111.362-3.205 38.287 0 61.75 2.1 69.735 6.239 30.913 16.03 76.366 75.642 115.79 151.866 38.263 73.964 136.133 152.323 198.075 172.974 47.383 15.793 54.872 57.82 66.205 121.437 2.89 16.215 6.167 34.591 10.405 53.872 14.221 64.638 22.208 73.353 28.146 73.353 5.124 0 8.416-6.561 10.682-21.272 0.318-2.064 0.568-4.015 0.768-5.85 21.31 74.246 32.47 83.815 39.814 83.815a4.905 4.905 0 0 0 3.94-1.933c4.368-5.604 0.025-23.997-7.421-53.547-3.89-15.431-9.089-36.069-8.37-42.086 5.906 5.705 21.833 35.226 33.694 57.21 26.98 50.015 36.372 65.587 42.542 65.587 0.711 0 1.4-0.19 2-0.55 6.464-3.881 0.303-21.535-17.615-67.292-9.433-24.088-19.182-48.983-20.243-59.743 5.446 4.055 18.894 21.384 28.985 34.392 20.92 26.958 30.653 38.774 36.087 38.771a3.892 3.892 0 0 0 3.015-1.375c1.197-1.413 1.472-3.629 0.882-7.185-2.43-14.74-22.197-59.794-43.128-107.494-17.945-40.9-36.5-83.193-40.894-99.871-9.643-36.65-65.909-175.485-82.918-209.504-11.31-22.618 30.329-48.57 60.73-67.52 13.345-8.317 24.87-15.502 30.826-21.455 9.603-9.603 20.26-14.338 31.542-19.353 11.232-4.99 22.842-10.152 33.146-20.454 13.837-13.839 16.167-25.484 18.42-36.745 1.109-5.548 2.157-10.787 4.535-16.335 3.122-7.28 13.64-11.474 24.778-15.913 13.05-5.202 27.841-11.099 34.815-23.65 4.898-8.814 7.846-19.22 10.702-29.284 4.223-14.9 8.214-28.977 17.555-31.648 17.932-5.124 46.224-22.95 51.577-40.342l0.89-2.925c5.21-17.153 17.407-57.32 47.703-99.264 10.153-14.068 13.288-22.418 10.473-27.92z" fill="#5468ff">
      </path>
    </svg>
  )
}

export const Home = () => {
  const [collapsed, setSollapsed] = useState(false)

  return (
    <UserContextComponent>
      <Layout style={{ height: '100%' }}>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className={css.logo} style={{ background: collapsed ? 'transparent' : 'rgba(255, 255, 255, 0.3)' }}>{collapsed ? <Icon component={Logo}></Icon> : '博客后台管理系统'}</div>
          <MenuComponent />
        </Sider>
        <Layout className="site-layout" style={{ overflow: 'auto' }}>
          <TopHeader collapsed={collapsed} setSollapsed={setSollapsed} />
          <Content
            style={{
              padding: 24,
              minHeight: 280
            }}
          >
            <Suspense fallback={<Loading />}>
              <Routes>
                {
                  router.map(item => <Route key={item.key} index={item.key === '0'} path={item.path} element={item.component ? <item.component /> : null} />)
                }
              </Routes>
            </Suspense>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    </UserContextComponent>
  )
}
