import React from 'react';
import { LogoutOutlined, SettingOutlined, CloudSyncOutlined } from '@ant-design/icons';
import { Dropdown, message } from 'antd';
import { history } from 'umi';
import { api, constant } from '@/common/utils';
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

    const refreshPrivilege = () => {
        api.user.loadUserButtons().subscribe({
            next: (br) => {
                sessionStorage.setItem(constant.KEY_USER_BUTTON_PERMS, br || []);
                message.success('刷新权限成功');
            }
        });
    }

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
            key: 'refreshPrivilege',
            icon: <CloudSyncOutlined />,
            label: <span onClick={() => { refreshPrivilege() }}>刷新权限</span>,
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