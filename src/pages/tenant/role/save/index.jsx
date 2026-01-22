import React, { useEffect, useRef, useState } from 'react';
import { api, split, startsWith, useAutoObservableEvent } from '@/common/utils';
import { IFormItem, ILayout, IWindow } from '@/common/components';
import { message } from 'antd';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { useParams } from '@umijs/max';


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
    //         switchMap((id) => api.role.getRole(id)),
    //         map((role) => {
    //             return role[0];
    //         })
    //     ),
    //     [params.id],
    // )

    useEffect(() => { 
        if (params.id) {
            const id = params.id;
            const tenantId = split(id,'_')[1];
            
            if (startsWith('ADD',id)) {
                setCurrent({tenantId:tenantId});
            } else {
                const roleId = split(id,'_')[0];
                api.trole.getRole(roleId).subscribe({
                    next:(data) => {
                        const role = data[0];
                        role.tenantId = tenantId;
                        setCurrent(role);
                    }
                })
            }
        }
    }, [params.id])

    const [onSaveClick] = useAutoObservableEvent([
        tap(() => setLoading(true)),
        switchMap((role) => api.trole.saveOrUpdateRole(role)),
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
            title={(current && current.id) ? '编辑角色' : '新建角色'}
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
                    name="roleName"
                    label="角色名称"
                    xtype="input"
                    //preserve={false}
                    required={true}
                    max={50}
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