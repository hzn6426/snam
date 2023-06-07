import { IFormItem, ILayout, IWindow } from '@/common/components';
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

    const [current, setCurrent] = useAutoObservable((inputs$) =>
        inputs$.pipe(
            map(([id]) => id),
            filter(id => id !== 'ADD'),
            switchMap((id) => api.hmac.getHmacUser(id)),
            map((user) => {
                return user[0];
            })
        ),
        [params.id],
    )

    const [onSaveClick] = useAutoObservableEvent([
        tap(() => setLoading(true)),
        switchMap((user) => api.hmac.saveOrUpdateHmacUser(user)),
        tap(() => {
            message.success('操作成功!');
            // window.close();
            // window.opener.onSuccess();
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
                    name="userId"
                    label="关联用户"
                    xtype="user"
                    required={true}
                />
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
                    xtype="datetime"
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