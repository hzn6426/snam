import React, { useEffect, useRef, useState } from 'react';
import { api, copyObject, useAutoObservable, useAutoObservableEvent } from '@/common/utils';
import { IFormItem, ISearchTree, IWindow } from '@/common/components';
import { message } from 'antd';

export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [current,setCurrent] = useState({});
    const [treeData, setTreeData] = useState([]);
    const [moveCheckKey, setMoveCheckKey] = useState();

    const onSaveClick = (groupUser) => {
        if (!moveCheckKey) {
            message.error('请选择要移动的目标组织！');
            return;
          }
          if (groupUser.groupId === moveCheckKey) {
            message.error('用户所在组织与移动的目标组织相同，不需要移动!');
            return;
          }
        copyObject(groupUser, { users: groupUser.users.split(','), toGroupId: moveCheckKey });
        
        api.group.moveUsers(groupUser).subscribe({
            next:() => {
                message.success('操作成功!');
                window.close();
                window.opener.onSuccess();
            }
        });
    }
    const loadTree = () => {
        api.group.treeAllGroups().subscribe({
            next: (data) => setTreeData(data)
        });
    }

    useEffect(() => {
        const item = window.opener.onGetParams();
        setCurrent(item);
        loadTree();
    },[]);

    return (
        <IWindow
            current={current}
            className="snam-modal"
            title={(current && current.id) ? '编辑分公司' : '新建分公司'}
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="hidden" name="groupId"/>
            <IFormItem xtype="hidden" name="users"/>
            <ISearchTree 
            showIcon
            checkable={false}
            treeData={treeData}
            onSelect={(keys, { selected }) => {
                if (selected) {
                  setMoveCheckKey(keys[0]);
                }
              }}
               />
            </IWindow>
    )
}
