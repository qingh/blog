import { createElement, FC, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, Menu, Dropdown, Avatar, message } from 'antd'
import { history } from '@router/history'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons'
import { userContext } from '@context/userContext'
import { userService } from '@api/service'
import css from './index.module.less'

interface IProps {
  collapsed: boolean
  setSollapsed: (collapsed: boolean) => void
}

const { Header } = Layout

export const TopHeader: FC<IProps> = ({ collapsed, setSollapsed }) => {
  const navigate = useNavigate()
  const { user } = useContext(userContext)
  const menu = (
    <Menu
      onClick={({ key }) => {
        if (key === '3') return history.push('/login')
        message.warn('开发中，敬请期待')
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

  async function logout () {
    const [err, res] = await userService.logut()
    if (err) return message.error(err.message)
    const { errorCode, message: msg } = res.data
    if (errorCode) {
      message.success(msg)
      navigate('/login')
    } else {
      message.error(msg)
    }
  }

  return (
    <Header style={{ padding: 0, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: css.trigger,
        onClick: () => setSollapsed(!collapsed)
      })}
      <Dropdown overlay={menu}>
        <div onClick={e => e.preventDefault()} style={{ marginRight: '20px' }}>
          <Avatar style={{ backgroundColor: '#87d068', marginRight: '8px' }} icon={<UserOutlined />} size={'small'} />
          <span style={{ color: '#40a9ff' }}>{user}</span>
        </div>
      </Dropdown>
    </Header>
  )
}
