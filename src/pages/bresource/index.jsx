import { IAGrid, ISearchTree, IStatus, Permit } from '@/common/components';
import {XSearchResource} from '@/common/componentx'
import { INewWindow, api, copyObject, forEach, isEmpty, pluck, constant, data2Option } from '@/common/utils';
import {
    AppstoreOutlined,
    AppstoreTwoTone,
    DeleteOutlined,
    DiffOutlined,
    FolderAddOutlined,
    FormOutlined,
    LockTwoTone,
    PlusOutlined,
    PlusSquareOutlined,
    RestOutlined,
    ProfileOutlined,
    UnlockTwoTone
} from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';

import { showDeleteConfirm } from '@/common/antd';
import {
    Button,
    Alert,
    Col,
    Form,
    Input,
    Row,
    Space,
    Tag,
    Tooltip,
    message,
    Splitter
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

const MethodRenderer = (props) => {
    if (props.value === 'POST') {
        return <Tag style={{width:60,textAlign:'center'}} color="#87d068">{props.value}</Tag>;
    } else if (props.value === 'GET') {
        return <Tag style={{width:60,textAlign:'center'}} color="#2db7f5">{props.value}</Tag>;
    } else if (props.value === 'PUT') {
        return <Tag style={{width:60,textAlign:'center'}} color="#f1982f">{props.value}</Tag>;
    } else if (props.value === 'DELETE') {
        return <Tag style={{width:60,textAlign:'center'}} color="#E8333c">{props.value}</Tag>;
    }
    return <Tag style={{width:60,textAlign:'center'}} color="#f50">-</Tag>;
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
        width: 90,
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
        headerName: '忽略登录权限',
        align: 'center',
        width: 100,
        field: 'beLoginUnauth',
        cellRenderer: TagRenderer
    },
    {
        headerName: '忽略资源权限',
        align: 'center',
        width: 100,
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
        cellRenderer: MethodRenderer
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

let resourceTypes = [];
api.dict.listChildByParentCode(constant.DICT_BUSINESS_RESOURCE_TYPE_TAG).subscribe({
    next: (data) => {
        resourceTypes = data2Option('dictCode', 'dictName', data);
    },
});

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
    const [treeResourceData, setTreeResourceData] = useState([]);
    // 选中的菜单ID
    const [selectedMenuId, setSelectedMenuId] = useState('bresource');
    // 选中的菜单名称
    const [selectedMenuName, setSelectedMenuName] = useState('业务资源');
    // 选中的资源ID
    const [selectedResourceId, setSelectedResourceId] = useState();
    // 选中的资源名称
    const [selectedResourceName, setSelectedResourceName] = useState();
    // 选中的资源类型
    const [selectedResourceType, setSelectedResourceType] = useState();
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
            // if (v.tag && v.tag === 'ADMIN') {
            //     objectAssign(v, {
            //         icon: <AppstoreTwoTone />,
            //     });
            // } else {
                objectAssign(v, { icon: <ProfileOutlined /> });
            // }
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


    //查询
    const loadAllResource = (menuId, resourceType) => {
        api.bresource.searchTreeAllResource(menuId, resourceType).subscribe({
            next: (data) => {
                setTreeResourceData(data);
            },
        });
    };


    //添加菜单
    const handleAddBResource = (node) => {
        const param = {
            id: '',
            name: '',
            parentId: node.key,
            parentName: node && node.text,
            resourceType:selectedResourceType,
            // menuType: node && node.menuType,
            reqMethod: 'GET',
            menuId:selectedMenuId
        };
        INewWindow({
            url: '/new/bresource/save',
            title: '新建资源',
            width: 700,
            height: 600,
            callback: () => {
                loadAllResource(selectedMenuId, selectedResourceType);
            },
            callparam: () => param,
        });
    };

    //编辑菜单
    const handleEditBResource = (node) => {
        const param = {
            id: node.key,
            parentId: node.parentId,
            resourceName: node.text,
            parentName: node.parentGroupName,
            resourceType:selectedResourceType,
            // icon: node.iconCls,
            ...node,
        };
        INewWindow({
            url: '/new/bresource/save',
            title: '编辑资源',
            width: 700,
            height: 600,
            callback: () => {
                loadAllResource(selectedMenuId, selectedResourceType);
            },
            callparam: () => param,
        });
    };
    // 删除菜单
    const handleDeleteResource = (node) => {
        const id = node.key;
        api.bresource.deleteResource([id]).subscribe({
            next: (data) => {
                loadAllResource(selectedMenuId, selectedResourceType);
            },
        })

    };

    // 查询button
    const search = (pageNo, pageSize) => {
        setSelectedKeys([]);
        setPageNo(pageNo);
        setPageSize(pageSize);
         if (!selectedResourceId) {
            return;
        }
        let param = { dto: {}, pageNo: pageNo, pageSize: pageSize };
        param.dto.resourceId = selectedResourceId;
        param.dto.keyword = tableSearchValue;
        return api.bresource.searchButtonsAndApiByMenu(param).subscribe({
            next: (data) => {
                setDataSource(data.data);
                setTotal(data.total);
            },
        }).add(() => {
            setSearchLoading(false);
        });
    };

    const handleAddButton = (button) => {
        if (!selectedResourceId) {
            message.error('请先选择一个资源！');
            return;
        }
        const param = {
            resourceId: selectedResourceId,
            name: selectedResourceName,
            resourceName: selectedResourceName,
        };
        if (button) {
            copyObject(param, button);
        }
        INewWindow({
            url: '/new/bresource/button',
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
        if (!selectedResourceId) {
            message.error('请先选择一个资源！');
            return;
        }
        if (selectedKeys.length !== 1) {
            message.error('请选择一条按钮数据！');
            return;
        }
        const button = selectedRecords[0];
        const param = {
            resourceId: selectedResourceId,
            name: selectedResourceName,
            resourceName: selectedResourceName,
            ...button,
        };
        param.id = '';
        INewWindow({
            url: '/new/bresource/button',
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
        api.bresource.deleteButton(selectedKeys).subscribe({
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
        if (selectedMenuId && selectedResourceType) {
            loadAllResource(selectedMenuId, selectedResourceType);
        }
    }, [selectedMenuId, selectedResourceType]);

    useEffect(() => {
        search(pageNo, pageSize, true);
    }, [selectedResourceId])

    useEffect(() => {
        search(pageNo, pageSize, searchChecked);
    }, [tableSearchValue])

    const { offsetHeight } = window.document.getElementsByClassName("cala-body")[0]; //获取容器高度
    // 列表及弹窗
    return (
        <>
            <Alert size="small" style={{ fontSize: 12, marginBottom: 5 }} message={"业务资源是对有多层级的资源，需要进行权限控制；比如文件夹、文件的层级控制，此时文件夹有功能按钮，文件也有功能按钮，文件夹又可嵌套。资源显示通过角色控制，数据显示通过资源授权控制！"} type="info" showIcon={true} />
            <Splitter style={{ height: offsetHeight - 70,  }}>
                <Splitter.Panel defaultSize="25%" min="20%" max="40%">
                    {/* <ISearchTree
                        iconRender={loop}
                        blockNode={true}
                        treeData={treeData}
                        bodyStyle={{ height: offsetHeight - 100, overflow: 'auto' }}
                        titleRender={(node) => (
                            <div style={{ width: '100%' }}>
                                <div style={{ float: 'left' }}>
                                    {node.icon} {node.title}
                                </div>
                            </div>
                        )}
                        onSelect={(keys, { selected, node }) => {
                            if (selected) {
                                setSelectedMenuId(node.key);
                                setSelectedMenuName(node.text);
                                
                            }
                        }}
                    /> */}
                    <XSearchResource
                            // style={{marginLeft:'3px'}}
                            selectData={resourceTypes}
                            iconRender={loop}
                            blockNode={true}
                            treeData={treeResourceData}
                            onSelectChange = {(value) => {
                                setSelectedResourceType(value);
                            }}
                            bodyStyle={{ height: offsetHeight - 145, overflow: 'auto', }}
                            titleRender={(node) => (
                                <div style={{ width: '100%' }}>
                                    <div style={{ float: 'left' }}>
                                        {node.icon} {node.title}
                                    </div>
                                    <div style={{ float: 'right', zIndex: 999 }}>
                                        <Space>
                                            <Permit authority="bresource:saveOrUpdate" key="saveBResource">
                                                <Tooltip title="添加子资源">
                                                <PlusOutlined
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddBResource(node);
                                                    }}
                                                />
                                                </Tooltip>
                                            </Permit>
                                            <Permit authority="bresource:saveOrUpdate" key="updateBResource">
                                                <Tooltip title="编辑资源">
                                                <FormOutlined
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditBResource(node);
                                                    }}
                                                />
                                                </Tooltip>
                                            </Permit>
                                            <Permit authority="bresource:delete" key="deleteBResource">
                                                <Tooltip title="删除资源">
                                                <DeleteOutlined
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        showDeleteConfirm('删除资源前，请确认资源中不包含子资源和按钮，确定要删除该资源吗？', () => handleDeleteResource(node));
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
                                    setSelectedResourceId(node.key);
                                    setSelectedResourceName(node.text);
                                    // setSearchChecked(true);
                                }
                            }}
                            />
                </Splitter.Panel>
                <Splitter.Panel defaultSize="80%" min="60%" max="85%">
                    <IAGrid
                        ref={ref}
                        title={<Space>按钮列表</Space>}
                        gridName="perm_button_list"
                        columns={initColumns}
                        height={offsetHeight - 106}
                        request={(pageNo, pageSize) => search(pageNo, pageSize)}
                        dataSource={dataSource}
                        pageNo={pageNo}
                        pageSize={pageSize}
                        total={total}
                        onSelectedChanged={onChange}
                        clearSelect={searchLoading}
                        onDoubleClick={(record) => handleAddButton(record)}
                        toolBarRender={[
                            // <Checkbox size="small" style={{ marginTop: '-5px', marginRight: '5px' }} checked={searchChecked} onChange={onChangeSearch}><div style={{ marginTop: '8px', fontSize: 12 }}>关联菜单</div></Checkbox>,
                            <Input.Search
                                style={{ width: 250, marginRight: '5px',height:'24px' }}
                                onSearch={(value) => setTableSearchValue(value)}
                                size="small" 
                                key="columnSearch"
                                enterButton
                                placeholder='查询 ID/URL/按钮名称/权限标识' allowClear />,
                                <Permit authority="bresource:saveOrUpdate" key="newBResource">
                                <Tooltip title="新建根资源">
                                    <Button key="newBResource" size="small" icon={<FolderAddOutlined />} onClick={handleAddBResource}></Button>
                                </Tooltip>
                            </Permit>,
                                <Permit authority="bresource:saveOrUpdateButton" key="copyButton">
                                    <Tooltip title="复制新建按钮">
                                    <Button key="copyButton" icon={<DiffOutlined />} size="small" onClick={handleCopyButton}></Button>
                                </Tooltip>
                            </Permit>,
                                <Permit authority="bresource:saveOrUpdateButton" key="newButton">
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
                </Splitter.Panel>
            </Splitter>
        </>
    );
};
