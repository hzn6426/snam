import React, { useEffect, useRef, useState } from 'react';
import { api, useAutoObservable, useAutoObservableEvent } from '@/common/utils';
import { IFormItem, ILayout, IWindow } from '@/common/components';
import { message, Radio, Select } from 'antd';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { useParams } from 'umi';

const { Option } = Select;
export default (props) => {
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [menuDisabled, setMenuDisabled] = useState(false);

    const [current, setCurrent] = useState({});

    const onSaveClick = (menu) => {
        menu.icon = menu.iconCls;
        menu.path = menu.reqUrl;
        menu.parent = menu.parentId;
        menu.name = menu.menuName;
        api.menu.saveOrUpdateMenu(menu).subscribe({
            next: () => {
                message.success('操作成功!');
                window.close();
                window.opener.onSuccess();
            }
        });
    };

    useEffect(() => {
        const param = window.opener.onGetParams();
        if (param.id) {
            setMenuDisabled(true);
        }
        setCurrent(param);
    }, []);

    return (
        <IWindow
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
            <IFormItem xtype="hidden" name="parentId" />
            <ILayout type="vbox">
                <IFormItem name="parentName" label="上级菜单" xtype="input" disabled />
                <IFormItem name="id" label="菜单ID" xtype="input" disabled={menuDisabled} required max={50} />
                <IFormItem name="menuName" label="菜单名称" xtype="input" required max={50} />
                <IFormItem name="reqUrl" label="请求URL" xtype="input" required max={100} />
                <IFormItem name="reqMethod" label="请求方法" xtype="select" required >
                    <Option value="POST">POST</Option>
                    <Option value="PUT">PUT</Option>
                    <Option value="DELETE">DELETE</Option>
                    <Option value="GET">GET</Option>
                </IFormItem>
                <IFormItem name="menuType" label="类型" xtype="select" required >
                    <Option value="ADMIN">系统</Option>
                    <Option value="BUSINESS">业务</Option>
                </IFormItem>
                <IFormItem name="iconCls" label="图标" xtype="input" required max={20} />
                <IFormItem name="beUnauth" label="忽略授权" xtype="radio" defaultValue={false} >
                    <Radio value={false}>否</Radio>
                    <Radio value={true}>是</Radio>
                </IFormItem>
                <IFormItem name="beHidden" label="是否隐藏" xtype="radio" defaultValue={false} >
                    <Radio value={false}>否</Radio>
                    <Radio value={true}>是</Radio>
                </IFormItem>
                <IFormItem name="priority" label="优先级" xtype="number" required min={1} />
            </ILayout>
        </IWindow>
    )
}