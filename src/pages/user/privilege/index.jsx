import { IFieldset, IFor, IFormItem, ILayout, IWindow, ISearchTree, IStatus, IAGrid, IIF } from '@/common/components';
import {
    api, contains, copyObject, forEach, forEachObject, groupBy, isEmpty, mapObjIndexed, produce, useAutoObservable, useAutoObservableEvent, split, constant
    , data2Option,
    data2TextObject,
    moment,
    isFunction,
    pluck,
} from '@/common/utils';
import { Button, Card, Checkbox, Col, Space, Tree, message, Tooltip, Tabs, Table, Form, DatePicker, Input, Row, Radio, Switch, Alert } from 'antd';
import { useRef, useState, useEffect } from 'react';
import { zip } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { useParams } from 'umi';

import {
    BarsOutlined,
    ApartmentOutlined,
    UserOutlined,
    SaveOutlined,
    ScheduleOutlined,
    AppstoreTwoTone,
    AppstoreOutlined,
    UnorderedListOutlined,
    ProjectOutlined,
    ProjectTwoTone
} from '@ant-design/icons';
import { use } from '@/pages/position/service';
import { set } from 'lscache';


let permScopes = {};
api.dict.listChildByParentCode(constant.DICT_BUSINESS_PERM_SCOPE_TAG).subscribe({
    next: (data) => {
        permScopes = data2TextObject('dictCode', 'dictName', data);
    }
});

let resourceType = {};
api.dict.listChildByParentCode(constant.DICT_RESOURCE_TYPE_TAG).subscribe({
    next: (data) => {
        resourceType = data2TextObject('dictCode', 'dictName', data);
    }
});
let permScopeOptions = [];
api.dict.listChildByParentCode(constant.DICT_BUSINESS_PERM_SCOPE_TAG).subscribe({
    next: (data) => {
        permScopeOptions = data2Option('dictCode', 'dictName', data);
    }
});

const userState = {
    UNACTIVE: { text: '未激活', status: 'Warning' },
    ACTIVE: { text: '启用', status: 'Success' },
    STOPPED: { text: '停用', status: 'Default' },
    LOCKED: { text: '锁定', status: 'Error' },
};

const UserStateRenderer = (props) => {
    return props.value && <IStatus value={props.value} state={userState} />;
};

let tableComment = {};
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const roleState = {
    UNACTIVE: { text: '未激活', status: 'Warning' },
    ACTIVE: { text: '启用', status: 'Success' },
};
const StateRenderer = (props) => {
    return props.value && <IStatus value={props.value} state={roleState} />;
};
const columns = [
    {
        title: '功能模块',
        // width: 200,
        align: 'left',
        search: false,
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        render: (text, record) => {
            if (record.tag === 'MENU') {
                return (
                    <Space>
                        <BarsOutlined />
                        <Tooltip title={text}>
                            {text}
                        </Tooltip>
                    </Space>
                );
            }
            return (
                <Space>
                    <ScheduleOutlined />
                    <Tooltip title={text}>
                        {text}
                    </Tooltip>
                </Space>
            );
        },
    },
    {
        title: '类型',
        width: 60,
        align: 'center',
        search: false,
        dataIndex: 'tag',
        key: 'tag',
        render: (text) => resourceType[text] || text || '-',
    },
    {
        title: '范围',
        width: 60,
        align: 'center',
        search: false,
        dataIndex: 'permScope',
        key: 'permScope',
        render: (text) => permScopes[text] || text || '-',
    },
    {
        title: '业务权限',
        width: 80,
        align: 'center',
        search: false,
        dataIndex: 'dataPerm',
        key: 'dataPerm',
        render: (text) => text || '-',
    },
    {
        title: '列权限',
        width: 60,
        align: 'center',
        search: false,
        dataIndex: 'columnPerm',
        key: 'columnPerm',
        render: (text) => text || '-',
    },
];
//列初始化
const initPositionColumns = [
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
        width: 70,
        field: 'state',
        cellRenderer: StateRenderer,
    },
    {
        headerName: '职位名称',
        width: 105,
        field: 'postName',
    },
];

//列初始化
const initUserColumns = [
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
        width: 70,
        field: 'state',
        cellRenderer: UserStateRenderer,
    },
    {
        headerName: '姓名',
        width: 105,
        field: 'userRealCnName',
    }
];

//列初始化
const initUsetColumns = [
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
        width: 70,
        field: 'state',
        cellRenderer: StateRenderer,
    },
    {
        headerName: '组名称',
        width: 105,
        field: 'usetName',
    }
];

//列初始化
const initRoleColumns = [
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
        width: 70,
        field: 'state',
        cellRenderer: StateRenderer,
    },
    {
        headerName: '角色名称',
        width: 120,
        field: 'roleName',
    },
];

const loop = (data) =>
    forEachObject((v, k, item) => {
        item.key = item.id;
        const index = item.name?.indexOf(searchValue);
        const beforeStr = item.name?.substr(0, index);
        const afterStr = item.name?.substr(index + searchValue.length);
        const name =
            index > -1 ? (
                <span>
                    {beforeStr}
                    <span className="site-tree-search-value">{searchValue}</span>
                    {afterStr}
                </span>
            ) : (
                <span>{item.name}</span>
            );
        if (item.children) {
            const c = {};
            copyObject(c, item, {
                name,
                id: item.id,
                key: item.key,
                title: item.name,
                parentGroupName: item.parentGroupName,
                children: loop(item.children),
            });
            return c;
        }
        const d = {};
        copyObject(d, item, { name, title: item.name, parentGroupName: item.parentGroupName });
        //console.log("Item的ID应为:" + item.id);
        return d;
    }, data);

//渲染图标
const addIcon = (data) => {
    if (isEmpty(data)) return;
    forEach((v) => {
        if (v.tag && v.tag === 'MENU') {
            if (v.beUnAuth === true) {
                copyObject(v, {
                    icon: < UnorderedListOutlined title='无需授权' twoToneColor="#eb2f96" />,
                });
            } else {
                copyObject(v, {
                    icon: < UnorderedListOutlined />,
                });
            }
        } else {
            if (v.beUnAuth === true) {
                copyObject(v, { icon: <ProjectTwoTone title={'无需授权' + v.key} twoToneColor="#eb2f96" /> });
            } else {
                copyObject(v, { icon: <ProjectTwoTone title={v.key} /> });
            }

        }

        // if (v.tag === 'MENU') {
        //     copyObject(v, { icon: <BarsOutlined /> });
        // } else {
        //     copyObject(v, { icon: <ScheduleOutlined /> });
        // }
        if (v.children && !isEmpty(v.children)) {
            addIcon(v.children);
        }
    }, data);
};

export default (props) => {
    const ref = useRef();
    const params = useParams();

   

    const { clientWidth, clientHeight } = window?.document?.documentElement;
    // const { offsetHeight } = window.document.getElementsByClassName("cala-body")[0]; //获取容器高度
    const [loading, setLoading] = useState(false);
    // 表格数据源
    const [roleDataSource, setRoleDataSource] = useState([])
    const [usetDataSource, setUsetDataSource] = useState([])
    const [userDataSource, setUserDataSource] = useState([])
    const [postDataSource, setPostDataSource] = useState([])

    const [usetSelectedKeys, setUsetSelectedKeys] = useState([]);
    const [userSelectedKeys, setUserSelectedKeys] = useState([]);
    const [postSelectedKeys, setPostSelectedKeys] = useState([]);

    const [userClearSelect, setUserClearSelect] = useState(false);
    const [usetClearSelect, setUsetClearSelect] = useState(false);
    const [postClearSelect, setPostClearSelect] = useState(false);

    // 列表选中数据ID列表
    const [selectedKeys, setSelectedKeys] = useState([]);
    // 组织架构树形结构数据
    const [treeData, setTreeData] = useState([]);
    // 权限范围选择属性结构
    const [permTreeData, setPermTreeData] = useState([]);
    // 选中的用户ID
    const [selectedUserId, setSelectedUserId] = useState();
    // 选中的用户组织ID
    const [selectedUserGroupId, setSelectedUserGroupId] = useState();
    // 选中的自定义职位权限范围
    const [permGroupOrUserId, setPermGroupOrUserId] = useState([]);
    // 表格数据源
    const [dataSource, setDataSource] = useState([]);
    // 排除表格数据源
    const [exceptDataSource, setExceptDataSource] = useState([]);
    const [exceptSelectedKeys, setExceptSelectedKeys] = useState([]);
    //   // 权限范围可选项
    //   const [permScopeOptions, setPermScopeOptions] = useState([]);
    // 权限范围
    const [permScope, setPermScope] = useState();
    // 选中功能的权限范围
    const [originPermScope, setOriginPermScope] = useState();
    // 选择的权限ID
    const [selectedPermId, setsSelectedPermId] = useState();
    // 选中功能的tag
    const [selectedTag, setSelectedTag] = useState();
    // 权限类型
    const [permType, setPermType] = useState('user');

    const [confirmLoading, setConfirmLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [form] = Form.useForm();
    const [bform] = Form.useForm();
    const [cform] = Form.useForm();
    const [postForm] = Form.useForm();

    const [key, setKey] = useState('buttonPerm');
    const [tableAlias, setTableAlias] = useState({});
    const [aliasTable, setAliasTable] = useState({});
    const [tableOptions, setTableOptions] = useState([]);
    const [columnPermTableOptions, setColumnPermTableOptions] = useState([]);
    const [columnPermSelectedTables, setColumnPermSelectedTables] = useState([]);
    // 列权限排除的列表
    const [exceptTableColumn, setExceptTableColumn] = useState({});
    const [specialColumns, setSpecialColumns] = useState([]);

    const [tableSelectColumns, setTableSelectColumns] = useState({});
    const [ui, setUi] = useState([]);

    const [columnUi, setColumnUi] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState();

    const [disabledNodes, setDisAbledNodes] = useState([])

    // 数据权限是否OR条件
    const [beOrChecked, setBeOrChecked] = useState(false);
    // 数据权限是否强制追加相同列条件
    const [beForceChecked, setBeForceChecked] = useState(false);

    // 用户组树节点
    const [usetTreeData, setUsetTreeData] = useState([]);
    // 用户选择的用户组ID
    const [selectedUsetId, setSelectedUsetId] = useState();

    const [userKeyMap, setUserKeyMap] = useState({});
    const [userGroupKeyMap, setUserGroupKeyMap] = useState({});
    const [userIdGroupKeyMap, setUserIdGroupKeyMap] = useState({});

    // 分配用户窗口中树的数据
    const [postTreeData, setPostTreeData] = useState([]);
    // 树显示
    const [treeVisible, setTreeVisible] = useState(false);
    // 选中的自定义职位权限范围
    const [postPermGroupOrUserId, setPostPermGroupOrUserId] = useState([]);

    const [bePostSelect, setBePostSelect] = useState(false);

    const [current, setCurrent] = useState();

    // const [current, setCurrent] = useAutoObservable((inputs$) =>
    //     inputs$.pipe(
    //         map(([id]) => split(id, '_')),
    //         switchMap(([uid, gid]) => zip(
    //             api.user.getUser(uid),
    //             api.user.listPermMenusAndButtons(uid, gid),
    //             api.user.listRoles(uid, gid),
    //             api.user.listUsets(uid, gid),
    //             api.user.listPositions(uid, gid),
    //             // api.group.treeAllGroupsAndUsers()
    //             )),
    //         map(([users, menus, roles, usets, positions, pmenus]) => {
    //             setUserDataSource(users);
    //             addIcon(menus);
    //             setTreeData(menus);
    //             setRoleDataSource(roles);
    //             setUsetDataSource(usets);
    //             setPostDataSource(positions);
    //             setDataSource(pmenus);
    //             // setPostTreeData(groupAndUsers);
    //             const [uid, gid] = split(params.id, '_');
    //             return { userId: uid, groupId: gid };
    //         })
    //     ),
    //     [params.id],
    // )

    const init = (id) => {
        const uid = split(id, '_')[0];
        const gid = split(id, '_')[1];
        zip(
            api.user.getUser(uid),
            api.user.listPermMenusAndButtons(uid, gid),
            api.user.listRoles(uid, gid),
            api.user.listUsets(uid, gid),
            api.user.listPositions(uid, gid),
    // api.group.treeAllGroupsAndUsers()
        ).subscribe({
            next: ([users, menus, roles, usets, positions, pmenus]) => {
                setUserDataSource(users);
                addIcon(menus);
                setTreeData(menus);
                setRoleDataSource(roles);
                setUsetDataSource(usets);
                setPostDataSource(positions);
                setDataSource(pmenus);
                // setPostTreeData(groupAndUsers);
                const [uid, gid] = split(params.id, '_');
                setCurrent({ userId: uid, groupId: gid });
            }
        })
    }

    useEffect(() => {
        init(params.id)
    }, [params.id])

    const loadGroup = () => {
        api.group.treeAllGroupsAndUsers().subscribe({
            next: (data) => {
                loopGroup(data, true, true);
                setPermTreeData(data);
                setPostTreeData(data);
            }
        });
    };

    useEffect(() => {
        loadGroup();
    }, []);

    const exceptColumns = [{
        title: '名称',
        search: false,
        dataIndex: 'title',
    }, {
        title: '操作',
        width: 60,
        search: false,
        dataIndex: 'operator',
        render: (text, record) => {
            return <><DeleteOutlined title='删除排除' onClick={(e) => {
                e.stopPropagation();
                const ds = [];
                forEach((v) => {
                    if (v.key !== record.key) {
                        ds.push(v);
                    }
                }, exceptDataSource);
                setExceptDataSource(ds);
                userGroupKeyMap[record.key].disabled = false;
            }} /></>
        }
    }];

    const uks = {};
    const uidks = {};
    const ugs = {};

    // 将组织设置为不可选
    const loopGroup = (data, beNotSelectGroup, beInit) => {
        forEach((v) => {
            v.disabled = false;
            if (beInit === true) {
                ugs[v.key] = v;
            }
            // 节点是组织不允许修改
            if (v.tag && v.tag === 'GROUP') {
                if (beInit === true) {
                    uidks[v.key] = v;
                }
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
                if (beInit === true) {
                    if (v.key && v.key.indexOf('#') !== -1) {
                        const key = v.key.split('#')[1];
                        uks[key] = v.key;
                        uidks[key] = v;
                    }
                }
                copyObject(v, { icon: <UserOutlined style={{ color: '#52c41a' }} /> });
            }
            if (v.children && !isEmpty(v.children)) {
                loopGroup(v.children, beNotSelectGroup, beInit);
            }
            if (beInit === true) {
                setUserKeyMap(uks);
                setUserGroupKeyMap(ugs);
                setUserIdGroupKeyMap(uidks);
            }
        }, data);
    };


    // 根据用户加载对应的权限资源
    const loadPermResourceByUser = (orgId, uid) => {
        api.resource.listBPermResourcesByUser(orgId, uid).subscribe({
            next: (data) => setDataSource(data),
        });
    };

    // 根据用户组加载对应的权限资源
    const loadPermResourceByUset = (usetId) => {
        api.resource.listBPermResourcesByUset(usetId).subscribe({
            next: (data) => setDataSource(data),
        });
    };

    // 根据用户及权限加载对应的业务权限
    const loadUserPermEntrusts = (orgId, uid, permId) => {
        zip(
            api.resource.listPermEntrustsByUser(orgId, uid, permId),
            api.resource.listPermExceptEntrustsByUser(orgId, uid, permId),
        ).subscribe({
            next: ([data1, data2]) => {
                forEach((v) => {
                    v.disabled = false;
                }, disabledNodes || []);

                const targets = [];
                forEach((v) => {
                    if (userKeyMap[v]) {
                        targets.push(userKeyMap[v]);
                    }
                }, data1);
                setPermGroupOrUserId(targets);
                const ds = [];
                const disables = [];
                forEach((v) => {
                    if (userIdGroupKeyMap[v]) {
                        const node = userIdGroupKeyMap[v];
                        node.disabled = true;
                        disables.push(node);
                        if (node.parentGroupName) {
                            ds.push({ title: node.title + '[' + node.parentGroupName + ']', key: node.key });
                        } else {
                            ds.push({ title: node.title, key: node.key });
                        }
                    }
                }, data2);
                setExceptDataSource(ds);
                setDisAbledNodes(disables);
            },
        });
    };

    // 根据用户组及权限加载对应的业务权限
    const loadUsetPermEntrusts = (usetId, permId) => {
        zip(
            api.resource.listPermEntrustsByUset(usetId, permId),
            api.resource.listPermExceptEntrustsByUset(usetId, permId)
        ).subscribe({
            next: ([data1, data2]) => {
                forEach((v) => {
                    v.disabled = false;
                }, disabledNodes);

                const targets = [];
                forEach((v) => {
                    if (userKeyMap[v]) {
                        targets.push(userKeyMap[v]);
                    }
                }, data1);
                setPermGroupOrUserId(targets);
                const ds = [];
                const disables = [];
                forEach((v) => {
                    if (userIdGroupKeyMap[v]) {
                        const node = userIdGroupKeyMap[v];
                        node.disabled = true;
                        disables.push(node);
                        if (node.parentGroupName) {
                            ds.push({ title: node.title + '[' + node.parentGroupName + ']', key: node.key });
                        } else {
                            ds.push({ title: node.title, key: node.key });
                        }
                    }
                }, data2);
                setExceptDataSource(ds);
                setDisAbledNodes(disables);

            },
        });
    }

    //根据表格列表,加载表格对应的权限列--用来配置列条件信息
    const fetchDataPermColumnsByTable = (tables, tableAliasMap, callback) => {
        api.column.listPermColumnsByTables(tables).subscribe({
            next: (data) => {
                const tc = {};
                forEach((v) => {
                    let xtype;
                    if (v.columnType.indexOf('date') !== -1) {
                        xtype = 'date';
                    } else if (v.columnType.indexOf('timestamp') !== - 1) {
                        xtype = 'datetime';
                    }
                    const tableName = v.tableName;
                    if (!tc[tableName]) {
                        tc[tableName] = [];
                    }
                    tc[tableName].push({ label: v.columnComment, value: tableAliasMap[tableName] + '.' + v.columnName, xtype: xtype });
                }, data);
                const mui = []
                forEachObject((v, k) => {
                    const alias = tableAliasMap[k];
                    mui.push(
                        <IFieldset title={tableComment[k] + '[' + alias + ']'}>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        labelCol={{ span: 8 }}
                                        name={'conditionTableAlias' + k}
                                        label="表重命名"
                                        tooltip="修改表格的名字，为适配子查询重命名，此处允许修改表名，请参考具体SQL进行修改"
                                        rules={[{ whitespace: true, required: false, message: false, max: 50 }]}
                                    >
                                        <Input placeholder="默认同当前表格名称" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider style={{ margin: 0, padding: 0 }} />
                            <Form.Item name={k}>
                                <IAdvanceSearch size='small' searchColumns={v} table={k} alias={alias} />
                            </Form.Item>
                        </IFieldset>)
                }, tc);

                setUi(mui);
                if (callback && isFunction(callback)) {
                    callback();
                }
            }
        });
    };

    // 根据用户获取对应的数据权限
    const loadUserDataPerm = (userId, orgId, permId) => {
        api.resource.loadUserDataPerm(userId, orgId, permId).subscribe({
            next: (data) => {
                // if (!data || data.length === 0) {
                //     return;
                // }
                bform.setFieldsValue({});
                setBeOrChecked(false);
                setUi([]);

                const perm = data[0] || {};
                const aliaNames = [];
                const ad = {};
                const adConditionAlias = {};
                const tableNames = [];
                const tableAliasMap = {};
                forEach((v) => {
                    aliaNames.push(v.aliasName);
                    tableNames.push(v.tableName);
                    adConditionAlias['conditionTableAlias' + v.tableName] = v.conditionTableAlias;
                    ad[v.tableName] = v.express;
                    tableAliasMap[v.tableName] = v.aliasName;
                }, perm.searchExpresses || []);
                // const obj = {permId: permId, userId: userId, orgId: orgId, tables:aliaNames, ...ad };
                const obj = {
                    ...ad, ...adConditionAlias, tables: aliaNames,
                    // beOrCondition:perm.beOrCondition,
                    permStartTime: perm.permStartTime,
                    permEndTime: perm.permEndTime
                };
                // setBeOrChecked(perm.beOrCondition || false);
                // setBeForceChecked(perm.beForceCondition || false);
                fetchDataPermColumnsByTable(tableNames.join(','), tableAliasMap, () => { bform.setFieldsValue(obj); setBeOrChecked(perm.beOrCondition || false) });
            }
        })
    }

    // 根据用户组获取对应的数据权限
    const loadUsetDataPerm = (usetId, permId) => {
        api.resource.loadUsetDataPerm(usetId, permId).subscribe({
            next: (data) => {
                // if (!data || data.length === 0) {
                //     return;
                // }
                bform.setFieldsValue({});
                setBeOrChecked(false);
                setUi([]);

                const perm = data[0] || {};
                const aliaNames = [];
                const ad = {};
                const adConditionAlias = {};
                const tableNames = [];
                const tableAliasMap = {};
                forEach((v) => {
                    aliaNames.push(v.aliasName);
                    tableNames.push(v.tableName);
                    adConditionAlias['conditionTableAlias' + v.tableName] = v.conditionTableAlias;
                    ad[v.tableName] = v.express;
                    tableAliasMap[v.tableName] = v.aliasName;
                }, perm.searchExpresses || []);
                // const obj = {permId: permId, userId: userId, orgId: orgId, tables:aliaNames, ...ad };
                const obj = {
                    ...ad, ...adConditionAlias, tables: aliaNames,
                    // beOrCondition:perm.beOrCondition,
                    permStartTime: perm.permStartTime,
                    permEndTime: perm.permEndTime
                };
                // setBeOrChecked(perm.beOrCondition || false);
                // setBeForceChecked(perm.beForceCondition || false);
                fetchDataPermColumnsByTable(tableNames.join(','), tableAliasMap, () => { bform.setFieldsValue(obj); setBeOrChecked(perm.beOrCondition || false); });

            }
        });
    }

    // 根据permId 加载权限对应的表格
    const loadTablesByPerm = (userId, orgId, permId, callback) => {
        api.resource.fetchActionMapperByPerm(permId).subscribe({
            next: (data) => {
                const result = data && data[0];
                const options = [];
                const aliasMap = {};
                const tableMap = {};
                const commentMap = {};
                if (!result) {
                    setTableOptions(options);
                    setAliasTable(aliasMap);
                    setTableAlias(tableMap);
                    return;
                }
                const tables = result.whereTables || [];
                forEach((v) => {
                    options.push({ label: v.tableComment + '[' + v.alias + ']', value: v.alias });
                    aliasMap[v.alias] = v.table;
                    tableMap[v.table] = v.alias;
                    commentMap[v.table] = v.tableComment;
                }, tables);
                setTableOptions(options);
                setAliasTable(aliasMap);
                setTableAlias(tableMap);
                // setTableComment(commentMap);
                tableComment = commentMap;
                if (callback && isFunction(callback)) {
                    callback();
                }

            }
        });
    }


    // 根据permId 加载权限对应的表格--列权限
    const loadColumnPermTablesByPerm = (permId, callback) => {
        api.resource.fetchColumnActionMapperByPerm(permId).subscribe({
            next: (data) => {
                const result = data && data[0];
                const options = [];
                const aliasMap = {};
                const tableMap = {};
                const commentMap = {};
                if (!result) {
                    setColumnPermTableOptions(options);
                    setAliasTable(aliasMap);
                    setTableAlias(tableMap);
                    return;
                }
                const tables = result.selectTables;
                const tableColumn = {};
                const specials = []
                forEach((v) => {
                    options.push({ label: v.tableComment + '[' + v.alias + ']', value: v.alias });
                    aliasMap[v.alias] = v.table;
                    tableMap[v.table] = v.alias;
                    commentMap[v.table] = v.tableComment;
                    const selects = v.columns || [];
                    const ds = []
                    forEach((c) => {
                        ds.push({ key: c.columnName, title: c.columnComment + '[' + c.columnName + ']' })
                        if (c.ceSpecial === true) {
                            specials.push(c.columnName);
                        }
                    }, selects);

                    tableColumn[v.table] = ds;
                }, tables);

                setColumnPermTableOptions(options);
                setAliasTable(aliasMap);
                setTableAlias(tableMap);
                setTableSelectColumns(tableColumn);
                setSpecialColumns(specials);
                // setTableComment(commentMap);
                tableComment = commentMap;
                if (callback && isFunction(callback)) {
                    callback();
                }

            }
        })
    }

    //加载用户列权限
    const loadUserColumnPerm = (userId, orgId, permId) => {
        api.resource.loadUserColumnPerm(userId, orgId, permId).subscribe({
            next: (data) => {
                if (!data || data.length === 0) {
                    return;
                }
                const aliaNames = [];
                const tables = [];
                const tableExceptColumns = {};
                forEach((v) => {
                    tables.push(v.alias);
                    aliaNames.push(v.alias)
                    const cmns = [];
                    if (v.columns && v.columns.length > 0) {
                        forEach((vv) => {
                            cmns.push(vv.columnName);
                        }, v.columns);
                    }
                    tableExceptColumns[v.table] = cmns;
                }, data);

                setColumnPermSelectedTables(tables)
                const obj = { tables: aliaNames };
                cform.setFieldsValue(obj);
                setExceptTableColumn(tableExceptColumns);
            }
        });
    }

    //加载用户组列权限
    const loadUsetColumnPerm = (usetId, permId) => {
        api.resource.loadUsetColumnPerm(usetId, permId).subscribe({
            next: (data) => {
                if (!data || data.length === 0) {
                    return;
                }
                const aliaNames = [];
                const tables = [];
                const tableExceptColumns = {};
                forEach((v) => {
                    tables.push(v.alias);
                    aliaNames.push(v.alias)
                    const cmns = [];
                    if (v.columns && v.columns.length > 0) {
                        forEach((vv) => {
                            cmns.push(vv.columnName);
                        }, v.columns);
                    }
                    tableExceptColumns[v.table] = cmns;
                }, data);

                setColumnPermSelectedTables(tables)
                const obj = { tables: aliaNames };
                cform.setFieldsValue(obj);
                setExceptTableColumn(tableExceptColumns);
            }
        })
    }

    //重新渲染列权限组件
    const renderColumnPermUi = (selectTables) => {
        const tables = {};
        forEach((v) => {
            const table = aliasTable[v];
            tables[v] = { table: table, columns: tableSelectColumns[table] };
        }, selectTables);
        const mui = []
        forEachObject((v, k) => {
            const alias = k;
            mui.push(
                <IFieldset title={tableComment[v.table] + '[' + alias + ']'}>
                    <Transfer
                        disabled={true}
                        size="small"
                        titles={['查询列', '排除列']}
                        dataSource={v.columns}
                        listStyle={{
                            width: 250,
                            height: 260,
                        }}
                        render={(item) => item.title}
                        targetKeys={exceptTableColumn[v.table]}
                        // onChange={(targetKeys) => {
                        //     const ecolumns = produce(exceptTableColumn, (draft) => {
                        //         draft[v.table] = targetKeys;
                        //     });
                        //     setExceptTableColumn(ecolumns);
                        // }}
                    />
                </IFieldset>)
        }, tables);
        setColumnUi(mui);
    }

    // 功能表格选择事件
    const onSelect = (record, ak) => {
        setSelectedRecord(record);
        setSelectedKeys([record.id]);
        setSelectedTag(record.tag);
        if (record.tag === 'MENU') {
            setSelectedRecord(undefined);
            return;
        }
        form.resetFields();
        bform.resetFields();
        if (!record.permId) return;

        setsSelectedPermId(record.permId);
        setPermScope(record.permScope);
        setOriginPermScope(record.permScope);
        if (ak === 'buttonPerm') {
            const buttonFormValue = {
                orgId: selectedUserGroupId,
                userId: selectedUserId,
                usetId: selectedUsetId,
                permId: record.permId,
                permScope: record.permScope,
            };
            if (record.permStartTime && record.permEndTime) {
                copyObject(buttonFormValue, {
                    timeRange: [moment(record.permStartTime), moment(record.permEndTime)],
                });
            }
            form.setFieldsValue(buttonFormValue);
            if (permType === 'user') {
                loadUserPermEntrusts(selectedUserGroupId, selectedUserId, record.permId);
            } else if (permType === 'uset') {
                loadUsetPermEntrusts(selectedUsetId, record.permId);
            }
        } else if (ak === 'businessPerm') {
            const businessFormValue = {
                orgId: selectedUserGroupId,
                userId: selectedUserId,
                usetId: selectedUsetId,
                permId: record.permId,
            };
            setBeForceChecked(false);
            setBeOrChecked(false);
            setUi([]);
            bform.setFieldsValue(businessFormValue);
            loadTablesByPerm(selectedUserId, selectedUserGroupId, record.permId, () => {
                if (permType === 'user') {
                    loadUserDataPerm(selectedUserId, selectedUserGroupId, record.permId);
                } else if (permType === 'uset') {
                    loadUsetDataPerm(selectedUsetId, record.permId);
                }
            });
        } else if (ak === 'columnPerm') {
            const businessFormValue = {
                orgId: selectedUserGroupId,
                userId: selectedUserId,
                usetId: selectedUsetId,
                permId: record.permId,
            };
            cform.resetFields();
            cform.setFieldsValue(businessFormValue);
            setColumnPermSelectedTables([]);
            setColumnUi([]);
            setExceptTableColumn({});
            loadColumnPermTablesByPerm(record.permId, () => {
                if (permType === 'user') {
                    loadUserColumnPerm(selectedUserId, selectedUserGroupId, record.permId);
                } else if (permType === 'uset') {
                    loadUsetColumnPerm(selectedUsetId, record.permId);
                }
            });

        }
    }

    //用户选择
    // const onUserSelect = (node) => {
    //     let uid = current.userId;
    //     setSelectedUserId(uid);
    //     loadPermResourceByUser(current.groupId, uid);
    //     setSelectedUserGroupId(current.groupId);
    //     setSelectedKeys([]);
    //     setSelectedTag('');
    //     setPermType('user');
    // };

    const onUserSelectionChanged = (selectedRows) => {
        setUsetClearSelect(false);
        setPostClearSelect(false);
        setUserClearSelect(false);
        
        if (selectedRows.length > 0) {
            var ids = pluck('id', selectedRows);
            setUserSelectedKeys(ids);
            const uid = selectedRows[selectedRows.length - 1].id;
            setSelectedUserId(uid);
            loadPermResourceByUser(current.groupId, uid);
            setSelectedUserGroupId(current.groupId);
            setSelectedKeys([]);
            setSelectedTag('');
            setPermType('user');

            setUsetClearSelect(true);
            setPostClearSelect(true);
            setBePostSelect(false);
        }
    }

    const onUsetSelectionChanged = (selectedRows) => {
        setUsetClearSelect(false);
        setPostClearSelect(false);
        setUserClearSelect(false);
        if (selectedRows.length > 0) {
            var ids = pluck('id', selectedRows);
            setUsetSelectedKeys(ids);
            const uset = selectedRows[selectedRows.length -1].id;
            const usetId = uset.id;
            loadPermResourceByUset(usetId);
            setPermType('uset');
            setSelectedUsetId(usetId);
            setSelectedTag('');
            setSelectedKeys([]);

            setUserClearSelect(true);
            setPostClearSelect(true);
            setBePostSelect(false);
        }
    }

    const onPostSelectionChanged = (selectedRows) => {
        setUsetClearSelect(false);
        setPostClearSelect(false);
        setUserClearSelect(false);
        postForm.resetFields();
        if (selectedRows.length > 0) {
            var ids = pluck('id', selectedRows);
            setPostSelectedKeys(ids);
            var position = selectedRows[selectedRows.length - 1];
            if (position.permScope === 'CUSTOMER_SPECIFIED') {
                setTreeVisible(true);
            } else {
                setTreeVisible(false);
            }
            api.position.listEntrusByPosition(ids[0]).subscribe({
                next: (data) => {
                    setPostPermGroupOrUserId(data);
                },
            });
            setUsetClearSelect(true);
            setUserClearSelect(true);
            setBePostSelect(true);
            postForm.setFieldsValue(position);
        }
    }

    // const onUsetSelect = (e) => {
    //     const usetId = node.key;
    //     loadPermResourceByUset(usetId);
    //     setPermType('uset');
    //     setSelectedUsetId(usetId);
    //     setSelectedTag('');
    //     setSelectedKeys([]);
    // };




    return (
        <IWindow
            current={current}
            saveVisible={false}
            className="odm-modal"
            title='资源权限'
            width={clientWidth}
            height={clientHeight}
            bodyStyle={{ padding: 0 }}
            //onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="hidden" name="userId" />
            <IFormItem xtype="hidden" name="groupId" />
            <Tabs size="small" type="card" tabPosition="top" >
                <TabPane size='small' tab="资源权限" key="resourcePerm">
                    <ILayout type="hbox" spans="8 8 8" gutter="8">
                        <Card
                            size="small"
                            bordered={true}
                            title={
                                <>
                                    <span>资源权限列表</span>
                                </>
                            }
                            bodyStyle={{
                                height: clientHeight - 180, paddingLeft: 5,
                                paddingRight: 0, paddingBottom: 0, margin: 0, overflow: 'scroll'
                            }}
                        >
                            <ISearchTree
                                iconRender={loop}
                                treeData={treeData}
                                placeholder="输入菜单或按钮进行搜索"
                                blockNode={true}
                                bodyStyle={{ height: clientHeight - 250, margin: 0, }}
                                // checkable
                                // checkedKeys={userPerms}
                                // onCheck={(checked) => setUserPerms(checked)}
                                onSelect={(keys, { selected, node }) => {
                                    // if (selected && node.isLeaf) {
                                    //     onClickMenu([keys[0], current.userId, current.groupId]);
                                    //     // loadPermButtons(keys[0]);
                                    //     setMenuId(keys[0]);
                                    //     setMenuName(node.title);
                                    // }
                                }}
                                titleRender={(node) => (
                                    <div style={{ width: '100%' }}>
                                        <div style={{ float: 'left' }}>
                                            {node.icon} {node.title}
                                        </div>
                                    </div>
                                )}
                            />
                        </Card>
                        <Card
                            size="small"
                            bordered={true}
                            bodyStyle={{
                                height: clientHeight - 180, paddingLeft: 5, paddingTop: 5,
                                paddingRight: 0, paddingBottom: 0, margin: 0, overflow: 'scroll'
                            }}
                            title={
                                <>
                                    <span>角色列表</span>
                                </>
                            }
                        >
                            <IAGrid
                                title={false}
                                columns={initRoleColumns}
                                height={clientHeight - 195}
                                defaultSearch={false}
                                dataSource={roleDataSource}
                                optionsHide={{ topTool: true, pagination: true }}
                            />
                        </Card>
                        <ILayout type="vbox" spans="12 12" gutter="8">
                            <Card
                                size="small"
                                bordered={true}
                                bodyStyle={{
                                    height: (clientHeight / 2) - 135, paddingLeft: 5, paddingTop: 5,
                                    paddingRight: 0, paddingBottom: 0, marginBottom: 0, overflow: 'scroll'
                                }}
                                style={{ marginBottom: 5 }}
                                title={
                                    <>
                                        <span>用户组列表</span>
                                    </>
                                }
                            >
                                <IAGrid
                                    title={false}
                                    columns={initUsetColumns}
                                    height={(clientHeight / 2) - 147}
                                    defaultSearch={false}
                                    dataSource={usetDataSource}
                                    optionsHide={{ topTool: true, pagination: true }}
                                />
                            </Card>
                            <Card
                                size="small"
                                bordered={true}
                                bodyStyle={{
                                    height: (clientHeight / 2) - 89, paddingLeft: 5, paddingTop: 5,
                                    paddingRight: 0, paddingBottom: 0, margin: 0, overflow: 'scroll'
                                }}
                                title={
                                    <>
                                        <span>职位列表</span>
                                    </>
                                }
                            >
                                <IAGrid
                                    title={false}
                                    columns={initPositionColumns}
                                    height={(clientHeight / 2) - 105}
                                    defaultSearch={false}
                                    dataSource={postDataSource}
                                    optionsHide={{ topTool: true, pagination: true }}
                                />
                            </Card>
                        </ILayout>
                    </ILayout>
                </TabPane>
                <TabPane size='small' tab="数据权限" key="dataPerm">
                    <ILayout type="hbox" spans="6 10 8" gutter="8">
                        <ILayout type="vbox" spans="8 8 8" gutter="8">
                            <Card
                                size="small"
                                bordered={true}
                                bodyStyle={{
                                    height: (clientHeight / 3) - 115, paddingLeft: 5, paddingTop: 5,
                                    paddingRight: 0, paddingBottom: 0, marginBottom: 0, overflow: 'scroll'
                                }}
                                style={{ marginBottom: 5 }}
                                title={
                                    <>
                                        <span>用户列表</span>
                                    </>
                                }
                            >
                                <IAGrid
                                    title={false}
                                    columns={initUserColumns}
                                    onSelectedChanged={(data) => onUserSelectionChanged(data)}
                                    // onClick={()=>onUserSelect()}
                                    height={(clientHeight / 3) - 127}
                                    defaultSearch={false}
                                    dataSource={userDataSource}
                                    clearSelect={userClearSelect}
                                    optionsHide={{ topTool: true, pagination: true }}
                                />
                            </Card>
                            <Card
                                size="small"
                                bordered={true}
                                bodyStyle={{
                                    height: (clientHeight / 3) - 95, paddingLeft: 5, paddingTop: 5,
                                    paddingRight: 0, paddingBottom: 0, marginBottom: 0, overflow: 'scroll'
                                }}
                                style={{ marginBottom: 5 }}
                                title={
                                    <>
                                        <span>用户组列表</span>
                                    </>
                                }
                            >
                                <IAGrid
                                    title={false}
                                    columns={initUsetColumns}
                                    height={(clientHeight / 3) - 107}
                                    defaultSearch={false}
                                    onSelectedChanged={(data) => onUsetSelectionChanged(data)}
                                    dataSource={usetDataSource}
                                    clearSelect={usetClearSelect}
                                    optionsHide={{ topTool: true, pagination: true }}
                                />
                            </Card>
                            <Card
                                size="small"
                                bordered={true}
                                bodyStyle={{
                                    height: (clientHeight / 3) - 70, paddingLeft: 5, paddingTop: 5,
                                    paddingRight: 0, paddingBottom: 0, margin: 0, overflow: 'scroll'
                                }}
                                title={
                                    <>
                                        <span>职位列表</span>
                                    </>
                                }
                            >
                                <IAGrid
                                    title={false}
                                    columns={initPositionColumns}
                                    height={(clientHeight / 3) - 90}
                                    defaultSearch={false}
                                    onSelectedChanged={(data) => onPostSelectionChanged(data)}
                                    dataSource={postDataSource}
                                    clearSelect={postClearSelect}
                                    optionsHide={{ topTool: true, pagination: true }}
                                />
                            </Card>
                        </ILayout>
                        {bePostSelect === false && (
                        <Card
                            size='small'
                            title={
                                <div style={{ verticalAlign: 'top' }}>
                                    <Space>
                                        功能列表
                                        <span style={{ fontSize: 14, color: '#C5C5C5' }}>权限范围只作用于按钮功能</span>
                                    </Space>
                                </div>
                            }
                            bordered={true}
                            bodyStyle={{ height: clientHeight - 180, overflow: 'scroll' }}
                        >
                            <Table
                                size="small"
                                bordered
                                rowKey="id"
                                columns={columns}
                                search={false}
                                dataSource={dataSource}
                                rowSelection={{
                                    columnTitle: '选择',
                                    columnWidth: 80,
                                    selectedRowKeys: selectedKeys,
                                    type: 'radio',
                                    onSelect: (record) => {
                                        onSelect(record, key);
                                    },
                                }}
                                pagination={false}
                                onRow={(record) => {
                                    return {
                                        onClick: () => {
                                            onSelect(record, key);
                                        },
                                    };
                                }}
                            />
                        </Card>)}
                        {bePostSelect === true && (
                            <Card
                                bordered={true}
                                size='small'
                                bodyStyle={{ height: clientHeight - 180, overflow: 'scroll' }}
                                title={
                                    <div style={{ verticalAlign: 'top' }}>
                                        <Space>
                                            功能数据权限
                                            <span style={{ fontSize: 14, color: '#C5C5C5' }}>职位功能数据权限对所有有权限的功能生效</span>
                                        </Space>
                                    </div>
                                }
                            >
                                <Form form={postForm} size='small' layout="horizontal" className="odm-form">
                                    <ILayout type="vbox">
                                        <IFormItem
                                            name="postName"
                                            label="职位名称"
                                            xtype="input"
                                            required={true}
                                            max={50}
                                        />
                                        <IFormItem
                                            name="permScope"
                                            label="权限范围"
                                            xtype="dict"
                                            tag={constant.DICT_POSITION_PERM_SCOPE_TAG}
                                            required={true}
                                        />
                                    </ILayout>
                                    {treeVisible && (
                                        <ISearchTree
                                            bodyStyle={{ height: 280, overflow: 'scroll' }}
                                            iconRender={(data) => loopGroup(data, false, false)}
                                            showIcon={true}
                                            treeData={postTreeData}
                                            checkable
                                            checkedKeys={postPermGroupOrUserId}
                                        />
                                    )}
                                    <ILayout type="vbox">
                                        <IFormItem xtype="radio" name="beManager" label="是否主管" defaultValue={false} >
                                            <Radio value={false}>否</Radio>
                                            <Radio value={true}>是</Radio>
                                        </IFormItem>

                                        <IFormItem
                                            name="note"
                                            label="备注说明"
                                            xtype="textarea"
                                            rows={4}
                                            max={200}
                                        />
                                    </ILayout>
                                </Form>
                            </Card>
                        )}
                        {((selectedTag && selectedTag === 'BUTTON') && bePostSelect === false) && (
                                <Card
                                    size='small'
                                    bordered={true}
                                    bodyStyle={{ padding: 5, height: clientHeight - 66, overflow: 'scroll' }} >
                                    <Tabs
                                        activeKey={key}
                                        size="small"
                                        type="card"
                                        onChange={(activeKey) => {
                                            setKey(activeKey);
                                            onSelect(selectedRecord, activeKey);
                                        }}>

                                        <TabPane tab="功能数据权限" key="buttonPerm" style={{ padding: 0 }}>
                                        <IIF test={!bePostSelect}>
                                            <Card
                                                bordered={false}
                                                size='small'
                                            bodyStyle={{ height: clientHeight - 192, overflow: 'scroll' }}
                                            >
                                                <Form form={form} size='small' layout="horizontal" className="odm-form">
                                                    <Form.Item style={{ display: 'none' }}>
                                                        <Form.Item name="permId" label="permId">
                                                            <Input />
                                                        </Form.Item>
                                                    </Form.Item>
                                                    <Form.Item style={{ display: 'none' }}>
                                                        <Form.Item name="userId" label="userId">
                                                            <Input />
                                                        </Form.Item>
                                                    </Form.Item>
                                                    <Form.Item style={{ display: 'none' }}>
                                                        <Form.Item name="orgId" label="orgId">
                                                            <Input />
                                                        </Form.Item>
                                                    </Form.Item>
                                                    <Form.Item style={{ display: 'none' }}>
                                                        <Form.Item name="usetId" label="usetId">
                                                            <Input />
                                                        </Form.Item>
                                                    </Form.Item>

                                                    <Row gutter={12}>
                                                        <Col span={24}>
                                                            <Form.Item
                                                                labelCol={{ span: 6 }}
                                                                name="permScope"
                                                                label="权限范围"
                                                                rules={[{ required: true, message: false }]}
                                                            >
                                                                <Radio.Group
                                                                    disabled={true}
                                                                    buttonStyle="solid"
                                                                    style={{ width: '260px' }}
                                                                    options={permScopeOptions}
                                                                    onChange={(e) => {
                                                                        setPermScope(e.target.value);
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    {permScope && permScope !== 'CURRENT_USER' && (
                                                        <Row>
                                                            <Col span={24}>
                                                                <Form.Item
                                                                    labelCol={{ span: 6 }}
                                                                    name="timeRange"
                                                                    label="授权时效"
                                                                    tooltip="不填写为永久授权"
                                                                    rules={[{ required: false, message: false }]}
                                                                >
                                                                    <RangePicker
                                                                        disabled={true}
                                                                        style={{ width: '240px' }}
                                                                        ranges={{
                                                                            今天: [moment(), moment()],
                                                                            本月: [moment().startOf('month'), moment().endOf('month')],
                                                                        }}
                                                                        // showTime
                                                                        format="YYYY-MM-DD"
                                                                    />
                                                                </Form.Item>
                                                            </Col>
                                                        </Row>
                                                    )}
                                                </Form>
                                                {permScope === 'CUSTOMER_SPECIFIED' && (
                                                    <>
                                                        <Row gutter={5}>
                                                            <Col span={24}>
                                                                <Card
                                                                    size='small'
                                                                    bordered={true}
                                                                    bodyStyle={{ height: 280, overflow: 'scroll' }}
                                                                    title={<div>指定范围列表</div>}
                                                                >
                                                                    <ISearchTree
                                                                        bodyStyle={{ height: 320, overflow: 'scroll' }}
                                                                        iconRender={(data) => loopGroup(data, false, false)}
                                                                        size="small"
                                                                        bordered
                                                                        blockNode={true}
                                                                        treeData={permTreeData}
                                                                        checkable
                                                                        checkedKeys={permGroupOrUserId}
                                                                        onCheck={(checked) => {
                                                                            setPermGroupOrUserId(checked);
                                                                        }}
                                                                    />
                                                                </Card>
                                                            </Col>
                                                        </Row>
                                                        <Row gutter={5}>
                                                            <Col span={24}>
                                                                <Table
                                                                    size="small"
                                                                    style={{ marginTop: '5px' }}
                                                                    title={() => <><b>排除组织/用户列表</b></>}
                                                                    scroll={{ y: 195, }}
                                                                    bordered
                                                                    rowKey="key"
                                                                    columns={exceptColumns}
                                                                    search={false}
                                                                    dataSource={exceptDataSource}
                                                                    rowSelection={{
                                                                        onChange: (rowKeys) => {
                                                                            setExceptSelectedKeys(rowKeys);
                                                                        },
                                                                    }}
                                                                    pagination={false}
                                                                />
                                                            </Col>
                                                        </Row>
                                                    </>
                                                )}
                                            </Card>
                                        </IIF>
                                        
                                        </TabPane>
                                    <TabPane tab="业务数据权限" key="businessPerm" style={{ padding: 0 }} disabled={bePostSelect === true}>
                                            <Card
                                                bordered={false}
                                                size='small'
                                                bodyStyle={{ height: 'calc(100vh - 255px)', overflow: 'scroll', padding: '2px' }}
                                            >
                                                <Form form={bform} size='small' layout="horizontal" className="odm-form">
                                                    <Form.Item style={{ display: 'none' }}>
                                                        <Form.Item name="permId" label="permId">
                                                            <Input />
                                                        </Form.Item>
                                                    </Form.Item>
                                                    <Form.Item style={{ display: 'none' }}>
                                                        <Form.Item name="userId" label="userId">
                                                            <Input />
                                                        </Form.Item>
                                                    </Form.Item>
                                                    <Form.Item style={{ display: 'none' }}>
                                                        <Form.Item name="orgId" label="orgId">
                                                            <Input />
                                                        </Form.Item>
                                                    </Form.Item>
                                                    <Form.Item style={{ display: 'none' }}>
                                                        <Form.Item name="usetId" label="usetId">
                                                            <Input />
                                                        </Form.Item>
                                                    </Form.Item>
                                                    <Row>
                                                        <Col span={24}>
                                                            <Form.Item
                                                                labelCol={{ span: 6 }}
                                                                name="beOrCondition"
                                                                label="OR条件"
                                                                rules={[{ required: false, message: false }]}
                                                            >
                                                            <Switch checkedChildren="OR" unCheckedChildren="AND" disabled={true} />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={24}>
                                                            <Form.Item
                                                                labelCol={{ span: 6 }}
                                                                name="timeRange"
                                                                label="授权时效"
                                                                tooltip="不填写为永久授权"
                                                                rules={[{ required: false, message: false }]}
                                                            >
                                                                <RangePicker
                                                                    disabled={true}
                                                                    style={{ width: '240px' }}
                                                                    ranges={{
                                                                        今天: [moment(), moment()],
                                                                        本月: [moment().startOf('month'), moment().endOf('month')],
                                                                    }}
                                                                    // showTime
                                                                    format="YYYY-MM-DD"
                                                                />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col span={24}>
                                                            <Alert size="small" style={{ fontSize: 12, marginBottom: 10 }} message="注意: 若勾选表格未出现选择列信息,请先到 [数据列管理] 中配置对应的表!" type="warning" showIcon={true} />
                                                            <Form.Item
                                                                labelCol={{ span: 4 }}
                                                                name="tables"
                                                                label="表格列表"
                                                                rules={[{ required: false, message: false, type: 'array' }]}
                                                            >
                                                            <Checkbox.Group options={tableOptions} disabled={true} />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    {ui.map((item) => (<>{item}</>))}
                                                </Form>
                                            </Card>
                                        </TabPane>

                                    <TabPane tab="列数据权限" key="columnPerm" style={{ padding: 0 }} disabled={bePostSelect === true}>
                                            <Card
                                                bordered={false}
                                                size='small'
                                                bodyStyle={{ height: 'calc(100vh - 255px)', overflow: 'scroll', padding: '2px' }}
                                            >
                                                <Form form={cform} size='small' layout="horizontal" className="odm-form">
                                                    <Form.Item style={{ display: 'none' }}>
                                                        <Form.Item name="permId" label="permId">
                                                            <Input />
                                                        </Form.Item>
                                                    </Form.Item>
                                                    <Form.Item style={{ display: 'none' }}>
                                                        <Form.Item name="userId" label="userId">
                                                            <Input />
                                                        </Form.Item>
                                                    </Form.Item>
                                                    <Form.Item style={{ display: 'none' }}>
                                                        <Form.Item name="orgId" label="orgId">
                                                            <Input />
                                                        </Form.Item>
                                                    </Form.Item>
                                                    <Form.Item style={{ display: 'none' }}>
                                                        <Form.Item name="usetId" label="usetId">
                                                            <Input />
                                                        </Form.Item>
                                                    </Form.Item>
                                                    <Row>
                                                        <Col span={24}>
                                                            {columnPermTableOptions && columnPermTableOptions.length >= 1 && (
                                                                <Form.Item
                                                                    labelCol={{ span: 4 }}
                                                                    name="tables"
                                                                    label="表格列表"
                                                                    rules={[{ required: false, message: false, type: 'array' }]}
                                                                >
                                                                <Checkbox.Group options={columnPermTableOptions} disabled={true} />
                                                                </Form.Item>
                                                            )}
                                                            {(!columnPermTableOptions || columnPermTableOptions.length < 1) && (
                                                                <Alert size="small" style={{ fontSize: 12, marginBottom: 10 }} message="此功能不支持列配置(只有一列时,不支持列配置)!" type="error" showIcon={true} />
                                                            )}
                                                        </Col>
                                                    </Row>
                                                    {columnUi.map((item) => (<>{item}</>))}
                                                </Form>
                                            </Card>
                                        </TabPane>
                                    </Tabs>
                                </Card>
                        )}
                    </ILayout>
                </TabPane>
            </Tabs>
        </IWindow>
    )
}