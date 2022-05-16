import React, { PureComponent, Suspense } from 'react';
import { Route, NavLink } from 'react-router-dom';
import { Layout, Menu, message, Button } from 'antd';
import { menuService } from '../../../api';
import css from './index.module.less';
import Loading from '../loading';
import logo from '../../../static/imgs/logo.png';
import { router } from '../../../router';

const { SubMenu } = Menu;
const { Content, Header, Footer, Sider } = Layout;

class Home extends PureComponent {
  routeArr = [];
  state = {
    menu: [],
    collapsed: false,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  componentDidMount() {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    // this.getMenu();
    // if (token && userInfo) {
    //   this.getMenu();
    // } else {
    //   this.props.history.push('/login');
    // }
  }

  getMenu = async () => {
    //登录成功后，获取用户菜单权限
    // let { user_id } = JSON.parse(localStorage.getItem('userInfo'));
    // let [err, res] = await menuService.getMenuList({
    //   user_id,
    // });
    // if (err) {
    //   message.error(err.message);
    // } else {
    //   if (res.data.code) {
    //     let { data } = res.data;
    //     data.forEach(item => {
    //       if ('path' in item) {
    //         if (item.path === '*') {
    //           item.component = lazy(() => import(/* webpackChunkName: "404" */ '@pages/404'));
    //         } else {
    //           item.component = lazy(() => import(/* webpackChunkName: "[request]" */ `@pages/${item.path}`));
    //         }
    //       } else {
    //         item.list.forEach(list => {
    //           let filePath = list.path.split('/')[1];
    //           list.component = lazy(() => import(/* webpackChunkName: "[request]" */ `@pages/${filePath}`));
    //         });
    //       }
    //     });

    //     this.setState({ menu: data });
    //   } else {
    //     message.error(res.data.msg);
    //   }
    // }
    this.setState({ menu: router });
  };

  recursionRoutes = routers => {
    //<item.component />
    const Text = () => <h1>22</h1>
    routers.forEach(item => {
      if ('path' in item) {
        this.routeArr.push(
          <Route key={item.path} path={`${item.path}`} element={<Text />} />
        );
      } else {
        this.recursionRoutes(item.children);
      }
    });

    return this.routeArr;
  };

  render() {
    this.routeArr = [];
    const { menu } = this.state;
    return (
      <Layout className={css.layout}>
        <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
          <div className={css.logo}>
            <img src={logo} />
            后台管理系统
          </div>
          <Menu
            theme={'dark'}
            mode="inline"
            defaultSelectedKeys={['0']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={menu.map(baseMenuItem)}
          />
        </Sider>

        {/* <Layout style={{ position: 'relative' }}>
          <Header className={css.header}>
            <Button
              type="primary"
              onClick={() => {
                this.props.history.push('/login');
              }}
            >
              退出
            </Button>
          </Header>
          <Content className={css.content}>
            <Suspense fallback={<Loading />}>
              <Switch>{this.recursionRoutes(menu).map(item => item)}</Switch>
            </Suspense>
          </Content>
          <Footer className={css.footer}>Ant Design ©2020 Created by Ant UED</Footer>
        </Layout> */}
      </Layout>
    );
  }
}

function baseMenuItem(item) {
  return <h1>2</h1>
  if (item.children) {
    return (
      <SubMenu key={item.key} icon={<item.icon />} title={item.title}>
        {item.children.map(list => (
          <Menu.Item key={list.path}>
            <NavLink to={`${list.path}`}>
              <span>{list.name}</span>
            </NavLink>
          </Menu.Item>
        ))}
      </SubMenu>
    );
  } else {
    if (item.path === '*') {
      return '';
    } else {
      return (
        <Menu.Item key={item.key} icon={<item.icon />}>
          <NavLink to={`${item.path}`}>
            <span>{item.title}</span>
          </NavLink>
        </Menu.Item>
      );
    }
  }
}

export { Home }
