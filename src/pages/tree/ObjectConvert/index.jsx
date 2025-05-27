import React, { useEffect, useRef, useState } from 'react';
import { format } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IIF } from '@/common/components';
import { message, Alert } from 'antd';
import {variableType} from '../types'
export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [current, setCurrent] = useState({});

    const onSaveClick = (v) => {
        v.desc = <>将对象<span className='desc'>{v.source}</span>转换成 <span className='desc'>{v.dest}</span></>;;
        v.express = format("mapper({0},{1})", v.source, v.dest);
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
            title='对象转换'
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
                <IFormItem labelCol={{ span: 4 }} xtype='input' name="dest" label="目标变量" required={true} tooltip={"填写变量将复制值到变量，填写完整类名，转化成目标类对象"}/>
            </ILayout>
        </IWindow>
    )
}
