import { IDrag, IFooterToolbar, IAGrid, ISearchTree, Permit, IStatus, } from '@/common/components';
import { api, constant, copyObject, forEach, INewWindow, isEmpty, pluck, useObservableAutoCallback, beHasRowsPropNotEqual, useAutoObservableEvent } from '@/common/utils';
import {
    ApartmentOutlined,
    DeleteOutlined,
    FormOutlined,
    PlusOutlined,
    UserOutlined,
    LockTwoTone,
    UnlockTwoTone,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';

import { showDeleteConfirm } from '@/common/antd';
import { Button, Col, Form, message, Row, Space, Tag, Tooltip } from 'antd';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, shareReplay, switchMap, tap, filter } from 'rxjs/operators';

const TagRenderer = (props) => {
    if (props.value) {
        return <Tag color="#f50">{props.value}</Tag>;
    }
    return <>员工</>;
}

//组件
const LockRenderer = (props) => {
    return props.value ? (
        <LockTwoTone twoToneColor="#FF0000" />
    ) : (
        <UnlockTwoTone twoToneColor="#52c41a" />
    );
};

const userState = {
    UNACTIVE: { text: '未激活', status: 'Warning' },
    ACTIVE: { text: '启用', status: 'Success' },
    STOPPED: { text: '停用', status: 'Default' },
    LOCKED: { text: '锁定', status: 'Error' },
};

const StateRenderer = (props) => {
    return props.value && <IStatus value={props.value} state={userState} />;
};

export default (props) => {
    // 列初始化
    const initColumns = [
        {
            headerName: '序号',
            textAlign: 'center',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            lockPosition: 'left',
            width: 80,
            cellStyle: { userSelect: 'none' },
            valueFormatter: (params) => {
                return `${parseInt(params.node.id) + 1}`;
            },
            // rowDrag: true,
        },
        {
            headerName: '状态',
            width: 80,
            align: 'center',
            field: 'state',
            cellRenderer: StateRenderer,
        },
        {
            headerName: '账号',
            width: 100,
            align: 'left',
            field: 'userName',
        },
        {
            headerName: '锁定',
            width: 70,
            field: 'beLock',
            cellRenderer: LockRenderer
        },
        {
            headerName: '姓名',
            width: 90,
            field: 'userRealCnName',
        },
        {
            headerName: '角色',
            width: 150,
            field: 'left',
            dataIndex: 'userRoles',
        },
        {
            headerName: '职位',
            width: 130,
            field: 'postName',
            cellRenderer: TagRenderer,
        },
        {
            headerName: '手机',
            align: 'center',
            width: 120,
            field: 'userMobile',
        },
        {
            headerName: '邮箱',
            align: 'left',
            width: 150,
            field: 'userEmail',
        },
        {
            headerName: '备注',
            align: 'left',
            width: 200,
            field: 'note',
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

    const [loading, setLoading] = useState(false);

    const [disabledActive, setDisabledActive] = useState(true);
    const [disabledStop, setDisabledStop] = useState(true);
    const [disabledUnStop, setDisabledUnStop] = useState(true);



    const reloadTree = () => {
        setBeReloadTree(!beReloadTree);
    };

    const [onGroupUserChange, selectedGroupUserKeys, setSelectedGroupUserKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap((keys) => {
                setDisabledActive(beHasRowsPropNotEqual('state', 'UNACTIVE', keys));
                setDisabledStop(beHasRowsPropNotEqual('state', 'ACTIVE', keys));
                setDisabledUnStop(beHasRowsPropNotEqual('state', 'STOPPED', keys));
            }),
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
                copyObject(v, {
                    selectable: false,
                    disableCheckbox: true, icon: <UserOutlined style={{ color: '#52c41a' }} />
                });
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
            title: '添加子组织',
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

    const [onActive] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            filter((keys) => !isEmpty(keys)),
            switchMap((keys) => api.user.activeUser(keys)),
            tap(() => {
                message.success('操作成功!');
                refresh();
                reloadTree();
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    const [onStop] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            switchMap((keys) => api.user.stopUser(keys)),
            tap(() => {
                message.success('操作成功!');
                refresh();
                reloadTree();
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    const [onUnStop] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            switchMap((keys) => api.user.unstopUser(keys)),
            tap(() => {
                message.success('操作成功!');
                refresh();
                reloadTree();
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

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
            callback: () => searchUserByGroup(pageNo, pageSize),
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
            callback: () => { reloadTree(); searchUserByGroup(pageNo, pageSize); },
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
                reloadTree();
            }
        });
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
                reloadTree();
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
            callparam: () => { },
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
                    callback: () => searchUserByGroup(pageNo, pageSize),
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

    const { offsetHeight } = window.document.getElementsByClassName("cala-body")[0]; //获取容器高度
    // 列表及弹窗
    return (
        <Row >
            <Col span={7}>
                <ISearchTree
                    iconRender={loopGroup}
                    treeData={treeData}
                    placeholder="输入组织或人员进行搜索"
                    checkable={false}
                    blockNode={true}
                    bodyStyle={{ height: offsetHeight - 110, overflow: 'scroll' }}
                    titleRender={(node) => (
                        <div style={{ width: '100%' }}>
                            <div style={{ float: 'left' }}>
                                {node.icon} {node.title}
                            </div>
                            {node.tag && node.tag === 'GROUP' && (
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
                                                onClick={(e) => showDeleteConfirm('删除组织架构前，请组织中不包含子组织和用户，确定要删除该组织吗？', () => handleDeleteGroup(node))}
                                            />
                                        </Permit>
                                    </Space>
                                </div>)}
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
                {/* <IDrag style={{ width: '100%', height: (clientHeight - 125) + 'px' }} topHeight={topHeight} layout='horizontal' resize={(res) => { setTopHeight(res.top); setBottomHeight(res.bottom); }}>
                    <div> */}
                <div style={{ marginBottom: '15px', border: 0 }}>
                    <IAGrid
                        title="用户列表"
                        columns={initColumns}
                        request={(pageNo, pageSize) => searchUserByGroup(pageNo, pageSize)}
                        dataSource={dataSource}
                        total={total}
                        height={offsetHeight / 2 + 50}
                        onSelectedChanged={onGroupUserChange}
                        clearSelect={searchLoading}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        onDoubleClick={(record) => onDoubleClick(record)}
                        // components={{
                        //     stateCellRenderer: StateRenderer,
                        //     tagCellRenderer: TagRenderer,
                        //     lockRenderer: LockRenderer
                        // }}
                        toolBarRender={[
                            <Space key='space'>
                                <Permit authority="group:addUsers" key="new">
                                    <Button
                                        key="addUser"
                                        type="primary"
                                        size="small"
                                        onClick={handleAddUser}>添加成员</Button>
                                </Permit>
                                <Permit authority="group:addCompany" key="addCompany">
                                    <Button
                                        key="addCompany"
                                        danger
                                        size="small"
                                        onClick={handleAddCompany}>添加分公司</Button>
                                </Permit>
                                <Permit authority="userRole:saveFromUser" key="assignRole">
                                    <Button
                                        key="assignRole"
                                        type="primary"
                                        size="small"
                                        onClick={handleAssignRoles}>分配角色</Button>
                                </Permit>
                            </Space>

                        ]}
                        pageToolBarRender={[
                            <Permit authority="user:active">
                                <Tooltip title="演示环境，激活后密码为123456">
                                    <Button
                                        key="active"
                                        onClick={() => onActive(selectedGroupUserKeys)}
                                        disabled={disabledActive}
                                        loading={loading}

                                    >
                                        激活
                                    </Button>
                                </Tooltip>
                            </Permit>,
                            <Permit authority="user:stop">
                                <Button
                                    danger
                                    key="stop"
                                    onClick={() => onStop(selectedGroupUserKeys)}
                                    disabled={disabledStop}
                                    loading={loading}
                                >
                                    停用
                                </Button>
                            </Permit>,
                            <Permit authority="user:unstop">
                                <Button
                                    danger
                                    key="unstop"
                                    onClick={() => onUnStop(selectedGroupUserKeys)}
                                    disabled={disabledUnStop}
                                    loading={loading}
                                >
                                    启用
                                </Button>
                            </Permit>,
                            <Permit authority="group:moveUsers">
                                <Button type="primary" key="move" onClick={() => onMove()}>
                                    移动
                                </Button>
                            </Permit>,
                            <Permit authority="group:removeUsers">
                                <Button type="danger" key="delete" onClick={() => showDeleteConfirm('确定要从组织中删除选中的用户吗?', () => onDeleteUser())}>
                                    删除
                                </Button>
                            </Permit>
                        ]}
                    />
                    {/* {selectedGroupUserKeys?.length > 0 && (
                            <IFooterToolbar>
                                
                            </IFooterToolbar>
                        )} */}
                    {/* </div>
                    <div> */}
                </div>
                <IAGrid
                    title="未分配列表"
                    columns={initColumns}
                    request={(pageNo, pageSize) => searchNotAssignedUser(pageNo, pageSize)}
                    dataSource={notAssignedDataSource}
                    total={total}
                    height={offsetHeight - (offsetHeight / 2 + 150)}
                    onSelectedChanged={onNotAssignUserChange}
                    clearSelect={searchLoading}

                    // components={{
                    //     stateCellRenderer: StateRenderer,
                    //     tagCellRenderer: TagRenderer,
                    //     lockRenderer: LockRenderer
                    // }}
                    pageToolBarRender={[
                        <Permit authority="group:addUsers" key="addUsers">
                            <Button type="primary" key="addUser2Group" onClick={() => addUser2Group()}>
                                添加成员
                            </Button>
                        </Permit>
                    ]}
                />
                {/* {selectedNotAssignUserKeys?.length > 0 && (
                            <IFooterToolbar>
                                <Permit authority="group:addUsers" key="addUsers">
                                    <Button type="primary" key="addUser2Group" onClick={() => addUser2Group()}>
                                        添加成员
                                    </Button>
                                </Permit>
                            </IFooterToolbar>
                        )} */}
                {/* </div>
                </IDrag> */}
            </Col>
        </Row>
    );


}