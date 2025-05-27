import React, { useEffect, useRef, useState } from 'react';
import { format } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IIF } from '@/common/components';
import { message, Alert } from 'antd';
import {variableType} from '../types'
export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [current, setCurrent] = useState({});

    const onSaveClick = (v) => {
        v.desc = <>从<span className='desc'>{v.start}</span>开始到<span className='desc'>{v.end}</span>结束，递增值为<span className='desc'>{v.incr}</span>，将当前循环值保存到{v.variableObject}</>;
        v.express = format("def {0} = {1}; {0} <= {2}; {0}={0} + {3}", v.variableObject, v.start, v.end, v.incr);
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
            title='For次数循环'
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
                <IFormItem labelCol={{ span: 4 }} xtype='input' name="start" label="起始数"  required={true} />
                <IFormItem labelCol={{ span: 4 }} xtype='input' name="end" label="结束数"  required={true} />
                <IFormItem labelCol={{ span: 4 }} xtype='input' name="incr" label="递增值"  required={true} />
                <IFormItem labelCol={{ span: 4 }} xtype='input' name="variableObject" label="循环项变量" required={true} />
            </ILayout>
        </IWindow>
    )
}
