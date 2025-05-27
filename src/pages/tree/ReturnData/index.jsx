import React, { useEffect, useRef, useState } from 'react';
import { format } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IIF } from '@/common/components';
import { message, Alert } from 'antd';
import {variableType} from '../types'
export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [current, setCurrent] = useState({});

    const onSaveClick = (v) => {
        let express;
        let desc;
        if (v.variableObject) {
            desc = <>返回变量<span className='desc'> {v.variableObject} </span></>;
            express = format("return {0};", v.variableObject);
        } else {
            desc = <>直接返回</>;
            express = format("return;");
        }
        v.desc = desc;
        v.express = express;
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
            title='返回变量'
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
                <IFormItem xtype='input' name="variableObject" label="变量名"  required={false} />
            </ILayout>
        </IWindow>
    )
}
