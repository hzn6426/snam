import { IAdvanceSearch, IFieldset, IFormItem, IIF, ILayout, ISearchTree, IStatus, IWindow } from '@/common/components';
import {
    api,
    constant,
    copyObject,
    data2Option,
    data2TextObject,
    forEach, forEachObject,
    isEmpty,
    isFunction,
    moment,
    split
} from '@/common/utils';
import { Alert, Card, Checkbox, Col, DatePicker, Divider, Form, Input, Radio, Row, Select, Space, Switch, Table, Tabs, Tooltip, Transfer } from 'antd';
import { useEffect, useState } from 'react';
import { zip } from 'rxjs';
import { useParams } from 'umi';

import {
    ApartmentOutlined,
    BarsOutlined,
    ProjectTwoTone,
    ScheduleOutlined,
    UnorderedListOutlined,
    UserOutlined
} from '@ant-design/icons';


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

const dataPermViewOption = [{ label: "全部", value: "ALL" }, { label: "用户", value: "USER" }, { label: "用户组", value: "USET" }]

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
    const params = useParams();

    const { clientWidth, clientHeight } = window?.document?.documentElement;
    // const { offsetHeight } = window.document.getElementsByClassName("cala-body")[0]; //获取容器高度
    // 角色数据源
    const [roleOptions, setRoleOptions] = useState([]);
    const [usetDataSource, setUsetDataSource] = useState([])

    //数据权限查看维度
    const [dataPermView, setDataPermView] = useState('ALL');
    const [selectRoleId, setSelectRoleId] = useState('');
    //选中的按钮ID
    const [selectButtionId, setSelectButtionId] = useState('')
    const [selectButtonPermId, setSelectButtonPermId] = useState('');
    // 是否过滤权限按钮
    const [beFilterPermButton, setBeFilterPermButton] = useState(false);

    // 树显示
    const [postTreeVisible, setPostTreeVisible] = useState(true);
    // 选中的自定义职位权限范围
    const [permGroupOrUserId, setPermGroupOrUserId] = useState([]);
    // 用户对应的职位ID
    const [postitionId, setPostitionId] = useState('');
    // 职位用户组织树
    const [postTreeData, setPostTreeData] = useState([]);
    // 选中的自定义职位权限范围
    const [postPermGroupOrUserId, setPostPermGroupOrUserId] = useState([]);
    // 用户选择的用户组ID
    const [selectedUsetId, setSelectedUsetId] = useState('ALL');
    //选择的权限按钮对象
    const [buttonRecord, setButtonRecord] = useState({});
    // 业务权限按钮渲染
    const [uiAnd, setUiAnd] = useState([]);
    const [uiOr, setUiOr] = useState([]);

    const [beHaveAndCondition, setBeHaveAndCondition] = useState(false);
    const [beHaveOrCondition, setBeHaveOrCondition] = useState(false);

    // 权限范围
    const [permScope, setPermScope] = useState();

    // 组织架构树形结构数据
    const [treeData, setTreeData] = useState([]);
    // 权限范围选择属性结构
    const [permTreeData, setPermTreeData] = useState([]);
    // 表格数据源
    const [dataSource, setDataSource] = useState([]);
    // 排除表格数据源
    const [exceptDataSource, setExceptDataSource] = useState([]);
    const [exceptSelectedKeys, setExceptSelectedKeys] = useState([]);


    const [confirmLoading, setConfirmLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [form] = Form.useForm();
    const [bformAnd] = Form.useForm();
    const [bformOr] = Form.useForm();
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


    const [columnUi, setColumnUi] = useState([]);

    const [disabledNodes, setDisAbledNodes] = useState([])


    const [userKeyMap, setUserKeyMap] = useState({});
    const [userGroupKeyMap, setUserGroupKeyMap] = useState({});
    const [userIdGroupKeyMap, setUserIdGroupKeyMap] = useState({});


    const [current, setCurrent] = useState();

    const onDataPermViewChange = (v) => {
        setDataPermView(v);
    }

    //获取职位信息
    const getPosition = (id) => {
        zip(api.position.getPosition(id), api.position.listEntrusByPosition(id)).subscribe({
            next: ([data, data2]) => {
                setPostPermGroupOrUserId(data2);
                const position = data[0];
                postForm.setFieldsValue(position);
            }
        });
    }

    const loadGroup = () => {
        api.group.treeAllGroupsAndUsers().subscribe({
            next: (data) => {
                loopGroup(data, true, true);
                setPermTreeData(data);
                setPostTreeData(data);
            }
        });
    };

    const renderBusinessUI = (perm, beAnd) => {

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
            beOrCondition: perm.beOrCondition,
            permStartTime: perm.permStartTime,
            permEndTime: perm.permEndTime
        };
        const form = beAnd === true ? bformAnd : bformOr;
        // setBeOrChecked(perm.beOrCondition || false);
        // setBeForceChecked(perm.beForceCondition || false);
        fetchDataPermColumnsByTable(tableNames.join(','), tableAliasMap, beAnd, () => { form.setFieldsValue(obj) });
    }

    //选中权限按钮
    const onSelectPermButton = (permId) => {
        const id = params.id;
        const uid = split(id, '_')[0];
        const gid = split(id, '_')[1];
        if (key === 'buttonPerm') {
            api.resource.getUserFunctionDataPerm(dataPermView, permId, gid, selectedUsetId).subscribe({
                next: (data) => {
                    const dp = data[0];
                    const data1 = dp?.entrustIds;
                    form.setFieldsValue(dp);
                    setPermScope(dp.permScope);
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
                    const data2 = dp?.exceptEntrustIds;
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
                }
            })
        } else if (key == 'businessPerm') {
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

                    api.resource.getUserBusinessDataPerm(dataPermView, permId, gid, selectedUsetId).subscribe({
                        next: (data) => {
                            setBeHaveAndCondition(false);
                            setBeHaveOrCondition(false);
                            bformAnd.resetFields();
                            bformOr.resetFields();
                            setUiAnd([]);
                            setUiOr([]);
                            if (!data) {
                                return;
                            }
                            const orItem = data.filter(item => item.beOrCondition === true);
                            const andItem = data.filter(item => item.beOrCondition === false);
                            if (orItem && orItem.length > 0) {
                                setBeHaveOrCondition(true);
                                renderBusinessUI(orItem[0], false)
                            }
                            if (andItem && andItem.length > 0) {
                                setBeHaveAndCondition(true);
                                renderBusinessUI(andItem[0], true)
                            }

                        }
                    });

                }
            });
        } else if (key === 'columnPerm') {

            cform.resetFields();
            setColumnPermSelectedTables([]);
            setColumnUi([]);
            setExceptTableColumn({});
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

                    api.resource.getUserColumnDataPerm(dataPermView, permId, gid, selectedUsetId).subscribe({
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

                            setColumnPermSelectedTables(tables);
                            const obj = { tables: aliaNames };
                            cform.setFieldsValue(obj);
                            setExceptTableColumn(tableExceptColumns);
                        }
                    });

                }
            })
        }
    }

    const init = (id) => {
        const uid = split(id, '_')[0];
        const gid = split(id, '_')[1];
        zip(
            api.user.getUser(uid),
            // api.user.listPermMenusAndButtons(uid, gid, false),
            api.user.listRoles(uid, gid),
            api.user.listUsets(uid, gid),
            api.user.listPositions(uid, gid),
            // api.group.treeAllGroupsAndUsers()
        ).subscribe({
            next: ([users, roles, usets, positions, pmenus]) => {
                // setUserDataSource(users);
                if (positions && positions.length > 0) {
                    setPostitionId(positions[0]?.id)
                }
                // addIcon(menus);
                // setTreeData(menus);
                const rolesArr = [{ label: '全部', value: 'ALL' }];
                forEach((r) => {
                    rolesArr.push({ label: r.roleName, value: r.id });
                }, roles)
                setRoleOptions(rolesArr);
                // setRoleDataSource(roles);

                const usetsArr = [{ label: '全部', value: 'ALL' }];
                forEach((u) => {
                    usetsArr.push({ label: u.usetName, value: u.id });
                }, usets)
                setUsetDataSource(usetsArr);
                // setPostDataSource(positions);
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

    useEffect(() => {
        if (selectButtonPermId) {
            onSelectPermButton(selectButtonPermId);
        }
    }, [key])

    //监控是否过滤权限按钮及角色列表
    useEffect(() => {
        const id = params.id;
        const uid = split(id, '_')[0];
        const gid = split(id, '_')[1];
        api.user.listPermMenusAndButtons(uid, gid, selectRoleId, beFilterPermButton).subscribe({
            next: (data) => {
                addIcon(data);
                setTreeData(data);
            }
        });
    }, [beFilterPermButton, selectRoleId]);

    //监控排除的列表
    useEffect(() => {
        renderColumnPermUi(columnPermSelectedTables);
    }, [exceptTableColumn])

    //监控选择用户组及查看维度
    useEffect(() => {
        if (selectButtonPermId) {
            onSelectPermButton(selectButtonPermId);
        }
    }, [selectedUsetId, dataPermView])

    //监控职位ID
    useEffect(() => {
        if (postitionId) {
            getPosition(postitionId);
        }
    }, [postitionId]);

    //监控权限按钮选择
    useEffect(() => {
        if (selectButtonPermId) {
            onSelectPermButton(selectButtonPermId);
        }
    }, [selectButtonPermId]);

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


    //根据表格列表,加载表格对应的权限列--用来配置列条件信息
    const fetchDataPermColumnsByTable = (tables, tableAliasMap, beAnd, callback) => {
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
                                        <Input placeholder="默认同当前表格名称" disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider style={{ margin: 0, padding: 0 }} />
                            <Form.Item name={k}>
                                <IAdvanceSearch disabled={true} hideButton={true} size='small' searchColumns={v} table={k} alias={alias} />
                            </Form.Item>
                        </IFieldset>)
                }, tc);
                if (beAnd === true) {
                    setUiAnd(mui);
                } else {
                    setUiOr(mui);
                }

                if (callback && isFunction(callback)) {
                    callback();
                }
            }
        });
    };

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
                            width: 350,
                            height: 260,
                        }}
                        render={(item) => item.title}
                        targetKeys={exceptTableColumn[v.table]}
                    />
                </IFieldset>)
        }, tables);
        setColumnUi(mui);
    }


    return (
        <IWindow
            current={current}
            saveVisible={false}
            className="odm-modal"
            title='资源权限'
            width={clientWidth}
            height={clientHeight}
            bodyStyle={{ padding: 0 }}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="hidden" name="userId" />
            <IFormItem xtype="hidden" name="groupId" />
            <ILayout type="hbox" spans="8 16" gutter="8">
                <Card
                    size="small"
                    bordered={true}
                    style={{ borderRadius: 10 }}
                    title={
                        <>
                            <Space>角色列表:<Select size='small' defaultValue="ALL" onChange={(v) => setSelectRoleId(v)} options={roleOptions} style={{ width: 160 }} />  <Checkbox onChange={(e) => setBeFilterPermButton(e.target.checked)}>数据权限</Checkbox></Space>
                        </>
                    }
                    bodyStyle={{
                        height: clientHeight - 140, paddingLeft: 5,
                        paddingRight: 0, paddingBottom: 0, margin: 0, overflow: 'scroll',
                    }}
                >
                    <ISearchTree
                        iconRender={loop}
                        treeData={treeData}
                        placeholder="输入菜单或按钮进行搜索"
                        blockNode={true}
                        bodyStyle={{ height: clientHeight - 200, margin: 0, }}
                        // checkable
                        // checkedKeys={userPerms}
                        // onCheck={(checked) => setUserPerms(checked)}
                        onSelect={(keys, { selected, node }) => {
                            if (selected && node.isLeaf) {
                                setSelectButtionId(keys[0]);
                                setButtonRecord(node);
                                console.log(node);
                                if (node.permId) {
                                    setSelectButtonPermId(node.permId);
                                }
                            }
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
                    size='small'
                    bordered={true}
                    title={
                        <>
                            <Space>查看维度:<Select size='small' defaultValue="ALL" options={dataPermViewOption} style={{ width: 160 }} onChange={(v) => onDataPermViewChange(v)} />
                                <IIF test={dataPermView == 'USET'}><Space>用户组:<Select size='small' defaultValue="ALL" options={usetDataSource} style={{ width: 160 }} onChange={(v) => setSelectedUsetId(v)} /></Space></IIF></Space>
                        </>
                    }
                    bodyStyle={{ padding: 5, height: clientHeight - 140, overflow: 'scroll' }} >
                    <Tabs
                        activeKey={key}
                        size="small"
                        type="card"
                        tabPosition={'top'}
                        onChange={(activeKey) => {
                            setKey(activeKey);
                        }}>
                        <TabPane tab="职位数据权限" key="positionPerm" style={{ padding: 0 }} >
                            <Card
                                bordered={false}
                                size='small'
                                bodyStyle={{ height: clientHeight - 210, overflow: 'scroll', padding: '5px' }}
                            >
                                <IIF test={!postitionId}>
                                    <Alert message="该用户没有分配职位，无法展示职位信息！" type="warning" showIcon />
                                </IIF>
                                <IIF test={!!postitionId}>
                                    <Form form={postForm} size='small' layout="horizontal" className="odm-form">
                                        <ILayout type="vbox">
                                            <IFormItem
                                                name="postName"
                                                label="职位名称"
                                                xtype="input"
                                                disabled={true}
                                                max={50}
                                            />
                                            <IFormItem
                                                name="permScope"
                                                label="权限范围"
                                                xtype="dict"
                                                tag={constant.DICT_POSITION_PERM_SCOPE_TAG}
                                                disabled={true}
                                            />
                                        </ILayout>
                                        {postTreeVisible && (
                                            <ISearchTree
                                                bodyStyle={{ height: 'calc(100vh - 345px)', overflow: 'scroll' }}
                                                iconRender={loopGroup}
                                                showIcon={true}
                                                treeData={postTreeData}
                                                checkable
                                                checkedKeys={postPermGroupOrUserId}
                                                onCheck={(checked) => {
                                                    setPostPermGroupOrUserId(checked);
                                                }}
                                            />
                                        )}
                                    </Form>
                                </IIF>
                            </Card>
                        </TabPane>
                        <TabPane size="small" tab="功能数据权限" key="buttonPerm" style={{ padding: 0 }}>
                            <Card
                                bordered={false}
                                size='small'
                                bodyStyle={{ height: clientHeight - 210, overflow: 'scroll', padding: '5px 10px 5px 10px' }}
                            >
                                <IIF test={!selectButtonPermId}>
                                    <Alert message="请选择一个带数据权限（即有@Action注解）的按钮，可通过“数据权限”选择框进行过滤数据权限的按钮！" type="warning" showIcon />
                                </IIF>
                                <IIF test={!!selectButtonPermId}>
                                    <Form form={form} size='small' layout="horizontal" className="odm-form">

                                        <Row gutter={12}>
                                            <Col span={24}>
                                                <Form.Item
                                                    labelCol={{ span: 3 }}
                                                    name="permScope"
                                                    tooltip="所能看到的数据范围"
                                                    label="权限范围"
                                                >
                                                    <Radio.Group
                                                        disabled={true}
                                                        buttonStyle="solid"
                                                        style={{ width: '240px' }}
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
                                                        labelCol={{ span: 3 }}
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
                                </IIF>
                            </Card>
                        </TabPane>

                        <TabPane tab="业务数据权限" key="businessPerm" style={{ padding: 0 }} >
                            <Card
                                bordered={false}
                                size='small'
                                bodyStyle={{ height: clientHeight - 210, overflow: 'scroll', padding: '5px' }}
                            >
                                <IIF test={!selectButtonPermId}>
                                    <Alert message="请选择一个带数据权限（即有@Action注解）的按钮，可通过“数据权限”选择框进行过滤数据权限的按钮！" type="warning" showIcon />
                                </IIF>
                                <IIF test={!!selectButtonPermId}>
                                    <IIF test={beHaveAndCondition == false && beHaveOrCondition == false}>
                                        <Alert message="该用户未配置业务数据权限！" type="warning" showIcon />
                                    </IIF>
                                    <IIF test={beHaveAndCondition == true}>
                                        <Card
                                            bordered={true}
                                            size='small'
                                            bodyStyle={{ overflow: 'visible', padding: '2px' }}
                                        >
                                            <Form form={bformAnd} size='small' layout="horizontal" className="odm-form">
                                                <Row>
                                                    <Col span={24}>
                                                        <Form.Item
                                                            labelCol={{ span: 3 }}
                                                            name="beOrCondition"
                                                            label="条件关系"
                                                            rules={[{ required: false, message: false }]}
                                                        >
                                                            <Switch checkedChildren="OR" unCheckedChildren="AND" disabled={true} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={24}>
                                                        <Form.Item
                                                            labelCol={{ span: 3 }}
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
                                                        {/* <Alert size="small" style={{ fontSize: 12, marginBottom: 10 }} message="注意: " type="warning" showIcon={true} /> */}
                                                        <Form.Item
                                                            labelCol={{ span: 3 }}
                                                            tooltip="若勾选表格未出现选择列信息,请先到 [数据列管理] 中配置对应的表!"
                                                            name="tables"
                                                            label="表格列表"
                                                            rules={[{ required: false, message: false, type: 'array' }]}
                                                        >
                                                            <Checkbox.Group options={tableOptions} disabled={true} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                {uiAnd.map((item) => (<>{item}</>))}
                                            </Form>
                                        </Card>
                                    </IIF>
                                    <IIF test={beHaveOrCondition == true}>
                                        <Card
                                            bordered={true}
                                            size='small'
                                            style={{ marginTop: 10 }}
                                            bodyStyle={{ overflow: 'visible', padding: '2px' }}
                                        >
                                            <Form form={bformOr} size='small' layout="horizontal" className="odm-form">
                                                <Row>
                                                    <Col span={24}>
                                                        <Form.Item
                                                            labelCol={{ span: 3 }}
                                                            name="beOrCondition"
                                                            label="条件关系"
                                                            rules={[{ required: false, message: false }]}
                                                        >
                                                            <Switch checkedChildren="OR" unCheckedChildren="AND" disabled={true} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col span={24}>
                                                        <Form.Item
                                                            labelCol={{ span: 3 }}
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
                                                        {/* <Alert size="small" style={{ fontSize: 12, marginBottom: 10 }} message="注意: " type="warning" showIcon={true} /> */}
                                                        <Form.Item
                                                            labelCol={{ span: 3 }}
                                                            tooltip="若勾选表格未出现选择列信息,请先到 [数据列管理] 中配置对应的表!"
                                                            name="tables"
                                                            label="表格列表"
                                                            rules={[{ required: false, message: false, type: 'array' }]}
                                                        >
                                                            <Checkbox.Group options={tableOptions} disabled={true} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                {uiOr.map((item) => (<>{item}</>))}
                                            </Form>
                                        </Card>
                                    </IIF>
                                </IIF>
                            </Card>
                        </TabPane>

                        <TabPane tab="列数据权限" key="columnPerm" style={{ padding: 0 }}>
                            <Card
                                bordered={false}
                                size='small'
                                bodyStyle={{ height: 'calc(100vh - 255px)', overflow: 'scroll', padding: '5px' }}
                            >
                                <IIF test={!selectButtonPermId}>
                                    <Alert message="请选择一个带数据权限（即有@Action注解）的按钮，可通过“数据权限”选择框进行过滤数据权限的按钮！" type="warning" showIcon />
                                </IIF>
                                <IIF test={!!selectButtonPermId}>
                                    <Form form={cform} size='small' layout="horizontal" className="odm-form">
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
                                                    <Alert size="small" message="此功能不支持列配置(只有一列时或非查询功能,不支持列配置)!" type="info" showIcon={true} />
                                                )}
                                            </Col>
                                        </Row>
                                        {columnUi.map((item) => (<>{item}</>))}
                                    </Form>
                                </IIF>
                            </Card>
                        </TabPane>
                    </Tabs>
                </Card>
            </ILayout>
        </IWindow>
    )
}