import { useState } from 'react'
import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'

import { router } from '../../../../router'
import { useNavigate } from 'react-router-dom'

const rootSubmenuKeys = ['sub1', 'sub2', 'sub4']

export const MenuComponent = () => {
  const [openKeys, setOpenKeys] = useState(['sub1'])
  const navigate = useNavigate()

  const onOpenChange: MenuProps['onOpenChange'] = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1)
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys)
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
    }
  }

  return (
    <Menu
      onClick={({ key }) => {
        router.forEach(item => {
          if (item.key === key) {
            navigate(item.path ? `/${item.path}` : '/')
          }
        })
      }}
      mode="inline"
      onOpenChange={onOpenChange}
      items={router}
      theme={'dark'}
    />
  )
}
