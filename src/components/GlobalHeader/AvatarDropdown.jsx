import { api, constant, getPageQuery } from '@/common/utils';
import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { history } from '@umijs/max';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { useApplicationState } from "@/store/state";

class AvatarDropdown extends React.Component {
  onMenuClick = (event) => {
    const { key } = event;
    const account = { center: '个人中心', settings: '历史消息' };

    if (key === 'logout') {
      // const { dispatch } = this.props;
      api.user.logout().subscribe({
        next: () => {
          const { redirect } = getPageQuery(); // Note: There may be security issues, please note
          if (window.location.pathname !== constant.SYSTEM_ROUTE_LOGIN && !redirect) {
            history.replace({
              pathname: constant.SYSTEM_ROUTE_LOGIN,
            });
          }
        },
      });
      history.push(`/account/logout`);
    } else {
      history.push(`/account/${key}?tabTitle=${account[key]}`);
    }
  };

  render() {
    const { currentUser } = this.props;
    const [viewSetting] = useApplicationState(s => [s.view]);
    // const { currentUser } = this.state;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} onClick={this.onMenuClick}>
        {/* <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
        <Menu.Item key="settings">
          <MessageOutlined />
          历史消息
        </Menu.Item>
        <Menu.Divider /> */}
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
      </Menu>
    );
    return currentUser && currentUser.name ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            src={currentUser.avatar}
          >
            {constant.SYSTEM_AVATAR_NAME}
          </Avatar>
          <span className={`${styles.name} anticon`} style={{ color: viewSetting.navTheme === 'glass' ? 'white' : 'inherit' }}>{currentUser.name}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      </span>
    );
  }
}
export default AvatarDropdown;