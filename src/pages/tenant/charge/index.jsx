import React, { useRef, useState } from 'react';
import { api, useAutoObservable, useAutoObservableEvent } from '@/common/utils';
import { IFormItem, ILayout, IWindow } from '@/common/components';
import { message, Typography, Badge, Form, InputNumber } from 'antd';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { useParams } from 'umi';


export default (props) => {
    const ref = useRef();
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);

    const [current, setCurrent] = useAutoObservable((inputs$) =>
        inputs$.pipe(
            map(([id]) => id),
            filter(id => id !== 'ADD'),
            switchMap((id) => api.tenant.getTenant(id)),
            map((tenant) => {
                return tenant[0];
            })
        ),
        [params.id],
    )

    const [onSaveClick] = useAutoObservableEvent([
        tap(() => setLoading(true)),
        switchMap((tenant) => api.tenant.charge(tenant)),
        tap(() => {
            message.success('操作成功!');
            window.close();
            window.opener.onSuccess();
        }),
        shareReplay(1),
    ], () => setLoading(false));

    return (
        <IWindow
            ref={ref}
            current={current}
            className="snam-modal"
            title={'租户充值'}
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
                <span style={{ marginLeft: 20 }}>当前余额：<span style={{ color: 'red', fontWeight: 'bold', marginLeft: 5 }}>{current.balance}</span></span>
                <Form.Item
                    labelCol={{ span: 4 }}
                    name="money"
                    label="充值金额"
                    rules={[{ required: true, message: true }]}
                >
                    <InputNumber style={{ width: '100%' }} precision={2} min={1} max={99999999} onChange={() => { }} />
                </Form.Item>
            </ILayout>
        </IWindow>
    )
}