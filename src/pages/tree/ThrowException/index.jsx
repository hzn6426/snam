import React, { useEffect, useRef, useState } from 'react';
import { format } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IIF } from '@/common/components';
import { message, Alert } from 'antd';
import {exceptionType} from '../types'
export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [current, setCurrent] = useState({});

    const onSaveClick = (v) => {
        v.desc = <>抛出 <span className='desc'>{v.exceptionType == 'runtimeException' ? '运行时异常':'业务异常'}</span>，异常信息为: <span className='desc'>{v.exceptionMessage}</span></>;
        v.express = format(" throw new {0};", v.exceptionType == 'runtimeException' ? 'RuntimeException' : 'ServerRuntimeException');
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
            title='throw异常处理'
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
                <IFormItem labelCol={{ span: 4 }} xtype='select' options={exceptionType} name="exceptionType" label="异常类型" required={true} />
                <IFormItem labelCol={{ span: 4 }} xtype='input' name="exceptionMessage" label="异常信息" required={true} />
            </ILayout>
        </IWindow>
    )
}
