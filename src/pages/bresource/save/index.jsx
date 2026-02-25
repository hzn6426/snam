import { IFormItem, ILayout, IWindow } from '@/common/components';
import { api,constant,data2Option } from '@/common/utils';
import { Radio, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from '@umijs/max';

const { Option } = Select;
let resourceTypes = [];
api.dict.listChildByParentCode(constant.DICT_BUSINESS_RESOURCE_TYPE_TAG).subscribe({
    next: (data) => {
        resourceTypes = data2Option('dictCode', 'dictName', data);
    },
});
export default (props) => {
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [resourceDisabled, setResourceDisabled] = useState(false);

    const [current, setCurrent] = useState({});

    const onSaveClick = (resource) => {
        // resource.path = resource.reqUrl;
        // resource.parent = resource.parentId;
        // resource.name = resource.menuName;
        api.bresource.saveOrUpdateResource(resource).subscribe({
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
            setResourceDisabled(true);
        }
        setCurrent(param);
    }, []);

    return (
        <IWindow
            current={current}
            className="snam-modal"
            title={(current && current.id) ? '编辑资源' : '新建资源'}
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="hidden" name="parentId" />
            <IFormItem xtype="hidden" name="menuId" />
            <ILayout type="vbox">
                <IFormItem name="parentName" label="上级资源" xtype="input" disabled />
                <IFormItem name="id" label="资源ID" xtype="input" disabled={resourceDisabled} required max={50} />
                <IFormItem name="resourceName" label="资源名称" xtype="input" required max={50} />
                <IFormItem name="reqUrl" label="请求URL" xtype="input" required max={100} />
                <IFormItem name="reqMethod" label="请求方法" xtype="select" required >
                    <Option value="POST">POST</Option>
                    <Option value="PUT">PUT</Option>
                    <Option value="DELETE">DELETE</Option>
                    <Option value="GET">GET</Option>
                </IFormItem>
                <IFormItem name="resourceType" label="资源类型" xtype="select" options={resourceTypes} required />
                {/* <IFormItem name="iconCls" label="图标" xtype="input" max={20} /> */}
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