import React, { useEffect, useRef, useState } from 'react';
import { api, data2Option, useAutoObservableEvent } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IIF } from '@/common/components';
import { message, Alert } from 'antd';
import { useParams } from 'umi';

export default (props) => {
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState({});
    const [roles, setRoles] = useState([])

    //保存功能
    const onSaveClick = (usetRole) => {
        setLoading(true);
        api.uset.saveUsetRole(usetRole).subscribe({
            next: () => {
                message.success('操作成功!');
                window.close();
                window.opener.onSuccess();
            }
        }).add(() => setLoading(false));
    }

    //加载所有角色
    const loadRoles = () => {
        api.role.listAll().subscribe({
            next: (data) => setRoles(data2Option('id', 'roleName', data))
        });
    }

    //加载用户组角色
    const loadUsetRoles = (usetId) => {
        api.uset.listRolesByUset(usetId).subscribe({
            next: (data) => {
                setCurrent({ usetId: usetId, roleIds: data });
            }
        });
    }

    useEffect(() => {
        loadRoles();
        loadUsetRoles(params.id);
    }, [params.id]);

    return (
        <IWindow
            current={current}
            className="snam-modal"
            title={(current && current.id) ? '编辑分公司' : '新建分公司'}
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="hidden" name="usetId" />
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
