import ICodeEditor from "@/components/ICodeEditor";
import React, { useEffect, useRef, useState } from 'react';
import { format } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IIF } from '@/common/components';
export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [current, setCurrent] = useState({});
    const [valueScript, setValueScript] = useState('');

    useEffect(() => {
        const item = window.opener.onGetParams();
        setValueScript(item);
    }, []);

    return (
        <IWindow
            current={current}
            className="snam-modal"
            title='代码预览'
            width={clientWidth}
            height={clientHeight}
            saveVisible = {false}
            onCancel={() => {
                window.close();
            }}
        >
            <IFormItem xtype="hidden" name="index" />
            <ILayout type="vbox">
                <ICodeEditor width="600" height="calc(100vh - 120px)"  value={valueScript} readOnly={true} />
            </ILayout>
        </IWindow>
    )
}

