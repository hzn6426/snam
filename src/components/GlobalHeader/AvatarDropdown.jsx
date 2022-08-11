import { LogoutOutlined, MessageOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import React from 'react';
import { history } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { api, getPageQuery, constant } from '@/common/utils';

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
    // const { currentUser } = this.state;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} onClick={this.onMenuClick}>
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
        <Menu.Item key="settings">
          <MessageOutlined />
          历史消息
        </Menu.Item>
        <Menu.Divider />
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
            src={currentUser.avatar?.replace(/192.168.1.5/g, 'files.dsi-log.cn:2020')}
          >
            {constant.SYSTEM_AVATAR_NAME}
          </Avatar>
          <span className={`${styles.name} anticon`}>{currentUser.name}</span>
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
