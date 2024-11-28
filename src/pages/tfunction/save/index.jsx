import React, { useRef, useState } from 'react';
import { api, copyObject, useAutoObservable, useAutoObservableEvent } from '@/common/utils';
import { IFormItem, IIF, ILayout, IWindow } from '@/common/components';
import { TButton } from '@/common/componentx'
import { InputNumber, message, Form, Input, Select, } from 'antd';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { useParams } from 'umi';


export default (props) => {
    const ref = useRef();
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [feeMode, setFeeMode] = useState('');

    const [current, setCurrent] = useAutoObservable((inputs$) =>
        inputs$.pipe(
            map(([id]) => id),
            filter(id => id !== 'ADD'),
            switchMap((id) => api.tfunction.getFunction(id)),
            map((fun) => {
                return fun[0];
            })
        ),
        [params.id],
    )

    const [onSaveClick] = useAutoObservableEvent([
        tap(() => setLoading(true)),
        switchMap((fun) => api.tfunction.saveOrUpdateFunction(fun)),
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
            title={(current && current.id) ? '编辑租户接口' : '新建租户接口'}
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="id" />
            <Form.Item style={{ display: 'none' }}>
                <Form.Item name="requestUrl" label="">
                    <Input />
                </Form.Item>
            </Form.Item>
            <ILayout type="vbox">
                <Form.Item
                    labelCol={{ span: 3 }}
                    disabled={current && current.id}
                    name="functionId"
                    label="请求URL"
                    rules={[{ whitespace: true, required: true, message: false, max: 50 }]}
                >
                    <TButton
                        disabled={current && current.id}
                        onGetButton={(value) => {
                            const v = copyObject({}, current, { requestMethod: value.reqMethod, requestUrl: value.reqUrl, functionName: value.subMenu + '>' + value.buttonName, functionId: value.id })
                            setCurrent(v);
                        }} />
                </Form.Item>
                <IFormItem
                    name="functionName"
                    label="接口名称"
                    labelCol={{ span: 3 }}
                    xtype="input"
                    //preserve={false}
                    required={true}
                    max={50}
                />
                <Form.Item
                    labelCol={{ span: 3 }}
                    name="requestMethod"
                    label="请求方法"
                    rules={[{ whitespace: true, required: true, message: false }]}
                >
                    <Select allowClear disabled={current && current.id}
                        options={[{ label: 'POST', value: 'POST' }, { label: 'PUT', value: 'PUT' }, { label: 'GET', value: 'GET' }, { label: 'DELETE', value: 'DELETE' }]} />
                </Form.Item>
                <Form.Item
                    labelCol={{ span: 3 }}
                    name="feeType"
                    label="付费方式"
                    rules={[{ whitespace: true, required: true, message: false }]}
                >
                    <Select allowClear options={[{ label: '按年付费', value: 'YEAR' }, { label: '请求付费', value: 'REQUEST' }]} />
                </Form.Item>
                <Form.Item
                    labelCol={{ span: 3 }}
                    name="unitPrice"
                    label="单价"
                    rules={[{ required: true, message: true }]}
                >
                    <InputNumber style={{ width: '100%' }} precision={2} min={1} max={99999999} onChange={() => { }} />
                </Form.Item>
            </ILayout>
        </IWindow>
    )
}