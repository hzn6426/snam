import { IFormItem, ILayout, IWindow } from '@/common/components';
import { api, data2Option } from '@/common/utils';
import { message, Alert } from 'antd';
import { useEffect, useState } from 'react';

export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [current,setCurrent] = useState({});
    const [positionOptions, setPositionOptions] = useState([]);
    const [disableEditUser, setDisableEditUser] = useState(false);

    const onSaveClick = (user) => {
        setLoading(true);
        user.users = [user.userId];
        api.group.addOrUpdateUser(user).subscribe({
            next:() => {
                message.success('操作成功!');
                window.close();
                window.opener.onSuccess();
            }
        }).add(() => setLoading(false));
    }

    const loadPositionByGroup = (gid) => {
        api.position.loadActiveByGroup(gid).subscribe({
            next: (data) => {
                const options = data2Option('id','postName', data);
                setPositionOptions(options);
            }
        });
    }

    useEffect(() => {
        const item = window.opener.onGetParams();
        if (item.userId) {
            setDisableEditUser(true);
        } else {
            setDisableEditUser(false);
        }
        loadPositionByGroup(item.groupId);
        setCurrent(item);
    },[]);

    return (
        <IWindow
            current={current}
            className="snam-modal"
            title={(current && current.id) ? '编辑成员' : '添加成员'}
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            {!current?.id && (<Alert size="small" style={{ fontSize: 12, marginBottom: 10 }} message="注意: 添加成员不会删除其他组织对应的成员，该成员会位于多个组织！" type="warning" showIcon={true} />)}
            <IFormItem xtype="id" />
            <IFormItem xtype="hidden" name="groupId"/>
            <ILayout type="vbox">
                <IFormItem xtype='input' name="groupName" label="所属部门" max={50} disabled />
                <IFormItem xtype='user' name="userId" label="姓名"  required disabled={disableEditUser} />
                <IFormItem xtype='select' name="positionId" label="职位" options={positionOptions} showArrow allowClear />
            </ILayout>
            </IWindow>
    )
}
