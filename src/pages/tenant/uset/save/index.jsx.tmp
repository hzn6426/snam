import React, { useEffect, useRef, useState } from 'react';
import { api, split, startsWith, useAutoObservable, useAutoObservableEvent } from '@/common/utils';
import { IFormItem, ILayout, IWindow } from '@/common/components';
import { message } from 'antd';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { useParams } from 'umi';
import { set } from 'lscache';


export default (props) => {
    const ref = useRef();
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState({});
    // const [current, setCurrent] = useAutoObservable((inputs$) =>
    //     inputs$.pipe(
    //         map(([id]) => id),
    //         filter(id => id !== 'ADD'),
    //         switchMap((id) => api.uset.getUset(id)),
    //         map((uset) => {
    //             return uset[0];
    //         })
    //     ),
    //     [params.id],
    // )

    useEffect(() => {
        const tenantId = split(params.id, '_')[1];
        if (startsWith('ADD',params.id)) {
            setCurrent({tenantId:tenantId});
        } else {
            const usetId = split(params.id, '_')[0];
            api.tuset.getUset(usetId).subscribe({
                next:(data) => {
                    const uset = data[0];
                    uset.tenantId = tenantId;
                    setCurrent(uset);
                }
            })
        }
    },[params.id])


    const [onSaveClick] = useAutoObservableEvent([
        tap(() => setLoading(true)),
        switchMap((uset) => api.tuset.saveOrUpdateUset(uset)),
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
            title={(current && current.id) ? '编辑用户组' : '新建用户组'}
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="id" />
            <IFormItem xtype="hidden" name="tenantId" />
            <ILayout type="vbox">
                <IFormItem
                    name="usetName"
                    label="组名称"
                    xtype="input"
                    required={true}
                    max={50}
                />
                <IFormItem
                    name="note"
                    label="备注说明"
                    xtype="textarea"
                    rows={4}
                />
            </ILayout>
        </IWindow>
    )
}