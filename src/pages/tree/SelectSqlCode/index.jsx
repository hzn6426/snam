import ICodeEditor from "@/components/ICodeEditor";
import React, { useEffect, useRef, useState } from 'react';
import { format } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IIF } from '@/common/components';
import { message, Alert } from 'antd';
import {selectReturnType} from '../types'
import { set } from "lscache";
export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [current, setCurrent] = useState({});
    const [valueScript, setValueScript] = useState('');

    const onSaveClick = (v) => {
        const param = (v.paramObject ? "" : ("," + v.paramObject));
        const sql =  v.returnType == 'sigle' ?  "selectOneSql(" + valueScript + param + ")" : "selectSql(" + valueScript + param  + ")" ;
        let express = format("def {0} = {1}", v.variableObject, sql);
        let desc = <>将执行的SQL代码返回值保存到变量<span className='desc'> {v.variableObject}</span>，SQL Select代码语句: <span className='desc'> {valueScript}</span></>
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
        v.valueScript = valueScript;
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
        setValueScript(data.valueScript);
        setCurrent(data);
    }, []);

    return (
        <IWindow
            current={current}
            className="snam-modal"
            title='编辑SQL'
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                // window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="hidden" name="index" />
            <IFormItem xtype="select" labelCol={{ span: 4 }} name="returnType" label="返回类型" options={selectReturnType} required={true} />
            <IFormItem xtype="input" labelCol={{ span: 4 }} name="paramObject" label="参数变量" required={false} tooltip="参数变量,多个以逗号间隔" />
            <IFormItem xtype="input" labelCol={{ span: 4 }} name="variableObject" label="保存到变量" required={true} />
            
            <ILayout type="vbox">
                <ICodeEditor width="600" height="calc(100vh - 160px)" language="mySql" placeholder="Select语句,可通过{0},{1}格式添加参数"  value={valueScript} onChange={(value) => {setValueScript(value)}} />
            </ILayout>
        </IWindow>
    )
}

