import { IFooterToolbar, IAGrid, ISearchTree, IStatus, Permit, ISearchForm, IFormItem } from '@/common/components';
import { INewWindow, api, copyObject, forEach, isEmpty, pluck } from '@/common/utils';
import {
    AppstoreOutlined,
    AppstoreTwoTone,
    DeleteOutlined,
    FormOutlined,
    PlusOutlined,
    LockTwoTone,
    UnlockTwoTone,
    DiffOutlined,
    FolderAddOutlined,
    RestOutlined,
    PlusSquareOutlined
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

import { showDeleteConfirm } from '@/common/antd';
import {
    Button,
    Col,
    Form,
    Input,
    Row,
    Space,
    Tag,
    message,
    Checkbox,
    Tooltip
} from 'antd';
import objectAssign from 'object-assign';


const StateRenderer = (props) => {
    return props.value && <IStatus value={props.value} state={state} />
}
const TagRenderer = (props) => {
    if (props.value === true) {
        return <Tag color="#f50">是</Tag>;
    }
    return <Tag color="#2db7f5">否</Tag>;
}

const TagActionRenderer = (props) => {
    if (props.value) {
        return <Tag color="#108ee9">{props.value}</Tag>;
    }
    return <></>
}

//组件
const LockRenderer = (props) => {
    return props.value ? (
        <LockTwoTone twoToneColor="#FF0000" />
    ) : (
        <UnlockTwoTone twoToneColor="#52c41a" />
    );
};

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
        headerName: '按钮ID',
        width: 140,
        align: 'left',
        field: 'id',
    },
    {
        headerName: '锁定',
        width: 70,
        field: 'beLock',
        cellRenderer: LockRenderer
    },
    {
        headerName: '子菜单',
        width: 70,
        align: 'center',
        field: 'subMenu',
    },
    {
        headerName: '按钮名称',
        width: 120,
        align: 'left',
        field: 'buttonName',
    },
    {
        headerName: '忽略权限',
        align: 'center',
        width: 80,
        field: 'beUnauth',
        cellRenderer: TagRenderer
    },
    {
        headerName: '请求URL',
        width: 260,
        align: 'left',
        field: 'reqUrl',
    },
    {
        headerName: '请求方法',
        align: 'center',
        width: 90,
        field: 'reqMethod',
    },
    {
        headerName: '权限标识',
        align: 'left',
        width: 140,
        field: 'permAction',
        // cellRenderer: 'tagActionCellRenderer',
    },
    {
        headerName: '权限引用',
        align: 'left',
        width: 100,
        field: 'actionRef',
    },
    {
        headerName: '备注',
        align: 'center',
        width: 100,
        field: 'note',
    },

];

export default (props) => {
    const { Search } = Input;
    const ref = useRef();
    const [searchForm] = Form.useForm();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [tableHight, setTableHight] = useState(clientHeight - 260);
    const [dataSource, setDataSource] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(50);

    const [disabledActive, setDisabledActive] = useState(true);
    const [disabledStop, setDisabledStop] = useState(true);



    // 列表选中数据ID列表
    // const [selectedKeys, setSelectedKeys] = useState([]);
    // 分配用户窗口中树的数据
    const [treeData, setTreeData] = useState([]);
    // 选中的组织ID
    const [selectedMenuId, setSelectedMenuId] = useState();
    // 选中的组织名称
    const [selectedMenuName, setSelectedMenuName] = useState();
    //选中的按钮
    const [selectedRecords, setSelectedRecords] = useState([]);
    //选中的按钮ID
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [searchChecked, setSearchChecked] = useState(false);
    const [tableSearchValue, setTableSearchValue] = useState('');

    const onChange = (records) => {
        setSelectedRecords(records);
        setSelectedKeys(pluck('id', records));
    }

    const onChangeSearch = (e) => {
        setSearchChecked(e.target.checked);
    }

    // const [onChange, selectedKeys, setSelectedKeys] = useObservableAutoCallback((event) =>
    //     event.pipe(
    //         debounceTime(300),
    //         distinctUntilChanged(),
    //         switchMap((v) => {
    //             setSelectedRecords(v);
    //             return of(pluck('id', v))
    //         }),
    //         shareReplay(1),
    //     ),
    // );


    //设置图标
    const loop = (data) => {
        forEach((v) => {
            if (v.tag && v.tag === 'ADMIN') {
                objectAssign(v, {
                    icon: <AppstoreTwoTone />,
                });
            } else {
                objectAssign(v, { icon: <AppstoreOutlined /> });
            }
            if (v.children && !isEmpty(v.children)) {
                loop(v.children);
            } else {
                objectAssign(v, {
                    isLeaf: true,
                });
            }
        }, data);
    };

    //查询
    const loadAllMenu = () => {
        api.menu.searchTreeAllMenu().subscribe({
            next: (data) => {
                setTreeData(data);
            },
        });
    };


    //添加菜单
    const handleAddMenu = (node) => {
        const param = {
            id: '',
            name: '',
            parentId: node.key,
            parentName: node && node.text,
            menuType: node && node.menuType,
            reqMethod: 'GET',
        };
        INewWindow({
            url: '/new/menu/save',
            title: '新建菜单',
            width: 700,
            height: 600,
            callback: () => {
                loadAllMenu();
            },
            callparam: () => param,
        });
    };

    //编辑菜单
    const handleEditMenu = (node) => {
        const param = {
            id: node.key,
            parentId: node.parentId,
            menuName: node.text,
            parentName: node.parentGroupName,
            icon: node.iconCls,
            ...node,
        };
        INewWindow({
            url: '/new/menu/save',
            title: '编辑菜单',
            width: 700,
            height: 600,
            callback: () => {
                loadAllMenu();
            },
            callparam: () => param,
        });
    };
    // 删除菜单
    const handleDeleteMenu = (node) => {
        const id = node.key;
        api.menu.deleteMenu([id]).subscribe({
            next: (data) => {
                loadAllMenu();
            },
        })

    };

    // 查询button
    const search = (pageNo, pageSize, beInMenu) => {
        setSelectedKeys([]);
        let param = { dto: {}, pageNo: pageNo, pageSize: pageSize };
        param.dto.menuId = beInMenu === true ? selectedMenuId : '';
        param.dto.keyword = tableSearchValue;
        return api.menu.searchButtonsAndApiByMenu(param).subscribe({
            next: (data) => {
                setDataSource(data.data);
                setTotal(data.total);
            },
        }).add(() => {
            setSearchLoading(false);
        });
    };

    const handleAddButton = (button) => {
        if (!selectedMenuId) {
            message.error('请先选择一个菜单！');
            return;
        }
        const param = {
            menuId: selectedMenuId,
            name: selectedMenuName,
            menuName: selectedMenuName,
        };
        if (button) {
            copyObject(param, button);
        }
        INewWindow({
            url: '/new/menu/button',
            title: button.id ? '编辑菜单' : '新建按钮',
            width: 700,
            height: 600,
            callback: () => {
                loadAllMenu();
                search(pageNo, pageSize, true);
            },
            callparam: () => param,
        });
    };

    const handleCopyButton = () => {
        if (!selectedMenuId) {
            message.error('请先选择一个菜单！');
            return;
        }
        if (selectedKeys.length !== 1) {
            message.error('请选择一条按钮数据！');
            return;
        }
        const button = selectedRecords[0];
        const param = {
            menuId: selectedMenuId,
            name: selectedMenuName,
            menuName: selectedMenuName,
            ...button,
        };
        param.id = '';
        INewWindow({
            url: '/new/menu/button',
            title: '复制新建按钮',
            width: 700,
            height: 600,
            callback: () => {
                loadAllMenu();
                search(pageNo, pageSize, true);
            },
            callparam: () => param,
        });
    }

    // 按钮删除
    const onDeleteButton = () => {
        setLoading(true);
        api.menu.deleteButton(selectedKeys).subscribe({
            next: () => {
                message.success('操作成功!');
                search(pageNo, pageSize, searchChecked || (!!selectedMenuId));
            }
        }).add(() => setLoading(false))
    };

    useEffect(() => {
        loadAllMenu();
    }, []);

    useEffect(() => {
        search(pageNo, pageSize, true);
    }, [selectedMenuId])

    useEffect(() => {
        search(pageNo, pageSize, searchChecked);
    }, [tableSearchValue])

    const { offsetHeight } = window.document.getElementsByClassName("cala-body")[0]; //获取容器高度
    // 列表及弹窗
    return (
        <>
            <Row >
                <Col span={6}>
                    <ISearchTree
                        iconRender={loop}
                        blockNode={true}
                        treeData={treeData}
                        bodyStyle={{ height: offsetHeight - 110, overflow: 'scroll' }}
                        titleRender={(node) => (
                            <div style={{ width: '100%' }}>
                                <div style={{ float: 'left' }}>
                                    {node.icon} {node.title}
                                </div>
                                <div style={{ float: 'right', zIndex: 999 }}>
                                    <Space>
                                        <Permit authority="menu:saveOrUpdate" key="saveMenu">
                                            <Tooltip title="添加子菜单">
                                            <PlusOutlined
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddMenu(node);
                                                }}
                                            />
                                            </Tooltip>
                                        </Permit>
                                        <Permit authority="menu:saveOrUpdate" key="updateMenu">
                                            <Tooltip title="编辑菜单">
                                            <FormOutlined
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditMenu(node);
                                                }}
                                            />
                                            </Tooltip>
                                        </Permit>
                                        <Permit authority="menu:delete" key="deleteMenu">
                                            <Tooltip title="删除菜单">
                                            <DeleteOutlined
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    showDeleteConfirm('删除菜单前，请确认菜单中不包含子菜单和按钮，确定要删除该菜单吗？', () => handleDeleteMenu(node));
                                                }}
                                            />
                                            </Tooltip>
                                        </Permit>
                                    </Space>
                                </div>
                            </div>
                        )}
                        onSelect={(keys, { selected, node }) => {
                            if (selected) {
                                setSelectedMenuId(node.key);
                                setSelectedMenuName(node.text);
                            }
                        }}
                    />
                </Col>
                <Col span={18}>
                    {/* <ISearchForm
                        
                        form={searchForm}
                        onReset={() => ref.current.refresh()}
                        onSearch={() => ref.current.refresh()}
                        onHeightChange={(iheight) => setTableHight(iheight)}
                    >
                        <IFormItem name="id" label="按钮ID" xtype="input" />
                        <IFormItem name="buttonName" label="按钮名称" xtype="input" />
                        <IFormItem name="reqUrl" label="URL" xtype="input" />
                        <IFormItem name="permAction" label="权限标识" xtype="input" />
                    </ISearchForm> */}
                    <IAGrid
                        ref={ref}
                        title={<Space>按钮列表
                            {/* <span>按钮列表</span>
                            <Checkbox style={{ marginLeft: '20px' }} size='large' checked={searchChecked} onChange={onChangeSearch}>关联菜单</Checkbox>
                            <Input.Search size='small' onSearch={(value) => setTableSearchValue(value)} style={{ width: 250,height:30 }} type='text' key="tableSearch" placeholder='查询 ID/URL/按钮名称/权限标识'  /> */}
                        </Space>}
                        // components={{
                        //     tagCellRenderer: TagRenderer,
                        //     tagActionCellRenderer: TagActionRenderer,
                        //     lockRenderer: LockRenderer
                        // }}
                        gridName="perm_button_list"
                        columns={initColumns}
                        height={offsetHeight - 66}
                        request={(pageNo, pageSize) => search(pageNo, pageSize)}
                        dataSource={dataSource}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        total={total}
                        onSelectedChanged={onChange}
                        clearSelect={searchLoading}
                        onDoubleClick={(record) => handleAddButton(record)}
                        toolBarRender={[
                            <Checkbox size="small" style={{ marginTop: '-5px', marginRight: '5px' }} checked={searchChecked} onChange={onChangeSearch}><div style={{ marginTop: '8px', fontSize: 12 }}>关联菜单</div></Checkbox>,
                            <Input.Search
                                style={{ width: 250, marginRight: '5px' }}
                                onSearch={(value) => setTableSearchValue(value)}
                                size="small" key="columnSearch"
                                enterButton
                                placeholder='查询 ID/URL/按钮名称/权限标识' allowClear />,
                                <Permit authority="menu:saveOrUpdate" key="newMenu">
                                <Tooltip title="新建根菜单">
                                    <Button key="newMenu" size="small" icon={<FolderAddOutlined />} onClick={handleAddMenu}></Button>
                                </Tooltip>
                            </Permit>,
                                <Permit authority="menu:saveOrUpdateButton" key="copyButton">
                                <Tooltip title="复制新建菜单">
                                    <Button key="copyButton" icon={<DiffOutlined />} size="small" onClick={handleCopyButton}></Button>
                                </Tooltip>
                            </Permit>,
                                <Permit authority="menu:saveOrUpdateButton" key="newButton">
                                    <Tooltip title="新建按钮">
                                        <Button key="newButton" icon={<PlusSquareOutlined />} size="small" onClick={handleAddButton}></Button>
                                    </Tooltip>
                                </Permit>

                        ]}
                        pageToolBarRender={[
                            <Button danger key="delete" size="small" icon={<RestOutlined />} type='primary'
                                onClick={() => showDeleteConfirm('确定删除选中的按钮吗?', () => onDeleteButton(selectedKeys))}>
                                删除
                            </Button>
                        ]}
                    />
                    {/* {selectedKeys?.length > 0 && (
                        <IFooterToolbar>
                            <Button type="danger" key="delete"
                                onClick={() => showDeleteConfirm('确定删除选中的按钮吗?', () => onDeleteButton(selectedKeys))}>
                                删除
                            </Button>
                        </IFooterToolbar>
                    )} */}
                </Col>
            </Row>
        </>
    );
};
