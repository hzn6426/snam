import { IFormItem, IIF, ILayout, IWindow } from '@/common/components';
import { api, useAutoObservable, useAutoObservableEvent } from '@/common/utils';
import { message } from 'antd';
import { useRef, useState } from 'react';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { useParams } from 'umi';


export default (props) => {
    const ref = useRef();
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [bindUserType, setBindUserType] = useState('tenant');

    const [current, setCurrent] = useAutoObservable((inputs$) =>
        inputs$.pipe(
            map(([id]) => id),
            filter(id => id !== 'ADD'),
            switchMap((id) => api.hmac.getHmacUser(id)),
            map((user) => {
                const u =  user[0];
                if (u.bindType === 'user') {
                    u.userId = u.orgId + '#' + u.userNo;
                }
                return u;
            })
        ),
        [params.id],
    )

    const [onSaveClick] = useAutoObservableEvent([
        tap(() => setLoading(true)),
        switchMap((user) => api.hmac.saveOrUpdateHmacUser(user)),
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
            title={(current && current.id) ? '编辑接入用户' : '新建接入用户'}
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
                    name="systemName"
                    label="系统名称"
                    xtype="input"
                    required={true}
                    max={50}
                />
                <IFormItem
                    name="appId"
                    label="APPID"
                    xtype="input"
                    required={false}
                    disabled={true}
                    max={50}
                    tooltip="APPID由系统自动生成!"
                />
                <IFormItem
                    name="appKey"
                    label="APPKEY"
                    xtype="input"
                    required={false}
                    disabled={true}
                    max={50}
                    tooltip="APPKEY由系统自动生成!"
                />
                <IFormItem
                    name="bindType"
                    label="关联类型"
                    xtype="select"
                    defaultValue={'tenant'}
                    required={true}
                    onChange={(v) => setBindUserType(v)}
                    options={() => [
                        { label: '用户', value: 'user' },
                        { label: '租户', value: 'tenant' },
                    ]}
                />
                <IIF test={bindUserType === 'user'}>
                    <IFormItem
                        name="userId"
                        label="关联用户"
                        xtype="xuser"
                        required={true}
                    />
                </IIF>
                <IIF test={bindUserType === 'tenant'}>
                    <IFormItem
                        name="userId"
                        label="关联用户"
                        xtype="tuser"
                        required={true}
                    />
                </IIF>
                <IFormItem
                    name="expireDate"
                    label="过期时间"
                    placeholder="不填为永不过期"
                    xtype="datetime"
                    required={false}
                />
                <IFormItem
                    name="whilteIps"
                    label="白名单"
                    placeholder="不填为不限制,多个以逗号间隔"
                    xtype="input"
                    required={false}
                    tooltip="支持192.168.10.10/24格式"
                />
                <IFormItem
                    name="note"
                    label="备注"
                    xtype="textarea"
                    rows={4}
                />
            </ILayout>
        </IWindow>
    )
}