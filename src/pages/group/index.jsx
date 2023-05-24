import React, { useEffect, useRef, useState } from 'react';
import { api, data2Option, pluck, split, useAutoObservableEvent, useObservableAutoCallback, copyObject, forEach, isEmpty, INewWindow,constant } from '@/common/utils';
import {
    ApartmentOutlined,
    UserOutlined,
    DeleteOutlined,
    FormOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { IFooterToolbar, IGrid, IDrag, ISearchTree, Permit } from '@/common/components';
import User from '@/components/User'

import { showDeleteConfirm } from '@/common/antd';
import { Button, Card, Checkbox, Col, Form, Input, message, Modal, Row, Space, Tree, } from 'antd';
import { debounceTime, distinctUntilChanged, map, shareReplay, switchMap, tap, } from 'rxjs/operators';
import { of } from 'rxjs';


export default (props) => {
    // 列初始化
    const initColumns = [
        {
            title: '账号',
            width: 150,
            align: 'center',
            dataIndex: 'userName',
        },
        {
            title: '姓名',
            width: 150,
            align: 'center',
            dataIndex: 'userRealCnName',
        },
        {
            title: '角色',
            width: 150,
            align: 'center',
            dataIndex: 'userRoles',
        },
        {
            title: '职位',
            width: 150,
            align: 'center',
            dataIndex: 'userPosts',
        },
        {
            title: '手机',
            align: 'center',
            width: 150,
            dataIndex: 'userMobile',
        },
        {
            title: '邮箱',
            align: 'center',
            width: 150,
            dataIndex: 'userEmail',
        },
        {
            title: '备注',
            align: 'center',
            width: 250,
            dataIndex: 'note',
        },

    ];

    const [searchForm] = Form.useForm();
    const [dataSource, setDataSource] = useState([]);

    const [notAssignedDataSource, setNotAssignedDataSource] = useState([]);

    const [searchLoading, setSearchLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    // 分配用户窗口中树的数据
    const [treeData, setTreeData] = useState([]);
    // 选中的组织ID
    const [selectedGroupId, setSelectedGroupId] = useState();
    // 选中的组织名称
    const [selectedGroupName, setSelectedGroupName] = useState();
    // 父ID
    const [selectedParentId, setSelectedParentId] = useState();
    // 是否刷新表格
    const [beReloadTree, setBeReloadTree] = useState(false);

    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [middleHeight] = useState((clientHeight - 90) / 2);
    const [topHeight, setTopHeight] = useState(middleHeight - 90);
    const [bottomHeight, setBottomHeight] = useState(middleHeight - 90);



    const reloadTree = () => {
        setBeReloadTree(!beReloadTree);
    };

    const [onGroupUserChange, selectedGroupUserKeys, setSelectedGroupUserKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((v) => of(pluck('id', v))),
            shareReplay(1),
        ),
    );

    const [onNotAssignUserChange, selectedNotAssignUserKeys, setSelectedNotAssignUserKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((v) => of(pluck('id', v))),
            shareReplay(1),
        ),
    );

    // const delayedQuery = useRef(debounce((value) => onChange(value), 300)).current;

    // 将组织设置为不可选
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
        }, data);
    };

    //查询
    const loadGroup = () => {
        let param = { dto: searchForm.getFieldValue() };
        api.group.treeAllGroupsAndUsers(param).subscribe({
            next: (data) => {
                setTreeData(data);
            },
        });
    };


    //编辑 组织架构
    const handleEditGroup = (node) => {
        const parent = node.parentId;
        setSelectedGroupId(parent);
        if (parent === constant.ROOT_OF_GROUP) {
            const param = { id: node.key, groupName: node.text }
            INewWindow({
                url: '/new/group/company',
                title: '编辑公司',
                width: 600,
                height: 300,
                callback: () => reloadTree(),
                callparam: () => param,
            });
        } else {
           const param = {
                id: node.key,
                groupName: node.text,
                parentName: node.parentGroupName,
            };
            INewWindow({
                url: '/new/group/save',
                title: '编辑组织',
                width: 600,
                height: 300,
                callback: () => reloadTree(),
                callparam: () => param,
            });
        }
    };
    //添加 组织架构
    const handleAddGroup = (node) => {
        const param = {
            id: '',
            groupName: '',
            parentId: node.key,
            parentName: node.text,
        }
        setSelectedParentId(node.key)
        INewWindow({
            url: '/new/group/save',
            title: '编辑组织',
            width: 600,
            height: 300,
            callback: () => reloadTree(),
            callparam: () => param,
        });
    };
    // 删除 组织架构
    const handleDeleteGroup = (node) => {
        const id = node.key;
        api.group.deleteGroup(id).subscribe({
            next: (data) => {
                setSelectedGroupId(node.parentId);
                reloadTree();
                setSelectedGroupUserKeys([]);
            },
        });
    };

    // 查询 用户信息
    const searchUserByGroup = (pageNo, pageSize) => {
        setSelectedGroupUserKeys([]);
        setSearchLoading(true);
        let param = { dto: searchForm.getFieldValue(), pageNo: pageNo, pageSize: pageSize };
        param.dto.groupId = selectedGroupId;
        return api.group.searchUserByGroup(param).subscribe({
            next: (data) => {
                setDataSource(data.data);
                setTotal(data.total);
            },
        }).add(() => {
            setSearchLoading(false);
        });
    };

    // 查询 未分配的用户信息
    const searchNotAssignedUser = (pageNo, pageSize) => {
        let param = { dto: {}, pageNo: pageNo, pageSize: pageSize };
        return api.group.searchNotAssignedUser(param).subscribe({
            next: (data) => {
                setNotAssignedDataSource(data.data);
                setTotal(data.total);
            },
        }).add(() => {
            setSearchLoading(false);
        });

    };

    // 双击用户 显示详情
    const onDoubleClick = (record) => {
        const param = {
            id: record.ugId,
            groupId: selectedGroupId,
            groupName: selectedGroupName,
            userId: record.id,
            positionId: record.positionId,
        };
        INewWindow({
            url: '/new/group/user',
            title: '编辑用户',
            width: 600,
            height: 300,
            callback: () => reloadTree(),
            callparam: () => param,
        });
    }

    // 添加用户
    const handleAddUser = (user) => {
        if (!selectedGroupId || selectedGroupId === constant.ROOT_OF_GROUP) {
            message.error('请先选择一个部门或者公司!');
            return;
          }
          const param = { groupId: selectedGroupId, groupName: selectedGroupName }
          INewWindow({
            url: '/new/group/user',
            title: '编辑用户',
            width: 600,
            height: 300,
            callback: () => reloadTree(),
            callparam: () => param,
        });
    };

    // 从组织中删除用户
    const onDeleteUser = () => {
        const userGroup = { groupId: selectedGroupId, users: selectedGroupUserKeys };
        api.group.deleteUsers(userGroup).subscribe({
        next: () => {
            message.success('操作成功！');
            setSelectedGroupUserKeys([]);
            searchUserByGroup(pageNo, pageSize);
            searchNotAssignedUser();
        }});
    }

    //移动用户
    const onMove = () => {
        if (selectedGroupUserKeys.length === 0) {
            message.error('请至少选择一个要移动的用户！');
            return;
          }
          const param = { groupId: selectedGroupId, users: selectedGroupUserKeys.join(',') };
          INewWindow({
            url: '/new/group/move',
            title: '移动用户',
            width: 700,
            height: 600,
            callback: () => reloadTree(),
            callparam: () => param,
        });
    }
   

    // 将未分配的用户添加到分组中
    const addUser2Group = () => {
        if (!selectedGroupId || selectedGroupId === constant.ROOT_OF_GROUP) {
            message.error('请先选择一个部门或者公司!');
            return;
          }
          const userGroup = { groupId: selectedGroupId, users: selectedNotAssignUserKeys };
          api.group.addOrUpdateUser(userGroup).subscribe({
            next: () => {
              message.success('操作成功！');
              searchUserByGroup(pageNo, pageSize);
              searchNotAssignedUser();
            },
          });
    }
    

    // 添加分公司
    const handleAddCompany = () => {
        INewWindow({
            url: '/new/group/company',
            title: '添加公司',
            width: 600,
            height: 300,
            callback: () => reloadTree(),
            callparam: () => {},
        });
    };

    // 分配角色 查询
    const handleAssignRoles = () => {
        if (selectedGroupUserKeys.length !== 1) {
            message.error('只能选择一条用户数据');
            return;
        }
        const uid = selectedGroupUserKeys[0];
        api.group.listRoleByUser(uid, selectedGroupId).subscribe({
            next: (data) => {
                const arr = [];
                forEach((v) => {
                    arr.push(v.id);
                }, data || []);
                const param = { userId: uid, roleIds: arr, orgId: selectedGroupId };
                INewWindow({
                    url: '/new/group/role',
                    title: '分配角色',
                    width: 700,
                    height: 600,
                    callback: () => reloadTree(),
                    callparam: () => param,
                });
            },
        });
    };


    useEffect(() => {
        loadGroup();
        searchNotAssignedUser();
    }, [beReloadTree]);

    useEffect(() => {
        searchUserByGroup(pageNo, pageSize);
    }, [selectedGroupId]);

    // 列表及弹窗
    return (
        <Row gutter={5}>
            <Col span={7}>
                <ISearchTree
                    iconRender={loopGroup}
                    treeData={treeData}
                    placeholder="输入组织或人员进行搜索"
                    checkable={false}
                    blockNode={true}
                    titleRender={(node) => (
                        <div style={{ width: '100%' }}>
                            <div style={{ float: 'left' }}>
                                {node.icon} {node.title}
                            </div>
                            <div style={{ float: 'right', zIndex: 999 }}>
                                <Space>
                                <Permit authority="group:addDepartment" key="addDepartment">
                                    <PlusOutlined
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddGroup(node);
                                        }}
                                    />
                                </Permit>
                                <Permit authority="group:update" key="update">
                                    <FormOutlined
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditGroup(node);
                                        }}
                                    />
                                </Permit>
                                <Permit authority="group:delete" key="delete">
                                    <DeleteOutlined
                                        onClick = {(e) => showDeleteConfirm('删除组织架构前，请组织中不包含子组织和用户，确定要删除该组织吗？',() => handleDeleteGroup(node))}
                                    />
                                </Permit>
                                </Space>
                            </div>
                        </div>
                    )}
                    onSelect={(keys, { selected, node }) => {
                        if (selected) {
                            setSelectedGroupId(keys[0]);
                            setSelectedGroupName(node.text);
                        }
                    }}
                />

            </Col>
            <Col span={17}>
                <IDrag style={{ width: '100%', height: clientHeight - 105 }} topHeight={topHeight} layout='horizontal' resize={(res) => { setTopHeight(res.top); setBottomHeight(res.bottom); }}>
                    <div>
                        <IGrid
                            title="用户列表"
                            initColumns={initColumns}
                            request={(pageNo, pageSize) => searchUserByGroup(pageNo, pageSize)}
                            dataSource={dataSource}
                            total={total}
                            height={topHeight - 70}
                            onSelectedChanged={onGroupUserChange}
                            clearSelect={searchLoading}
                            pageNo={pageNo}
                            pageSize={pageSize}
                            onDoubleClick={(record) => onDoubleClick(record)}

                            toolBarRender={[
                                <Space key='space'>
                                <Button
                                    key="addUser"
                                    type="primary"
                                    size="small"
                                    onClick={handleAddUser}>添加成员</Button>
                                <Button
                                    key="addCompany"
                                    type="danger"
                                    size="small"
                                    onClick={handleAddCompany}>添加分公司</Button>
                                <Button
                                    key="assignRole"
                                    type="primary"
                                    size="small"
                                    onClick={handleAssignRoles}>分配角色</Button>
                                </Space>

                            ]}
                        />
                        {selectedGroupUserKeys?.length > 0 && (
                            <IFooterToolbar>
                                 <Permit authority="group:moveUsers">
                                <Button type="primary" key="move" onClick={() => onMove()}>
                                    移动
                                </Button>
                                </Permit>
                                <Permit authority="group:removeUsers">
                                <Button type="danger" key="delete" onClick={() => showDeleteConfirm('确定要从组织中删除选中的用户吗?', () => onDeleteUser())}>
                                    删除
                                </Button>
                                </Permit>
                            </IFooterToolbar>
                        )}
                    </div>
                    <div>
                        <IGrid
                            title="未分配列表"
                            initColumns={initColumns}
                            request={(pageNo, pageSize) => searchNotAssignedUser(pageNo, pageSize)}
                            dataSource={notAssignedDataSource}
                            total={total}
                            height={bottomHeight}
                            onSelectedChanged={onNotAssignUserChange}
                            clearSelect={searchLoading}
                        />
                        {selectedNotAssignUserKeys?.length > 0 && (
                            <IFooterToolbar>
                                <Permit authority="group:addUsers" key="addUsers">
                                <Button type="primary" key="addUser2Group"onClick={() => addUser2Group()}>
                                    添加成员
                                </Button>
                                </Permit>
                            </IFooterToolbar>
                        )}
                    </div>
                </IDrag>
            </Col>
        </Row>
    );


}