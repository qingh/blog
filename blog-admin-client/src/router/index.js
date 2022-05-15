import React, { lazy } from 'react';
import { HomeOutlined, ChromeOutlined, CloudServerOutlined, DatabaseOutlined } from '@ant-design/icons';
const Home = lazy(() => import(/* webpackChunkName: "home" */ '@pages/home'));
const NotFound = lazy(() => import(/* webpackChunkName: "404" */ '@pages/404'));

const ArticleManage = lazy(() => import(/* webpackChunkName: "articleManage" */ '@pages/articleManage'));
const CommentManage = lazy(() => import(/* webpackChunkName: "commentManage" */ '@pages/commentManage'));
const LabelManage = lazy(() => import(/* webpackChunkName: "labelManage" */ '@pages/labelManage'));
const UserManage = lazy(() => import(/* webpackChunkName: "userManage" */ '@pages/userManage'));

// 此页面根据功能变化已废弃，路由配置由后端根据角色权限返回
let router = [
  {
    key: 0,
    title: '首页',
    // icon: HomeOutlined,
    path: '/home',
    exact: true,
    component: Home,
  },
  /*   {
    key: 1,
    title: '前端开发',
    icon: ChromeOutlined,
    children: [
      {
        name: 'html5',
        path: '/home/html5',
        component: Html5,
      }
    ],
  }, */

  {
    key: 1,
    title: '文章管理',
    // icon: HomeOutlined,
    path: '/home/articleManage',
    component: ArticleManage,
  },
  {
    key: 2,
    exact: true,
    title: '评论管理',
    // icon: HomeOutlined,
    path: '/home/commentManage',
    component: CommentManage,
  },
  {
    key: 3,
    title: '分类管理',
    // icon: HomeOutlined,
    path: '/home/labelManage',
    component: LabelManage,
  },
  {
    key: 4,
    title: '用户管理',
    // icon: HomeOutlined,
    path: '/home/userManage',
    component: UserManage,
  },
  {
    key: 99,
    path: '*',
    component: NotFound,
  },
];

export { router };
