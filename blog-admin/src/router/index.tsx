import React, { lazy } from 'react';
import { HomeOutlined, ChromeOutlined, CloudServerOutlined, DatabaseOutlined } from '@ant-design/icons';
const Home = lazy(() => import(/* webpackChunkName: "home" */ '../pages/home'));
const NotFound = lazy(() => import(/* webpackChunkName: "404" */ '../pages/404'));

const ArticleManage = lazy(() => import(/* webpackChunkName: "articleManage" */ '../pages/articleManage'));
const CommentManage = lazy(() => import(/* webpackChunkName: "commentManage" */ '../pages/commentManage'));
const LabelManage = lazy(() => import(/* webpackChunkName: "labelManage" */ '../pages/labelManage'));
const UserManage = lazy(() => import(/* webpackChunkName: "userManage" */ '../pages/userManage'));

let router = [
  {
    key: '0',
    label: '首页',
    icon: <HomeOutlined />,
    component: Home,
  },
  {
    key: '1',
    label: '文章管理',
    icon: <HomeOutlined />,
    path: 'articleManage',
    component: ArticleManage,
  },
  {
    key: '2',
    label: '评论管理',
    icon: <HomeOutlined />,
    path: 'commentManage',
    component: CommentManage,
  },
  {
    key: '3',
    label: '分类管理',
    icon: <HomeOutlined />,
    path: 'labelManage',
    component: LabelManage,
  },
  {
    key: '4',
    label: '用户管理',
    icon: <HomeOutlined />,
    path: 'userManage',
    component: UserManage,
  },
  {
    key: '99',
    path: '*',
    component: NotFound,
  },
];

export { router };
