import React, { use, useEffect, useRef, useState } from 'react';
import { copyObject, format,mapObjIndexed, split } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IIF } from '@/common/components';
import MultiSet from '../MultiSet';
import * as R from 'ramda';
export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [current, setCurrent] = useState({});
    const [index, setIndex] = useState();;

    const [variable, setVariable] = useState('');
    const [value, setValue] = useState();

    const ref = useRef();
    const onSaveClick = (values) => {
        let express;
        let desc;
        // console.log(values);
        const ui = ref.current.getUi();
        const arr = [];
        R.forEach((item)=> {
            const v = variable + '.' + item.column + '=' + item.value+';';
            arr.push(v)
        },ui);
        const v = {};
        express = arr.join('');
        desc = <>变量属性赋值:<span className='desc'>{express}</span></>;

        v.desc = desc;
        v.express = express;
        v.index = index;
        v.variable = variable;
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
        setIndex(item.index);
        const data = {...item.data};
        const express = data.express;
        if (data.variable) {
            setVariable(data.variable);
        }
        if (express) {
            const arr = split(express, ';');
            const ui = [];
            const formValue = {};
            arr.map((item,idx) => {
                if (item) {
                    let column = split(item, '=')[0];
                    let value = split(item, '=')[1];
                    if (column) {
                        column = column.replace(data.variable + '.', '');
                    }
                    ui.push({
                        column,
                        value
                    });
                    formValue['column' + idx] = column;
                    formValue['value' + idx] = value;
                }
            });
            // R.forEach((item) => {
               
            // },arr);
            setValue(ui);
            copyObject(data, formValue);
        }
        setCurrent(data);
        
    }, []);

    return (
        <IWindow
            current={current}
            className="snam-modal"
            title='对象赋值'
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                // window.opener.onSuccess();
            }}
        >
            <ILayout type="vbox">
                <IFormItem xtype='input' name="variable" label="变量名"  required={true} onChange={(e) => setVariable(e.target.value)}  />
                <MultiSet ref={ref} variable={variable} value={value} />
            </ILayout>
        </IWindow>
    )
}
