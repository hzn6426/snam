import React, { useEffect, useRef, useState } from 'react';
import { copyObject, format } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IIF } from '@/common/components';
import { message, Alert } from 'antd';
import {andOrMap} from '../types'
import MultiCondition from '../MultiCondition';
import * as R from 'ramda';
export default (props) => {
    
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [current, setCurrent] = useState({});
     const [index, setIndex] = useState();;
    
    const [value, setValue] = useState();

    const ref = useRef();

    const onSaveClick = (values) => {
        let express;
        let desc;
        const ui = ref.current.getUi();
        const arr = [];
        const mapIndexed = R.addIndex(R.forEach)
        ui.map((item, idx)=> {
            let e;
            const r = item['andOr'];
            const andOr = (idx == 0 ? '' : andOrMap[r] || ' && ');
            const condition = item['condition'];
            if (condition == 'contains') {
                e = andOr + item['column'] + '.contains(' + item['value'] + ") ";
            } else if (condition == 'not contains') {
                e = "!" + andOr + item['column'] + '.contains(' + item['value'] + ") ";
            } else {
                e = andOr + item['column']  + condition  + item['value'] + " ";
            }
            arr.push(e)
        },ui);
        express = arr.join('');
        desc = <>如果满足分支条件 <span className='desc'>{express}</span>, 则执行以下操作</>
        const v = {};
        v.desc = desc;
        v.express = express;
        v.index = index;
        v.ui = ui;
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
         setIndex(item.index);
         const ui = data.ui
          if (ui) {
            const formValue = {};
            ui.map((item,idx) => {
                if (item) {
                    let andOr = item['andOr'];
                    let column = item['column'];
                    let condition = item['condition'];
                    let value = item['value'];
                    formValue['andOr' + idx] = andOr;
                    formValue['column' + idx] = column;
                    formValue['condition' + idx] = condition;
                    formValue['value' + idx] = value;
                }
            });
            setValue(ui);
            copyObject(data, formValue);
        }
        setCurrent(data);
    }, []);

    return (
        <IWindow
            current={current}
            className="snam-modal"
            title='编辑IF条件'
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                // window.opener.onSuccess();
            }}
        >
            <ILayout type="vbox">
                <MultiCondition ref={ref} value={value} />
            </ILayout>
        </IWindow>
    )
}
