import React, { useEffect, useRef, useState } from 'react';
import { api, useAutoObservable, useAutoObservableEvent } from '@/common/utils';
import { IFormItem, ILayout, IWindow } from '@/common/components';
import { message } from 'antd';

export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [current,setCurrent] = useState({});

    const onSaveClick = (group) => {
        setLoading(true);
        api.group.saveOrUpdateGroup(group).subscribe({
            next:() => {
                message.success('操作成功!');
                window.close();
                window.opener.onSuccess();
            }
        }).add(() => setLoading(false));
    }

    useEffect(() => {
        const item = window.opener.onGetParams();
        setCurrent(item);
    },[]);

    return (
        <IWindow
            current={current}
            className="snam-modal"
            title={(current && current.id) ? '编辑组织' : '新建组织'}
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="id" />
            <IFormItem xtype="hidden" name="parentId"/>
            <ILayout type="vbox">
                <IFormItem xtype='input' name="parentName" label="上级组织" labelCol={{flex:'90px'}} disabled />
                <IFormItem xtype='input' name="groupName" label="子部门名称" labelCol={{flex:'90px'}} required />
            </ILayout>
            </IWindow>
    )
}
