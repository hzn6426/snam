import React, { useEffect, useRef, useState } from 'react';
import { format } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IIF } from '@/common/components';
import { message, Alert } from 'antd';
import {variableType} from '../types'
export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [current, setCurrent] = useState({});

    const onSaveClick = (v) => {
        // let express;
        // let desc;
        // if (v.value) {
        //     desc = <>定义<span className='desc'> {v.type} </span>类型变量 <span className='desc'>{v.name} = {v.value}</span></>;
        //     express = format("{0} {1} = {2};", v.type, v.name, v.value);
        // } else {
        //     desc = <>定义<span className='desc'>{v.type}</span>类型变量 <span className='desc'>{v.name}</span></>;
        //     express = format("{0} {1};", v.type, v.name);
        // }
        // v.desc = desc;
        // v.express = express;
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
        // const data = {...item.data, index:item.index};
        setCurrent(item);
    }, []);

    return (
        <IWindow
            current={current}
            className="snam-modal"
            title='编辑变量'
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
                <IFormItem xtype='input' name="name" label="变量名"  required={true} />
                <IFormItem xtype='select' name="type" label="变量类型"  options={variableType} required={true} />
                <IFormItem xtype='textarea' name="value" label="变量值"  tooltip="支持groovy脚本" />
            </ILayout>
        </IWindow>
    )
}
