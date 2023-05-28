import { IFormItem, ILayout, IWindow } from '@/common/components';
import { api } from '@/common/utils';
import { Radio, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'umi';

const { Option } = Select;
export default (props) => {
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [buttonDisabled, setButtonDisabled] = useState(false);

    const [current, setCurrent] = useState({});

    const onSaveClick = (button) => {
        api.menu.saveOrUpdateButton(button).subscribe({
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
            setButtonDisabled(true);
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
            <IFormItem xtype="hidden" name="menuId" />
            <IFormItem xtype="hidden" name="permId" />
            <ILayout type="vbox">
                <IFormItem name="menuName" label="菜单名称" xtype="input" disabled labelCol={{ flex: '110px' }} />
                <IFormItem name="id" label="按钮ID" xtype="input" disabled={buttonDisabled} required max={50} labelCol={{ flex: '110px' }} tooltip="格式为 菜单ID:按钮功能" />
                <IFormItem name="buttonName" label="按钮名称" xtype="input" required max={50} labelCol={{ flex: '110px' }} />
                <IFormItem name="subMenu" label="子菜单名称" xtype="input" required max={50} labelCol={{ flex: '110px' }} tooltip="权限按钮所在的菜单分组" />
                <IFormItem name="reqUrl" label="请求URL" xtype="input" required max={100} labelCol={{ flex: '110px' }} />
                <IFormItem name="reqMethod" label="请求方法" xtype="select" required labelCol={{ flex: '110px' }} >
                    <Option value="POST">POST</Option>
                    <Option value="PUT">PUT</Option>
                    <Option value="DELETE">DELETE</Option>
                    <Option value="GET">GET</Option>
                </IFormItem>

                <IFormItem name="beUnauth" label="忽略授权" xtype="radio" defaultValue={false} labelCol={{ flex: '110px' }}>
                    <Radio value={false}>否</Radio>
                    <Radio value={true}>是</Radio>
                </IFormItem>
                <IFormItem name="permAction" label="权限标识" xtype="input" max={30} labelCol={{ flex: '110px' }} tooltip="修改后可能导致数据权限不生效,请谨慎修改!" />
                <IFormItem name="actionRef" label="权限引用" xtype="input" max={30} labelCol={{ flex: '110px' }} tooltip="引用某个数据权限标识,以满足相同的数据权限!" />
            </ILayout>
        </IWindow>
    )
}