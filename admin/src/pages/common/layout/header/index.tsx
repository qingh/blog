import { createElement, useState, Suspense, FC, useRef } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import { Layout, Menu, Dropdown, Space, Avatar } from 'antd'
import Icon, {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons'
import css from './index.module.less'

interface IProps {
  collapsed: boolean
  setSollapsed: (collapsed: boolean) => void
}

const { Header } = Layout

export const TopHeader: FC<IProps> = ({ collapsed, setSollapsed }) => {
  const navigage = useNavigate()
  const menu = (
    <Menu
      onClick={({ key }) => {
        if (key === '3')navigage('/login')
      }}
      items={[
        {
          label: '个人中心',
          key: 1
        },
        {
          label: '个人设置',
          key: 2
        },
        {
          label: '退出登录',
          key: 3
        }
      ]}
    />
  )
  return (
    <Header style={{ padding: 0, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: css.trigger,
        onClick: () => setSollapsed(!collapsed)
      })}
      <Dropdown overlay={menu}>
        <div onClick={e => e.preventDefault()} style={{ marginRight: '20px' }}>
          <Avatar style={{ backgroundColor: '#87d068', marginRight: '8px' }} icon={<UserOutlined/> } size={'small'}/>
          <span style={{ color: '#40a9ff' }}>qingh</span>
        </div>
      </Dropdown>
    </Header>
  )
}
