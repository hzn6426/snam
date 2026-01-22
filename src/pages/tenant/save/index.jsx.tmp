import React, { useRef, useState } from 'react';
import { api, useAutoObservable, useAutoObservableEvent } from '@/common/utils';
import { IFormItem, ILayout, IWindow } from '@/common/components';
import { message } from 'antd';
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
        switchMap((tenant) => api.tenant.saveOrUpdateTenant(tenant)),
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
            title={(current && current.id) ? '编辑租户' : '新建租户'}
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
                    name="name"
                    label="租户名称"
                    xtype="input"
                    //preserve={false}
                    required={true}
                    max={50}
                />
                <IFormItem
                    name="simpleName"
                    label="租户简称"
                    xtype="input"
                    //preserve={false}
                    required={true}
                    max={50}
                />
                <IFormItem
                    name="businessId"
                    label="业务ID"
                    xtype="input"
                    required={false}
                    max={50}
                />
                <IFormItem
                    disabled={current && current.id}
                    name="root"
                    label="标识"
                    xtype="input"
                    required={true}
                    max={50}
                />
                <IFormItem
                    name="phone"
                    label="联系方式"
                    xtype="input"
                    required={false}
                    max={50}
                />
                <IFormItem
                    name="address"
                    label="地址"
                    xtype="input"
                    required={false}
                    max={200}
                />
                <IFormItem
                    name="note"
                    label="备注"
                    xtype="textarea"
                    rows={4}
                //preserve={false}
                />
            </ILayout>
        </IWindow>
    )
}