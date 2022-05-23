import { lazy } from 'react'
import Icon, { HomeOutlined } from '@ant-design/icons'
import { Article, Comment, Label, User } from '../pages/common/icon'
const Home = lazy(() => import(/* webpackChunkName: "home" */ '@pages/home'))
const NotFound = lazy(() => import(/* webpackChunkName: "404" */ '@pages/404'))

const ArticleManage = lazy(() => import(/* webpackChunkName: "articleManage" */ '@pages/articleManage'))
const CommentManage = lazy(() => import(/* webpackChunkName: "commentManage" */ '@pages/commentManage'))
const LabelManage = lazy(() => import(/* webpackChunkName: "labelManage" */ '@pages/labelManage'))
const UserManage = lazy(() => import(/* webpackChunkName: "userManage" */ '@pages/userManage'))

const router = [
  {
    key: '0',
    label: '首页',
    icon: <HomeOutlined />,
    component: Home
  },
  {
    key: '1',
    label: '文章管理',
    icon: <Icon component={Article}></Icon>,
    path: 'articleManage',
    component: ArticleManage
  },
  {
    key: '2',
    label: '评论管理',
    icon: <Icon component={Comment}></Icon>,
    path: 'commentManage',
    component: CommentManage
  },
  {
    key: '3',
    label: '标签管理',
    icon: <Icon component={Label}></Icon>,
    path: 'labelManage',
    component: LabelManage
  },
  {
    key: '4',
    label: '用户管理',
    icon: <Icon component={User}></Icon>,
    path: 'userManage',
    component: UserManage
  },
  {
    key: '99',
    path: '*',
    component: NotFound
  }
]

export { router }
