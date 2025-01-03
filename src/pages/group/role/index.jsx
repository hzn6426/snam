import React, { useEffect, useRef, useState } from 'react';
import { api, data2Option, useAutoObservable, useAutoObservableEvent } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IIF } from '@/common/components';
import { message, Alert } from 'antd';

export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState({});
    const [roles, setRoles] = useState([])

    const onSaveClick = (userRole) => {
        setLoading(true);
        api.user.saveUserRole(userRole).subscribe({
            next: () => {
                message.success('操作成功!');
                window.close();
                window.opener.onSuccess();
            }
        }).add(() => setLoading(false));
    }

    const loadRoles = () => {
        api.role.listAll().subscribe({
            next: (data) => setRoles(data2Option('id', 'roleName', data))
        });
    }

    useEffect(() => {
        loadRoles();
        const item = window.opener.onGetParams();
        setCurrent(item);
    }, []);

    return (
        <IWindow
            current={current}
            className="snam-modal"
            title='分配组织角色'
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="hidden" name="userId" />
            <IFormItem xtype="hidden" name="orgId" />
            <IIF test={roles && roles.length > 0}>
                <ILayout type="vbox">
                    <IFormItem xtype='checkbox' name="roleIds" label="角色列表" ruleType='array' options={roles} />
                </ILayout>
            </IIF>
            <IIF test={roles && roles.length == 0}>
                <Alert message="没有角色数据" type="info" />
            </IIF>
        </IWindow>
    )
}
