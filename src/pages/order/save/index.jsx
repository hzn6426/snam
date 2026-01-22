import { IFormItem, ILayout, IWindow } from '@/common/components';
import { api, constant, useAutoObservable, useAutoObservableEvent } from '@/common/utils';
import { message } from 'antd';
import { useRef, useState } from 'react';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { useParams } from '@umijs/max';


export default (props) => {
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const ref = useRef();
    const [current, setCurrent] = useAutoObservable((inputs$) =>
        inputs$.pipe(
            map(([id]) => id),
            filter(id => id !== 'ADD'),
            switchMap((id) => api.order.getOrder(id)),
            map((order) => {
                return order[0];
            })
        ),
        [params.id],
    )

    const [onSaveClick] = useAutoObservableEvent([
        tap(() => setLoading(true)),
        switchMap((item) => api.order.saveOrUpdateOrder(item)),
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
            title={(current && current.id) ? '编辑提单' : '新建提单'}
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="id" />
            <IFormItem xtype="hidden" name="itemName" />
            <IFormItem xtype="hidden" name="seller" />
            <IFormItem xtype="hidden" name="service" />
            <ILayout type="hbox" spans="12 12">
                <IFormItem
                    name="code"
                    label="编码"
                    xtype="input"
                    required={false}
                    disabled={true}
                    tooltip="由系统自动生成"
                    max={30}
                />
                <IFormItem
                    name="itemId"
                    label="商品"
                    xtype="item"
                    required={true}
                    max={100}
                    onGetItem={(v) => ref.current.setFieldsValue({ itemName: v.label })}
                />
            </ILayout>
            <ILayout type="hbox" spans="12 12">
                <IFormItem
                    name="price"
                    label="单价"
                    xtype="number"
                    required={true}
                />
                <IFormItem
                    name="quantity"
                    label="数量"
                    xtype="number"
                    required={true}
                    min={1}
                />
            </ILayout>
            <ILayout type="hbox" spans="12 12">
                <IFormItem
                    name="serviceCode"
                    label="客服"
                    xtype="xuser"
                    tag={constant.TAG_USER_SERVICE}
                    required={true}
                    onChange={(v,label) => ref.current.setFieldsValue({ service: label[0] })}
                />
                <IFormItem
                    name="sellerCode"
                    label="销售"
                    xtype="xuser"
                    tag={constant.TAG_USER_SALLER}
                    required={true}
                    onChange={(v, label) => {ref.current.setFieldsValue({ seller: label[0]});}}
                />
            </ILayout>
            {/* <ILayout type="hbox" spans="12 12">
                <IFormItem
                    name="buyer"
                    label="购买人"
                    xtype="input"
                    required={true}
                />
                <IFormItem
                    name="buyerTel"
                    label="电话"
                    xtype="input"
                    required={true}
                />
            </ILayout> */}
            <ILayout type="vbox" >
                <IFormItem
                    name="buyerAddress"
                    label="地址"
                    xtype="textarea"
                    rows={4}
                    max={100}
                />
            </ILayout>
            <ILayout type="vbox" >
                <IFormItem
                    name="note"
                    label="备注"
                    xtype="textarea"
                    rows={4}
                    max={100}
                />
            </ILayout>
        </IWindow>
    )
}