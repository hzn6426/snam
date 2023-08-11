import { IFormItem, ILayout, IWindow } from '@/common/components';
import { api, useAutoObservableEvent } from '@/common/utils';
import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import { useParams } from 'umi';


export default (props) => {
    const ref = useRef();
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);

    const [current, setCurrent] = useState({});

    const [onSaveClick] = useAutoObservableEvent([
        tap(() => setLoading(true)),
        switchMap((role) => api.param.saveOrUpdateParam(role)),
        tap(() => {
            message.success('操作成功!');
            window.close();
            window.opener.onSuccess();
        }),
        shareReplay(1),
    ], () => setLoading(false));

    useEffect(() => {
        const param = window.opener.onGetParams();
        setCurrent(param);
    }, [])

    return (
        <IWindow
            ref={ref}
            current={current}
            className="snam-modal"
            title={(current && current.id) ? '编辑参数' : '新建参数'}
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="id" />
            <ILayout type="vbox">
                <IFormItem
                    name="paramCode"
                    label="参数编码"
                    xtype="input"
                    required={true}
                    max={50}
                    disabled={!!current.id}
                />
                <IFormItem
                    name="paramName"
                    label="参数名称"
                    xtype="input"
                    required={true}
                    max={100}
                />
                <IFormItem
                    name="paramValue"
                    label="参数值"
                    xtype="input"
                    required={true}
                    max={50}
                />
                <IFormItem
                    name="note"
                    label="备注"
                    xtype="textarea"
                    max={100}
                    rows={4}
                />
            </ILayout>
        </IWindow>
    )
}