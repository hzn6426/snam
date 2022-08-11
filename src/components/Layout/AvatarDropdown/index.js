import React from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Dropdown, Typography } from 'antd';
import { history } from 'umi';
const { Text } = Typography;

export default (props) => {
  const currentUser = { name: '管理员', avatar: '' };

  const logout = () => {
    sessionStorage.removeItem('token');
    history.push('/user/login');
  };

  const menuHeaderDropdown = (
    <Menu>
      <Menu.Item key="center">
        <UserOutlined />
        <span style={{ margin: '0 10px' }}>个人信息</span>
      </Menu.Item>
      <Menu.Item key="settings">
        <SettingOutlined />
        <span
          style={{ margin: '0 10px' }}
          onClick={() => {
            props.onSetting();
          }}
        >
          系统设置
        </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        <span style={{ margin: '0 10px' }} onClick={logout}>
          退出登录
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div style={{ padding: '8px 0', display: 'flex' }}>
      <Dropdown overlay={menuHeaderDropdown}>
        <Avatar size="small" style={{ backgroundColor: props.bgColor }} src={currentUser.avatar}>
          G
        </Avatar>
      </Dropdown>
      <Text
        ellipsis
        style={{ width: '75px', padding: '0 10px', lineHeight: '24px', color: '#999' }}
      >
        {currentUser.name}
      </Text>
    </div>
  );
};
