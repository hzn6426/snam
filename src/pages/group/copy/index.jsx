import { IFormItem, ISearchTree, IWindow } from '@/common/components';
import { api, copyObject, forEach, isEmpty, split } from '@/common/utils';
import { message } from 'antd';
import {
    ApartmentOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';

export default (props) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState({});
    const [treeData, setTreeData] = useState([]);
    const [copyCheckKey, setCopyCheckKey] = useState();
    const [copyUserKey, setCopyUserKey] = useState();

    const onSaveClick = (groupUser) => {
        if (!copyUserKey) {
            message.error('请选择要复制权限的目标用户！');
            return;
        }
        if (copyUserKey == groupUser.userId) {
            message.error('待复制的用户与目标用户为同一个用户，不需要复制权限！');
            return;
        }

        if (groupUser.groupId !== copyCheckKey) {
            message.error('待复制权限用户所在组织与目标用户不在同一个组织，不能复制权限!');
            return;
        }
        copyObject(groupUser, { toUserId: copyUserKey});

        // api.group.copyUserPerm(groupUser).subscribe({
        //     next: () => {
        //         message.success('操作成功!');
        //         window.close();
        //         window.opener.onSuccess();
        //     }
        // });
    }

    const loopGroup = (data, beNotSelectGroup) => {
        forEach((v) => {
            v.disabled = false;
            // 节点是组织不允许修改
            if (v.tag && v.tag === 'GROUP') {
                if (beNotSelectGroup) {
                    copyObject(v, {
                        selectable: false,
                        disableCheckbox: true,
                        icon: <ApartmentOutlined />,
                    });
                } else {
                    copyObject(v, {
                        selectable: true,
                        disableCheckbox: false, icon: <ApartmentOutlined />
                    });
                }
            } else {
                copyObject(v, { icon: <UserOutlined style={{ color: '#52c41a' }} /> });
            }
            if (v.children && !isEmpty(v.children)) {
                loopGroup(v.children, beNotSelectGroup);
            }
        }, data);
    };
    const loadTree = () => {
        api.group.treeAllGroupsAndUsers().subscribe({
            next: (data) => setTreeData(data)
        });
    }

    useEffect(() => {
        const item = window.opener.onGetParams();
        setCurrent(item);
        loadTree();
    }, []);

    return (
        <IWindow
            current={current}
            className="snam-modal"
            title={'复制用户权限'}
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="hidden" name="groupId" />
            <IFormItem xtype="hidden" name="userId" />
            <ISearchTree
                showIcon
                checkable={false}
                iconRender={(data) => loopGroup(data, true)}
                treeData={treeData}
                onSelect={(keys, { node, selected }) => {
                    if (!selected) {
                        return;
                    }
                    let nodeKey = node.key;
                    let copyGroupId;
                    let uid;
                    if (nodeKey.indexOf('#') !== 0) {
                        // eslint-disable-next-line prefer-destructuring
                        uid = split(nodeKey, '#')[1]
                        // uid = split('#')(nodeKey)[1];
                        copyGroupId = split(nodeKey, '#')[0];
                    }
                    setCopyUserKey(uid);
                    setCopyCheckKey(copyGroupId);
                }}
            />
        </IWindow>
    )
}
