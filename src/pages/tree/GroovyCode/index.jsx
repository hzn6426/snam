import ICodeEditor from "@/components/ICodeEditor";
import React, { useEffect, useRef, useState } from 'react';
import { format } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IIF } from '@/common/components';
import { message, Alert } from 'antd';
import {variableType} from '../types'
import { set } from "lscache";
export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [current, setCurrent] = useState({});
    const [valueScript, setValueScript] = useState('');

    const onSaveClick = (v) => {
        let express = valueScript;
        let desc = <>执行Groovy代码语句: <span className='desc'> {valueScript} </span></>
        // let express;
        // let desc;
        // if (v.value) {
        //     desc = <>定义<span className='desc'> {v.type} </span>类型变量 <span className='desc'>{v.name} = {v.value}</span></>;
        //     express = format("{0} {1} = {2};", v.type, v.name, v.value);
        // } else {
        //     desc = <>定义<span className='desc'>{v.type}</span>类型变量 <span className='desc'>{v.name}</span></>;
        //     express = format("{0} {1};", v.type, v.name);
        // }
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
        setValueScript(data.express);
        setCurrent(data);
    }, []);

    return (
        <IWindow
            current={current}
            className="snam-modal"
            title='编辑Groovy'
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
                <ICodeEditor width="600" height="calc(100vh - 120px)"  value={valueScript} onChange={(value) => {setValueScript(value)}} />
            </ILayout>
        </IWindow>
    )
}

