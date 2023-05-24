import React, {useEffect, useRef, useState} from 'react';
import {api, isArray, join, pluck, split, useAutoObservableEvent, useObservableAutoCallback,} from '@/common/utils';
import {
    AppstoreOutlined,
    AppstoreTwoTone,
    CaretDownOutlined,
    DeleteOutlined,
    FormOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
} from '@ant-design/icons';
import {IFooterToolbar, IGrid, IModal, IStatus,} from '@/common/components';

import {showDeleteConfirm} from '@/common/antd';
import objectAssign from 'object-assign';
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Radio,
    Row,
    Select,
    Space,
    Tooltip,
    Tree,
    Tag,
} from 'antd';
import * as R from 'ramda';
import debounce from "lodash/debounce";
import {debounceTime, distinctUntilChanged, map, shareReplay, switchMap, tap,} from 'rxjs/operators';
import {of} from 'rxjs';


const StateRenderer = (props) => {
    return props.value && <IStatus value={props.value} state={state}/>
}
const TagRenderer = (props) => {
    if (props.value === true) {
        return <Tag color="#f50">是</Tag>;
    }
    return <Tag color="#2db7f5">否</Tag>;
}
// 列初始化
const initColumns = [
    {
        title: '子菜单',
        width: 90,
        align: 'center',
        dataIndex: 'subMenu',
    },
    {
        title: '按钮名称',
        width: 180,
        align: 'left',
        dataIndex: 'buttonName',
    },

    {
        title: '忽略权限',
        align: 'center',
        width: 80,
        dataIndex: 'beUnauth',
        cellRenderer:'tagCellRenderer'
    },
    {
        title: '请求URL',
        width: 260,
        align: 'left',
        dataIndex: 'reqUrl',
    },
    {
        title: '请求方法',
        align: 'center',
        width: 90,
        dataIndex: 'reqMethod',
    },
    {
        title: '备注',
        align: 'center',
        width: 100,
        dataIndex: 'note',
    },

];

export default (props) => {
    const {Search} = Input;
    const ref = useRef();
    const [searchForm] = Form.useForm();
    const [dataSource, setDataSource] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const [disabledActive, setDisabledActive] = useState(true);
    const [disabledStop, setDisabledStop] = useState(true);

    const [modalItem, setModalItem] = useState({});
    const [modalVisible, setModalVisible] = useState(false);


    // 列表选中数据ID列表
    // const [selectedKeys, setSelectedKeys] = useState([]);
    // 分配用户窗口中树的数据
    const [treeData, setTreeData] = useState([]);
    // 选中的组织ID
    const [selectedMenuId, setSelectedMenuId] = useState();
    // 选中的组织名称
    const [selectedMenuName, setSelectedMenuName] = useState();
    // 是否刷新表格
    const [beReloadTree, setBeReloadTree] = useState(false);
    // 表格刷新功能
    // const reload = () => ref.current.reload();
    const refresh = () => ref.current.refresh();
    // const { dropScope, refresh } = useAliveController();
    // 自动展开父节点的状态
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    // 展开的树节点key
    const [expandedKeys, setExpandedKeys] = useState([]);
    // 查询值
    const [searchValue, setSearchValue] = useState({});
    //编辑的菜单项
    const [menuItem, setMenuItem] = useState({});
    //菜单窗口显示
    const [menuVisible, setMenuVisible] = useState(false);
    //菜单类型是否不可用
    const [menuTypeDisabled, setMenuTypeDisabled] = useState(false);
    //菜单ID不可用
    const [menuIdDisabled, setMenuIdDisabled] = useState(false);

    //编辑的按钮项
    const [buttonItem, setButtonItem] = useState({});
    //按钮窗口显示
    const [buttonVisible, setButtonVisible] = useState(false);
    //按钮ID不可用
    const [buttonIdDisabled, setButtonIdDisabled] = useState(false);
    const onExpand = (keys) => {
        setExpandedKeys(keys);
        setAutoExpandParent(false);
    };
    const loop = (data) =>
        data.map((item) => {
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
                objectAssign(c, item, {
                    name,
                    key: item.key,
                    text: item.name,
                    parentGroupName: item.parentGroupName,
                    children: loop(item.children),
                });
                return c;
            }
            const d = {};
            objectAssign(d, item, {name, text: item.name, parentGroupName: item.parentGroupName});
            return d;
        });

    const reloadTree = () => {
        setBeReloadTree(!beReloadTree);
    };

    const dataList = [];
    let gData = [];

    const generateList = (data) => {
        for (let i = 0; i < data.length; i += 1) {
            const node = data[i];
            const {key, name} = node;
            dataList.push({key, name});
            if (node.children) {
                generateList(node.children);
            }
        }
    };

    const getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i += 1) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some((item) => item.key === key)) {
                    parentKey = node.key;
                } else if (getParentKey(key, node.children)) {
                    parentKey = getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };

    const [onChange, selectedKeys, setSelectedKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((v) => of(pluck('id', v))),
            shareReplay(1),
        ),
    );

    const delayedQuery = useRef(debounce((value) => onChange(value), 300)).current;

    // 将组织设置为不可选
    const loopGroup = (data) => {
        R.forEach((v) => {
            if (v.tag && v.tag === 'ADMIN') {
                objectAssign(v, {
                    icon: <AppstoreTwoTone/>,
                });
            } else {
                objectAssign(v, {icon: <AppstoreOutlined/>});
            }
            if (v.children && !R.isEmpty(v.children)) {
                loopGroup(v.children);
            }
        })(data);
    };

    //查询
    const loadGroup = () => {
        let param = {dto: searchForm.getFieldValue()};
        api.menu.searchTreeAllMenu(param)
            .subscribe({
                next: (data) => {
                    // console.log(data);
                    gData = _.cloneDeep(data);
                    generateList(gData);
                    loopGroup(data, true);
                    setTreeData(data);
                },
            });
    };

    const saveOrUpdateMenus = (menu) => {
        // console.log(menu);
        // menu.icon = menu.icon;
        // menu.path = menu.reqUrl;
        // menu.parent = menu.parentId;
        // menu.name = menu.menuName;
        api.menu.saveOrUpdateMenu(menu).subscribe(
            {
                next: (data) => {
                    message.success('操作成功!');
                    setMenuVisible(false);
                    reloadTree();
                },
            }
        );
    };

    //添加菜单
    const handleAddMenu = (node) => {
        // setSelectedMenuId(node.key);
        if (node && node.key) {
            setMenuTypeDisabled(true);
        } else {
            setMenuTypeDisabled(false);
        }
        setMenuIdDisabled(false);
        // console.log(node)
        setMenuItem({
            id: '',
            name: '',
            parent: node.id,
            parentName: node && node.text,
            menuType: node && node.menuType,
        });
        setMenuVisible(true);
    };
    //编辑菜单
    const handleEditMenu = (node) => {
        console.log(node)
        setMenuTypeDisabled(true);
        setMenuIdDisabled(true);
        setMenuItem({
            id: node.key,
            parent: node.parent,
            menuName: node.text,
            parentName: node.parentGroupName,
            icon: node.iconCls,
            ...node,
        });
        setMenuVisible(true);
    };
    // 删除菜单
    const handleDeleteMenu = (node) => {
        Modal.confirm({
            title: '删除菜单前，请确认菜单中不包含子菜单和按钮，确定要删除该菜单吗？',
            okText: '删除',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                // setSelectedMenuId(node.parentId);
                // console.log(node.id);
                const id = node.id;
                api.menu
                    .deleteMenu([id])
                    .subscribe({
                        next: (data) => {
                            setDataSource(data.data);
                            setTotal(data.total);
                        },
                    })
            },
        });
    };

    // 查询button
    const search = (pageNo, pageSize, menuId) => {
        setSelectedKeys([]);
        // setSearchLoading(true);
        let param = {dto: searchForm.getFieldValue() || {}, pageNo: pageNo, pageSize: pageSize};
        param.dto.menuId = menuId;
        return api.menu
            .searchButtonsAndApiByMenu(param)
            .subscribe({
                next: (data) => {
                    setDataSource(data.data);
                    setTotal(data.total);
                },
            })
            .add(() => {
                setSearchLoading(false);
            });
    };

    const handleAddButton = (button) => {
        if (!selectedMenuId) {
            message.error('请先选择一个菜单！');
            return;
        }
        if (button && button.id) {
            setButtonIdDisabled(true);
        } else {
            setButtonIdDisabled(false);
        }
        // setButtonIdDisabled(false)
        setButtonItem({
            menuId: selectedMenuId,
            name: selectedMenuName,
            menuName: selectedMenuName,
            ...button,
        });
        setButtonVisible(true);
    };

    // 按钮 双击
    const [onDoubleClick] = useAutoObservableEvent([
        switchMap((id) => api.menu.getButton(id)),
        map((data) => {
            const user = data[0];
            if (user && user.userTag) {
                user.userTag = split(user.userTag);
            }
            return user;
        }),
        tap((data) => {
            setButtonVisible(true)
            setButtonItem(data)
        }),
    ]);

    // 保存 更新按钮
    const [onSaveClick] = useAutoObservableEvent([
        map((user) => {
            if (isArray(user.userTag)) {
                user.userTag = join(',', user.userTag);
            }
            return user;
        }),
        switchMap((user) => api.menu.saveOrUpdateButton(user)),
        tap(() => {
            setModalVisible(false);
            message.success('操作成功!');
            refresh();
        }),
    ]);


    // 按钮 删除
    const [onDelete] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            switchMap((keys) => api.menu.deleteButton(keys)),
            tap(() => {
                message.success('操作成功!');
                refresh();
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );


    useEffect(() => {
        loadGroup();
    }, [beReloadTree]);


    // 列表及弹窗
    return (
        <>
            <Row gutter={12}>
                <Col span={7}>
                    <Card
                        size='small'
                        title={
                            <>
                               <span style={{ flat: 'right', padding: '15' }}>菜单管理</span>
                                <div style={{ float: 'right', paddingRight: '1px', width: '80%' }}>

                                    <Search
                                        style={{ marginTop: '0px' }}
                                        size="small"
                                        placeholder="输入菜单名称搜索"
                                        enterButton
                                        onChange={delayedQuery}
                                    />

                                </div>
                            </>
                        }
                        bordered={true}
                        bodyStyle={{height: 'calc(100vh - 190px)', overflow: 'scroll'}}
                    >
                        <Tree
                            onExpand={onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            switcherIcon={<CaretDownOutlined/>}
                            blockNode={true}
                            treeData={loop(treeData)}
                            titleRender={(node) => (
                                <div style={{width: '100%'}}>
                                    <div style={{float: 'left'}}>
                                        {node.icon} {node.title}
                                    </div>
                                    {/* {node.tag === 'GROUP' && ( */}
                                    <div style={{float: 'right', zIndex: 999}}>
                                        <Space>
                                            {/* <Permit authority="menu:saveOrUpdate" key="saveMenu"> */}
                                            <PlusOutlined
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddMenu(node);
                                                }}
                                            />
                                            {/* </Permit> */}
                                            {/* <Permit authority="menu:saveOrUpdate" key="updateMenu"> */}
                                            <FormOutlined
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditMenu(node);
                                                }}
                                            />
                                            {/* </Permit> */}
                                            {/* <Permit authority="menu:delete" key="deleteMenu"> */}
                                            <DeleteOutlined
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteMenu(node);
                                                }}
                                            />
                                            {/* </Permit> */}
                                        </Space>
                                    </div>
                                    {/* )} */}
                                </div>
                            )}
                            onSelect={(keys, {selected, node}) => {
                                if (selected) {
                                    setSelectedMenuId(node.key);
                                    setSelectedMenuName(node.text);
                                    search(1, 20, node.key);
                                }
                            }}
                        />
                    </Card>
                </Col>
                <Col span={17}>
                    <IGrid
                        ref={ref}
                        title="按钮列表"
                        components={{
                            tagCellRenderer: TagRenderer,
                          }}
                        initColumns={initColumns}
                        request={(pageNo, pageSize) => search(pageNo, pageSize, selectedMenuId)}
                        dataSource={dataSource}
                        total={total}
                        onSelectedChanged={onChange}
                        clearSelect={searchLoading}
                        onDoubleClick={(record) => onDoubleClick(record.id)}
                        toolBarRender={[
                            // <Button
                            //     key="apply"
                            //     type="danger"
                            //     size="small"
                            //     shape="round"
                            //     onClick={handleAddButton}
                            // >新建根菜单</Button>,

                            <Button
                                key="apply"
                                type="primary"
                                size="small"
                                shape="round"
                                onClick={handleAddButton}
                            >新建</Button>

                        ]}
                    />
                    {selectedKeys?.length > 0 && (
                        <IFooterToolbar>
                            <Button type="danger" key="delete"
                                    onClick={() => showDeleteConfirm('确定删除选中的用户吗?', () => onDelete(selectedKeys))}>
                                删除
                            </Button>
                        </IFooterToolbar>
                    )}
                </Col>
                <IModal
                    title={menuItem && menuItem.id ? '编辑菜单' : '添加菜单'}
                    width="500px"
                    current={menuItem}
                    onCancel={() => {
                        setMenuVisible(false);
                    }}
                    visible={menuVisible}
                    onSubmit={(menu) => {
                        saveOrUpdateMenus(menu);
                    }}
                >
                    <Form.Item style={{display: 'none'}}>
                        <Form.Item name="parentId" label="parentId">
                            <Input/>
                        </Form.Item>
                    </Form.Item>
                    <Row>
                        <Col span={22}>
                            <Form.Item labelCol={{span: 5}} name="parent" label="上级菜单ID">
                                <Input placeholder="" readOnly/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item labelCol={{span: 5}} name="parentName" label="上级菜单">
                                <Input placeholder="" readOnly/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item
                                labelCol={{span: 5}}
                                name="id"
                                label="菜单ID"
                                rules={[{whitespace: false, required: true, message: false, max: 50}]}
                            >
                                <Input placeholder="" disabled={menuIdDisabled}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item
                                labelCol={{span: 5}}
                                name="menuName"
                                label="菜单名称"
                                rules={[{whitespace: false, required: true, message: false, max: 50}]}
                            >
                                <Input placeholder=""/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item
                                labelCol={{span: 5}}
                                name="reqUrl"
                                label="请求URL"
                                rules={[{whitespace: false, max: 100}]}
                            >
                                <Input placeholder=""/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item
                                labelCol={{span: 5}}
                                name="reqMethod"
                                label="请求方法"
                                rules={[{whitespace: false, required: false, message: false, max: 50}]}
                            >
                                {/* <Input placeholder="" readOnly  /> */}
                                <Select disabled={false}>
                                    <Option value="POST">POST</Option>
                                    <Option value="PUT">PUT</Option>
                                    <Option value="DELETE">DELETE</Option>
                                    <Option value="GET">GET</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item
                                labelCol={{span: 5}}
                                name="menuType"
                                label="类型"
                                // rules={[{ whitespace: false, required: true, message: false, max: 50 }]}
                            >
                                <Select disabled={false}>
                                    <Option value="ADMIN">系统</Option>
                                    <Option value="BUSINESS">业务</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item labelCol={{span: 5}} name="iconCls" label="图标">
                                <Input placeholder=""/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item labelCol={{span: 5}} name="beUnauth" label="忽略授权">
                                <Radio.Group defaultValue={false}>
                                    <Radio value={false}>否</Radio>
                                    <Radio value={true}>是</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item labelCol={{span: 5}} name="beHidden" label="是否隐藏">
                                <Radio.Group defaultValue={false}>
                                    <Radio value={false}>否</Radio>
                                    <Radio value={true}>是</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item
                                labelCol={{span: 5}}
                                name="priority"
                                label="优先级"
                                rules={[{required: true}]}
                            >
                                <InputNumber placeholder="" min="0"/>
                            </Form.Item>
                        </Col>
                    </Row>
                </IModal>

                <IModal
                    title={buttonItem && buttonItem.id ? '编辑按钮' : '添加按钮'}
                    width="500px"
                    current={buttonItem}
                    visible={buttonVisible}
                    onCancel={() => {
                        setButtonVisible(false);
                    }}
                    onSubmit={(item) => {
                        onSaveClick(item);
                    }
                    }
                >
                    <Form.Item style={{display: 'none'}}>
                        <Form.Item name="menuId" label="menuId">
                            <Input/>
                        </Form.Item>
                    </Form.Item>
                    <Row>
                        <Col span={22}>
                            <Form.Item labelCol={{span: 5}} name="menuName" label="菜单名称">
                                <Input placeholder="" readOnly/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item
                                labelCol={{span: 5}}
                                name="id"
                                label="按钮ID"
                                rules={[{whitespace: false, required: true, message: false, max: 50}]}
                            >
                                <Input placeholder="" disabled={buttonIdDisabled}/>
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Tooltip title="格式为 菜单ID:按钮功能">
                                &nbsp;
                                <QuestionCircleOutlined/>
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item
                                labelCol={{span: 5}}
                                name="buttonName"
                                label="按钮名称"
                                rules={[{whitespace: false, required: true, message: false, max: 50}]}
                            >
                                <Input placeholder=""/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item labelCol={{span: 5}} name="subMenu" label="子菜单名称">
                                <Input placeholder=""/>
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <Tooltip title="权限按钮所在的菜单组">
                                &nbsp;
                                <QuestionCircleOutlined/>
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item
                                labelCol={{span: 5}}
                                name="reqUrl"
                                label="请求URL"
                                rules={[{whitespace: false, required: true, message: false, max: 100}]}
                            >
                                <Input placeholder=""/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item
                                labelCol={{span: 5}}
                                name="reqMethod"
                                label="请求方法"
                                rules={[{whitespace: false, required: true, message: false, max: 50}]}
                            >
                                {/* <Input placeholder="" readOnly  /> */}
                                <Select>
                                    <Option value="POST">POST</Option>
                                    <Option value="PUT">PUT</Option>
                                    <Option value="DELETE">DELETE</Option>
                                    <Option value="GET">GET</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={22}>
                            <Form.Item labelCol={{span: 5}} name="beUnauth" label="忽略授权">
                                <Radio.Group defaultValue={false}>
                                    <Radio value={false}>否</Radio>
                                    <Radio value={true}>是</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                </IModal>
            </Row>


        </>
    );
};
