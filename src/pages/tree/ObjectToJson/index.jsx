import React, { useEffect, useRef, useState } from 'react';
import { format } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IIF } from '@/common/components';
import { message, Alert } from 'antd';
import {variableType} from '../types'
export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [current, setCurrent] = useState({});

    const onSaveClick = (v) => {
        v.desc = <>将对象变量<span className='desc'>{v.source}</span>转换成Json字符串，保存到变量<span className='desc'>{v.variableObject}</span></>;;
        v.express = format("def {1} = json({0})", v.source, v.variableObject);
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
            title='对象转Json'
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
                <IFormItem labelCol={{ span: 4 }} xtype='input' name="source" label="源变量"  required={true} />
                <IFormItem labelCol={{ span: 4 }} xtype='input' name="variableObject" label="保存到变量" required={true} />
            </ILayout>
        </IWindow>
    )
}
