import React, { useEffect, useRef, useState } from 'react';
import { api, useAutoObservable, useAutoObservableEvent, forEach, isEmpty, produce, mapObjIndexed, copyObject, split } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IGroupTree,ISearchTree } from '@/common/components';
import { message, Card, Space } from 'antd';
import {
    ApartmentOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { of, zip } from 'rxjs';
import { useParams } from 'umi';



export default (props) => {

    const params = useParams();
    // 分配用户窗口中树的选中用户ID列表
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState({});
    const [treeData, setTreeData] = useState([]);

    const treeAllGroupsAndUsers = () => {
        api.group.treeAllGroupsAndUsers().subscribe({
            next: (data) => {
                setTreeData(data);
            }
        })
    }

    const loadGroupUsersByRole = (roleId) => {
        api.user.listGroupUsersByRole(roleId).subscribe({
            next:(data) => {
                const ids = [];
                forEach((v) => {
                    let groups = [];
                    if (v.groupId) {
                        groups = v.groupId.split(',');
                    }
                    forEach((g) => {
                        ids.push(`${g}#${v.id}`);
                    }, groups);
                }, data);
                setSelectedUserIds(ids);
            }
        });
    }

    useEffect(() => {
        setCurrent({roleId:params.id});
        loadGroupUsersByRole(params.id);
        treeAllGroupsAndUsers();
    },[params.id])

    let maps = {};

    const addValueToList = (key, value) => {
        // if the list is already created for the "key", then uses it
        // else creates new list for the "key" to store multiple values in it.
        maps[key] = maps[key] || [];
        maps[key].push(value);
    };

    const [onSaveClick] = useAutoObservableEvent([
        tap(() => setLoading(true)),
        map(([userRole, userIds]) => {
            maps = {};
            if (!isEmpty(userIds)) {
                forEach((v) => {
                    if (v.indexOf('#') !== -1) {
                        // eslint-disable-next-line no-param-reassign
                        const uid = split(v,'#')[1];
                        const gid = split(v,'#')[0];
                        addValueToList(gid, uid);
                    }
                }, userIds);
            }
            const groupUsers = [];
            mapObjIndexed((index, k, v) => {
                // eslint-disable-next-line no-param-reassign
                groupUsers.push({ groupId: k, users: v[k] });
            }, maps);
            copyObject(userRole, { groupUsers });
            return userRole;
        }),
        switchMap((userRole) => api.role.saveUserRole(userRole)),
        tap(() => {
            message.success('操作成功!');
            setSelectedUserIds([]);
            window.close();
            window.opener.onSuccess();
        }),
        shareReplay(1),
    ], () => setLoading(false));

    const loopGroup = (data) => {
        forEach((v) => {
            // 节点是组织不允许修改
            if (v.tag && v.tag === 'GROUP') {
                copyObject(v, { icon: <ApartmentOutlined /> });
            } else {
                copyObject(v, { icon: <UserOutlined style={{ color: '#52c41a' }} /> });
            }
            if (v.children && !isEmpty(v.children)) {
                loopGroup(v.children);
            }
        },data);
    };



    return (

        <IWindow
            current={current}
            className="snam-modal"
            title="角色分配用户"
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick([params, selectedUserIds])}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="hidden" name="roleId" />
            <ISearchTree
            showIcon={true}
            iconRender={loopGroup}
            treeData={treeData}
            placeholder="输入组织或人员进行搜索"
            checkable={true}
            checkedKeys={selectedUserIds}
            onCheck={(checked) => {
                setSelectedUserIds(checked);
            }}
            />
            {/* <IGroupTree
                checkable
                checkedKeys={selectedUserIds}
                onCheck={(checked) => {
                    setSelectedUserIds(checked);
                }}
            /> */}

        </IWindow>
    )


}