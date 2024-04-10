import React from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import { history } from 'umi';
// import api from '@/services';
// import { wrapObservable } from '@/utils/RxjsUtil';
// import { getPageQuery } from '@/utils/utils';
// import url from '@/constant/url';
// import SYSTEM from '@/constant/system';


export default (props) => {
    const logout = () => {
        sessionStorage.removeItem('token');
        history.push('/user/login');
      };

    const items = [
        // {
        //     key: 'center',
        //     icon: <UserOutlined />,
        //     label: <span >个人信息</span>,
        // },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: <span onClick={() => { props.onSetting() }}>主题布局</span>,
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: <span onClick={logout}>退出登录</span>,
        }
    ]

    return <Dropdown menu={{ items }}>
        {props.children}
    </Dropdown>
}