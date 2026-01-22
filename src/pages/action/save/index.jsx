import React, { useRef, useState } from 'react';
import { api, useAutoObservable, useAutoObservableEvent } from '@/common/utils';
import { IFormItem, ILayout, IWindow } from '@/common/components';
import { message, Radio } from 'antd';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { useParams } from '@umijs/max';


export default (props) => {
    const ref = useRef();
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);

    const [current, setCurrent] = useAutoObservable((inputs$) =>
        inputs$.pipe(
            map(([id]) => id),
            filter(id => id !== 'ADD'),
            switchMap((id) => api.action.getAction(id)),
            map((role) => {
                return role[0];
            })
        ),
        [params.id],
    )

    const [onSaveClick] = useAutoObservableEvent([
        tap(() => setLoading(true)),
        switchMap((action) => api.action.saveOrUpdateAction(action)),
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
            title={(current && current.id) ? '编辑Action' : '新建Action'}
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
                <IFormItem name="actionValue" label="权限动作" xtype="input"  labelCol={{ flex: '120px' }} required={true} />
                <IFormItem name="actionIgnoreUserScope" label="忽略用户权限" xtype="radio" labelCol={{ flex: '120px' }} defaultValue={false} >
                    <Radio value={false}>否</Radio>
                    <Radio value={true}>是</Radio>
                </IFormItem>
                <IFormItem name="actionIgnoreGroupScope" label="忽略组织权限" xtype="radio" labelCol={{ flex: '120px' }} defaultValue={false} >
                    <Radio value={false}>否</Radio>
                    <Radio value={true}>是</Radio>
                </IFormItem>
                <IFormItem name = "actionIgnoreCompanyScopeTags" label="忽略公司权限TAG" labelCol={{ flex: '120px' }} size = "small" xtype="textarea" rows={1}/>
                <IFormItem name = "actionOnlyFilterCompanyTags" label="只过滤公司TAG" labelCol={{ flex: '120px' }} xtype="textarea" rows={1}/>
                <IFormItem name="connectValue" label="动作连接" xtype="textarea" rows={1} labelCol={{ flex: '120px' }} required={true} />
                <IFormItem name = "connectIgnoreUserScopeTags" label="忽略用户权限TAG" labelCol={{ flex: '120px' }} xtype="textarea" rows={1}/>
                <IFormItem name = "connectIgnoreGroupScopeTags" label="忽略组织权限TAG" labelCol={{ flex: '120px' }} xtype="textarea" rows={1}/>
                <IFormItem name="connectBeAlwaysFilterCreateUserColumn" label="过滤用户列" labelCol={{ flex: '120px' }} xtype="radio" defaultValue={true} >
                    <Radio value={false}>否</Radio>
                    <Radio value={true}>是</Radio>
                </IFormItem>
                <IFormItem name = "connectUserAuthColumn" label="用户权限列" labelCol={{ flex: '120px' }} xtype="textarea" rows={1}/>
                <IFormItem name = "connectGroupAuthColumn" label="组织权限列" labelCol={{ flex: '120px' }} xtype="textarea" rows={1}/>
                <IFormItem name="connectTableNameWithAuthInject" label="权限注入表名" labelCol={{ flex: '120px' }} xtype="input" required={false} />
                <IFormItem name="connectTableNameWithColumnInject" label="列权限注入表名" labelCol={{ flex: '120px' }} xtype="input" required={false} />
                <IFormItem name="note" label="备注" xtype="textarea" rows={1} labelCol={{ flex: '120px' }}/>
            </ILayout>
        </IWindow>
    )
}