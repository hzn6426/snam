import React, { useEffect, useRef, useState } from 'react';
import { api, useAutoObservable, data2Option } from '@/common/utils';
import { IFormItem, ILayout, IWindow } from '@/common/components';
import { message } from 'antd';

export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [current,setCurrent] = useState({});
    const [positionOptions, setPositionOptions] = useState([]);
    const [disableEditUser, setDisableEditUser] = useState(false);

    const onSaveClick = (user) => {
        setLoading(true);
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
        console.log(item.userId);
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
