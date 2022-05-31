import { lazy } from 'react'
import Icon, { HomeOutlined } from '@ant-design/icons'
import { Article, Comment, Label, User } from '@pages/common/icon'
const Home = lazy(() => import(/* webpackChunkName: "home" */ '@pages/home'))
const NotFound = lazy(() => import(/* webpackChunkName: "404" */ '@pages/404'))

const ArticleComponent = lazy(() => import(/* webpackChunkName: "articleManage" */ '@pages/article'))
const CommentComponent = lazy(() => import(/* webpackChunkName: "commentManage" */ '@pages/comment'))
const LabelComponent = lazy(() => import(/* webpackChunkName: "labelManage" */ '@pages/label'))
const UserComponent = lazy(() => import(/* webpackChunkName: "userManage" */ '@pages/user'))

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
    path: 'article',
    component: ArticleComponent
  },
  {
    key: '2',
    label: '分类管理',
    icon: <Icon component={Label}></Icon>,
    path: 'label',
    component: LabelComponent
  },
  {
    key: '3',
    label: '评论管理',
    icon: <Icon component={Comment}></Icon>,
    path: 'comment',
    component: CommentComponent
  },
  {
    key: '4',
    label: '用户管理',
    icon: <Icon component={User}></Icon>,
    path: 'user',
    component: UserComponent
  },
  {
    key: '99',
    path: '*',
    component: NotFound
  }
]

export { router }
