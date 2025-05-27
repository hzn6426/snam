import React, { useEffect, useRef, useState } from 'react';
import { format } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IIF } from '@/common/components';
import { message, Alert } from 'antd';
import {variableType} from '../types'
export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [current, setCurrent] = useState({});

    const onSaveClick = (v) => {
        v.desc = <>对列表<span className='desc'>{v.list}</span>中的每一项进行循环操作，将当前循环项保存到<span className='desc'>{v.variableObject}</span></>;
        v.express = format("def {0} in {1}", v.variableObject, v.list);
        window.close();
        window.opener.onSuccess(v);
    }

    // const loadRoles = () => {
    //     api.role.listAll().subscribe({
    //         next: (data) => setRoles(data2Option('id', 'roleName', data))
    //     });
    // }

    useEffect(() => {
        // loadRoles();
        const item = window.opener.onGetParams();
        const data = {...item.data, index:item.index};
        setCurrent(data);
    }, []);

    return (
        <IWindow
            current={current}
            className="snam-modal"
            title='For列表项循环'
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                // window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="hidden" name="index" />
            <ILayout type="vbox">
                <IFormItem labelCol={{ span: 4 }} xtype='input' name="list" label="列表变量"  required={true} />
                <IFormItem labelCol={{ span: 4 }} xtype='input' name="variableObject" label="循环项变量" required={true} />
            </ILayout>
        </IWindow>
    )
}
