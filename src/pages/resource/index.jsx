import {
    IAdvanceSearch,
    IFieldset,
    ISearchTree,
    Permit
} from '@/common/components';
import {
    api,
    constant,
    copyObject,
    data2Option,
    data2TextObject,
    forEach,
    forEachObject,
    isEmpty,
    isFunction,
    isNil,
    moment,
    produce,
    split,
} from '@/common/utils';
import {
    ApartmentOutlined,
    BarsOutlined,
    DeleteOutlined,
    DeleteRowOutlined,
    ScheduleOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    Alert,
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Form,
    Input,
    Radio,
    Row,
    Space,
    Switch,
    Table,
    Tabs,
    Transfer,
    message,
    Tooltip,
    Divider
} from 'antd';
import { useEffect, useRef, useState } from 'react';
import { zip } from 'rxjs';

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

let tableComment = {};
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

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
        title: '模块类型',
        width: 80,
        align: 'center',
        search: false,
        dataIndex: 'tag',
        key: 'tag',
        render: (text) => resourceType[text] || text || '-',
    },
    {
        title: '权限范围',
        width: 100,
        align: 'center',
        search: false,
        dataIndex: 'permScope',
        key: 'permScope',
        render: (text) => permScopes[text] || text || '-',
    },
];

export default () => {

    const ref = useRef();
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

    const loadGroup = () => {
        api.group.treeAllGroupsAndUsers().subscribe({
            next: (data) => {
                setTreeData(data);
                setPermTreeData(data);
            }
        });
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

    // 业务权限重置按钮
    const resetUserPerm = () => {
        if (isNil(selectedUserId) || isNil(originPermScope)) {
            return;
        }
        form.resetFields();
        form.setFieldsValue({
            userId: selectedUserId,
            permId: selectedPermId,
            usetId: selectedUsetId,
            permScope: originPermScope,
        });
        setPermScope(originPermScope);
        if (permType === 'user') {
            loadUserPermEntrusts(selectedUserGroupId, selectedUserId, selectedPermId);
        } else if (permType === 'uset') {
            loadUsetPermEntrusts(selectedUsetId, selectedPermId);
        }
    };

    //排除用户
    const onExceptUserPerm = (node, e) => {
        if (node.disabled) {
            return;
        }
        console.log(node);
        e.stopPropagation();
        userGroupKeyMap[node.key].disabled = true;
        const disables = produce(disabledNodes, (draft) => {
            draft.push(node);
        });
        setDisAbledNodes(disables);
        const ds = produce(exceptDataSource, (draft) => {
            if (node.parentGroupName) {
                draft.push({ title: node.text + '[' + node.parentGroupName + ']', key: node.key });
            } else {
                draft.push({ title: node.text, key: node.key });
            }
        })
        setExceptDataSource(ds);
        const index = permGroupOrUserId.indexOf(node.key);
        if (index !== -1) {
            const ks = produce(permGroupOrUserId, (draft) => {
                draft.splice(index, 1);
            });
            setPermGroupOrUserId(ks);

        }
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

    //数据权限表格复选框选中事件
    const onDataPermTablesChange = (checkedValue) => {
        setUi([]);
        const tables = [];
        forEach((v) => {
            const table = aliasTable[v];
            tables.push(table);
        }, checkedValue)
        fetchDataPermColumnsByTable(tables.join(","), tableAlias);

    }

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
                fetchDataPermColumnsByTable(tableNames.join(','), tableAliasMap, () => { bform.setFieldsValue(obj);setBeOrChecked(perm.beOrCondition || false) });
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
                fetchDataPermColumnsByTable(tableNames.join(','), tableAliasMap, () => { bform.setFieldsValue(obj);setBeOrChecked(perm.beOrCondition || false); });

            }
        });
    }

    //保存用户数据权限
    const submitUserDataPerm = () => {
        if (permType === 'user') {
            if (isNil(selectedUserId) || isNil(originPermScope)) {
                message.error('请先选择对应的功能!');
                return;
            }
        } else if (permType === 'uset') {
            if (isNil(selectedUsetId) || isNil(originPermScope)) {
                message.error('请先选择对应的功能!');
                return;
            }
        }
        bform.validateFields().then((values) => {
            const submitValues = [];
            if (values.tables) {
                forEach((t) => {
                    const table = aliasTable[t];
                    const dp = values[table];
                    dp.conditionTableAlias = values['conditionTableAlias' + table];
                    submitValues.push(dp);
                }, values.tables);
            }
            values.searchExpresses = submitValues;
            if (permType === 'user') {
                setSaveLoading(true);
                api.resource.saveUserDataPerm(values).subscribe({
                    next: () => {
                        message.success("操作成功!");
                    }
                }).add(() => setSaveLoading(false));
            } else if (permType === 'uset') {
                setSaveLoading(true);
                api.resource.saveUsetDataPerm(values).subscribe({
                    next: () => {
                        message.success("操作成功!");
                    }
                }).add(() => setSaveLoading(false));
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
                const tables = result.tables || [];
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
                const tables = result.tables;
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
                        size="small"
                        titles={['查询列', '排除列']}
                        dataSource={v.columns}
                        listStyle={{
                            width: 250,
                            height: 260,
                        }}
                        render={(item) => item.title}
                        targetKeys={exceptTableColumn[v.table]}
                        onChange={(targetKeys) => {
                            const ecolumns = produce(exceptTableColumn, (draft) => {
                                draft[v.table] = targetKeys;
                            });
                            setExceptTableColumn(ecolumns);
                        }}
                    />
                </IFieldset>)
        }, tables);
        setColumnUi(mui);
    }

    //列权限 选中表格事件
    const onColumnTablesChange = (checkedValue) => {
        setUi([]);
        setColumnPermSelectedTables(checkedValue);
        renderColumnPermUi(checkedValue);
    }

    //提交列权限
    const submitColumnPerm = () => {
        if (permType === 'user') {
            if (isNil(selectedUserId) || isNil(originPermScope)) {
                message.error('请先选择对应的功能!');
                return;
            }
        } else if (permType === 'uset') {
            if (isNil(selectedUsetId) || isNil(originPermScope)) {
                message.error('请先选择对应的功能!');
                return;
            }
        }
        cform.validateFields().then((values) => {
            const submitValues = [];
            forEachObject((v, k) => {
                const action = {};
                action.table = k;
                action.alias = tableAlias[k];
                const cmns = [];
                if (v) {
                    forEach(vv => {
                        let beSpecial = false;
                        if (specialColumns.includes(vv)) {
                            beSpecial = true;
                        }
                        cmns.push({ columnName: vv, tableName: action.alias || action.table, beSpecial });
                    }, v)
                }
                action.columns = cmns;
                submitValues.push(action);
            }, exceptTableColumn);
            values.tableColumns = submitValues;
            if (permType === 'user') {
                setSaveLoading(true);
                api.resource.saveUserColumnPerm(values).subscribe({
                    next: () => {
                        message.success("操作成功!");
                    }
                }).add(() => setSaveLoading(false));
            } else if (permType === 'uset') {
                setSaveLoading(true);
                api.resource.saveUsetColumnPerm(values).subscribe({
                    next: () => {
                        message.success("操作成功!");
                    }
                }).add(() => setSaveLoading(false));
            }
        });
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
    const onUserSelect = (node) => {
        let uid = node.key;
        if (uid.indexOf('#') !== 0) {
            // eslint-disable-next-line prefer-destructuring
            uid = split(uid, '#')[1];
        }
        setSelectedUserId(uid);
        loadPermResourceByUser(node.parentId, uid);
        setSelectedUserGroupId(node.parentId);
        setSelectedKeys([]);
        setSelectedTag('');
        setPermType('user');
    };

    const onUsetSelect = (node) => {
        const usetId = node.key;
        loadPermResourceByUset(usetId);
        setPermType('uset');
        setSelectedUsetId(usetId);
        setSelectedTag('');
        setSelectedKeys([]);
    };

    // 用户权限保存按钮
    const submitUserPerm = () => {
        if (permType === 'user') {
            if (isNil(selectedUserId) || isNil(originPermScope)) {
                message.error('请先选择对应的功能!');
                return;
            }
        } else if (permType === 'uset') {
            if (isNil(selectedUsetId) || isNil(originPermScope)) {
                message.error('请先选择对应的功能!');
                return;
            }
        }
        setConfirmLoading(true);
        form.validateFields().then((values) => {
            console.log(values);
            copyObject(values, {
                groupEntrusts: [],
                userEntrusts: [],
                permStartTime: values.timeRange && values.timeRange[0],
                permEndTime: values.timeRange && values.timeRange[1],
                exceptGroupEntrusts: [],
                exceptUserEntrusts: [],
            });
            if (isEmpty(permGroupOrUserId)) {
                const g = [];
                const u = [];
                forEach((v) => {
                    if (v.indexOf('#') !== -1) {
                        v = split(v, '#')[1];
                        u.push(v);
                    } else {
                        g.push(v);
                    }
                }, permGroupOrUserId);
                copyObject(values, {
                    groupEntrusts: g,
                    userEntrusts: u,
                });
            }
            if (!isEmpty(exceptDataSource)) {
                const eg = [];
                const eu = [];
                forEach((v) => {
                    let dsKey = v.key;
                    if (dsKey.indexOf('#') !== -1) {
                        // eslint-disable-next-line no-param-reassign
                        dsKey = split(dsKey, '#')[1];
                        eu.push(dsKey);
                    } else {
                        eg.push(dsKey);
                    }
                }, exceptDataSource);
                copyObject(values, {
                    exceptGroupEntrusts: eg,
                    exceptUserEntrusts: eu,
                });
            }
            if (permType === 'user') {
                api.resource.saveUserBusinessPerm(values).subscribe({
                    next: () => {
                        message.success('操作成功!');
                        loadPermResourceByUser(selectedUserGroupId, selectedUserId);
                    },
                }).add(() => setConfirmLoading(false));
            } else if (permType === 'uset') {
                api.resource.saveUsetBusinessPerm(values).subscribe({
                    next: () => {
                        message.success('操作成功!');
                        loadPermResourceByUset(selectedUsetId);
                    },
                }).add(() => setConfirmLoading(false));
            }
        }).catch(() => {
            setConfirmLoading(false);
        });
    };

    const treeAllUset = () => {
        api.uset.treeAllUset().subscribe({
            next: (data) => setUsetTreeData(data),
        });
    };

    useEffect(() => {
        loadGroup();
        treeAllUset();
    }, []);

    useEffect(() => {
        renderColumnPermUi(columnPermSelectedTables);
    }, [exceptTableColumn])

    return (
        <>
            <Row gutter={5}>
                <Col span={5}>
                    <Card
                        size='small'
                        bordered={false}
                        bodyStyle={{ height: 'calc(100vh - 130px)', overflow: 'scroll', paddingTop: '5px' }}
                    >
                        <Tabs size="small" type="card" >
                            <TabPane size='small' tab="用户组织" key="userGroup">
                                {/* <div> */}
                                <ISearchTree
                                    bordered={false}
                                    bodyStyle={{}}
                                    // bodyStyle={{ height: 'calc(100vh - 130px)', overflow: 'scroll' }}
                                    iconRender={(data) => loopGroup(data, true, true)}
                                    treeData={treeData}
                                    onSelect={(uids, { node }) => onUserSelect(node)}
                                    titleRender={(node) => (
                                        <div style={{ width: '100%' }}>
                                            <div style={{ float: 'left' }}>
                                                {node.icon} {node.title}
                                            </div>
                                        </div>
                                    )}
                                />
                            </TabPane>
                            <TabPane size='small' tab="用户组" key="userUset">
                                <ISearchTree
                                    bordered={false}
                                    bodyStyle={{}}
                                    // bodyStyle={{ height: 'calc(100vh - 130px)', overflow: 'scroll' }}
                                    treeData={usetTreeData}
                                    onSelect={(uids, { node }) => onUsetSelect(node)}
                                    titleRender={(node) => (
                                        <div style={{ width: '100%' }}>
                                            <div style={{ float: 'left' }}>
                                                {node.icon} {node.title}
                                            </div>
                                        </div>
                                    )}
                                />
                            </TabPane>
                        </Tabs>
                    </Card>
                </Col>
                <Col span={10}>
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
                        bodyStyle={{ height: 'calc(100vh - 170px)', overflow: 'scroll' }}
                    >
                        <Table
                            size="small"
                            bordered
                            rowKey="id"
                            actionRef={ref}
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
                    </Card>
                </Col>
                {selectedTag && selectedTag === 'BUTTON' && (
                    <Col span={9}>
                        <Card
                            size='small'
                            bordered={true}
                            bodyStyle={{ padding: 5, height: 'calc(100vh - 130px)', overflow: 'scroll' }} >
                            <Tabs
                                activeKey={key}
                                size="small"
                                type="card"
                                onChange={(activeKey) => {
                                    setKey(activeKey);
                                    onSelect(selectedRecord, activeKey);
                                }}>

                                <TabPane tab="功能数据权限" key="buttonPerm" style={{ padding: 0 }}>
                                    <Card
                                        bordered={false}
                                        size='small'
                                        bodyStyle={{ height: 'calc(100vh - 255px)', overflow: 'scroll' }}
                                        actions={[
                                            <div style={{ float: 'right', paddingRight: '10px' }} key="bottom">
                                                <Permit authority="resource:saveUsetBusinessPerm">
                                                <Button
                                                    key="cancel"
                                                    danger
                                                    htmlType="button"
                                                    onClick={() => resetUserPerm()}
                                                    style={{ marginRight: '10px' }}>重置</Button>
                                                </Permit>
                                                <Permit authority="resource:saveUsetBusinessPerm">
                                                <Button
                                                    key="submit"
                                                    type="primary"
                                                    htmlType="submit"
                                                    onClick={submitUserPerm}
                                                    loading={confirmLoading}>保存</Button>
                                                </Permit>
                                            </div>,
                                        ]}
                                    >
                                        <Form form={form} size='small' layout="horizontal" className="snam-form">
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
                                                                titleRender={(node) => (
                                                                    <div style={{ width: '100%' }}>
                                                                        <div style={{ float: 'left' }}>
                                                                            {node.icon} {node.title}
                                                                        </div>
                                                                        <div style={{ float: 'right', zIndex: 999 }}>
                                                                            <Space>
                                                                                <DeleteRowOutlined
                                                                                    size="small"
                                                                                    title='排除'
                                                                                    onClick={(e) => onExceptUserPerm(node, e)}
                                                                                />
                                                                            </Space>
                                                                        </div>
                                                                    </div>
                                                                )}
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

                                </TabPane>
                                <TabPane tab="业务数据权限" key="businessPerm" style={{ padding: 0 }}>
                                    <Card
                                        bordered={false}
                                        size='small'
                                        bodyStyle={{ height: 'calc(100vh - 255px)', overflow: 'scroll', padding: '2px' }}
                                        actions={[
                                            <div style={{ float: 'right', paddingRight: '10px' }} key="bottom">
                                                <Permit authority="resource:saveDataPerm">
                                                <Button
                                                    key="submit"
                                                    type="primary"
                                                    htmlType="submit"
                                                    loading={saveLoading}
                                                    onClick={() => submitUserDataPerm()}
                                                >保存</Button>
                                                </Permit>
                                            </div>,
                                        ]}
                                    >
                                        <Form form={bform} size='small' layout="horizontal" className="snam-form">
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
                                                        <Switch checkedChildren="OR" unCheckedChildren="AND" checked={beOrChecked} onChange={(checked) => setBeOrChecked(checked)} />
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
                                                        <Checkbox.Group options={tableOptions} onChange={onDataPermTablesChange} />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                            {ui.map((item) => (<>{item}</>))}
                                        </Form>
                                    </Card>
                                </TabPane>

                                <TabPane tab="列数据权限" key="columnPerm" style={{ padding: 0 }}>
                                    <Card
                                        bordered={false}
                                        size='small'
                                        bodyStyle={{ height: 'calc(100vh - 255px)', overflow: 'scroll', padding: '2px' }}
                                        actions={[
                                            <div style={{ float: 'right', paddingRight: '10px' }} key="bottom">
                                                <Permit authority="resource:saveUserColumnPerm">
                                                <Button
                                                    key="submit"
                                                    type="primary"
                                                    htmlType="submit"
                                                    loading={saveLoading}
                                                    onClick={() => submitColumnPerm()}
                                                >保存</Button>
                                                </Permit>
                                            </div>,
                                        ]}
                                    >
                                        <Form form={cform} size='small' layout="horizontal" className="snam-form">
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
                                                            <Checkbox.Group options={columnPermTableOptions} onChange={onColumnTablesChange} />
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
                    </Col>
                )}
            </Row>
        </>
    );
}