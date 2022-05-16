import { useState } from 'react';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

import { router } from '../../../../router';
import { useNavigate } from 'react-router-dom';
type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('One', 'sub1', <MailOutlined />, [
    getItem('Option 1', '1'),
    getItem('Option 2', '2'),
    getItem('Option 3', '3'),
    getItem('Option 4', '4'),
  ]),
  getItem('Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),
  getItem('Three', 'sub4', <SettingOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),
];

const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

export const MenuComponent = () => {
  const [openKeys, setOpenKeys] = useState(['sub1']);
  const navigate = useNavigate()

  const onOpenChange: MenuProps['onOpenChange'] = keys => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    console.log(keys);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };
  const router2 = [
    {
      key: '0',
      label: '111',
      icon: <AppstoreOutlined />,
      component: () => <h1>111</h1>
    },
    {
      key: '1',
      label: '222',
      component: () => <h1>222</h1>
    }
  ]
  return (
    <Menu
      onClick={({ key }) => {
        console.log(key);
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
  );
}
