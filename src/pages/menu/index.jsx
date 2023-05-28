import { IFooterToolbar, IGrid, ISearchTree, IStatus, Permit } from '@/common/components';
import { INewWindow, api, forEach, isEmpty, pluck, useObservableAutoCallback } from '@/common/utils';
import {
    AppstoreOutlined,
    AppstoreTwoTone,
    DeleteOutlined,
    FormOutlined,
    PlusOutlined
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
    message
} from 'antd';
import objectAssign from 'object-assign';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, shareReplay, switchMap } from 'rxjs/operators';


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
        cellRenderer: 'tagCellRenderer'
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
        title: '权限标识',
        align: 'left',
        width: 140,
        dataIndex: 'permAction',
        // cellRenderer: 'tagActionCellRenderer',
    },
    {
        title: '权限引用',
        align: 'left',
        width: 100,
        dataIndex: 'actionRef',
    },
    {
        title: '备注',
        align: 'center',
        width: 100,
        dataIndex: 'note',
    },

];

export default (props) => {
    const { Search } = Input;
    const ref = useRef();
    const [searchForm] = Form.useForm();
    const [dataSource, setDataSource] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);

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



    const [onChange, selectedKeys, setSelectedKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((v) => {
                setSelectedRecords(v);
                return of(pluck('id', v))
            }),
            shareReplay(1),
        ),
    );


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
            parent: node.id,
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
            parent: node.parent,
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
        const id = node.id;
        api.menu.deleteMenu([id]).subscribe({
            next: (data) => {
                loadAllMenu();
            },
        })

    };

    // 查询button
    const search = (pageNo, pageSize) => {
        setSelectedKeys([]);
        let param = { dto: {}, pageNo: pageNo, pageSize: pageSize };
        param.dto.menuId = selectedMenuId;
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
            ...button,
        };
        INewWindow({
            url: '/new/menu/button',
            title: '新建按钮',
            width: 700,
            height: 600,
            callback: () => {
                loadAllMenu();
                search(pageNo, pageSize);
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
        button.id = '';
        const param = {
            menuId: selectedMenuId,
            name: selectedMenuName,
            menuName: selectedMenuName,
            ...button,
        };
        INewWindow({
            url: '/new/menu/button',
            title: '复制新建按钮',
            width: 700,
            height: 600,
            callback: () => {
                loadAllMenu();
                search(pageNo, pageSize);
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
                search(pageNo, pageSize);
            }
        }).add(() => setLoading(false))
    };

    useEffect(() => {
        loadAllMenu();
    }, []);

    useEffect(() => {
        search(pageNo, pageSize);
    }, [selectedMenuId])


    // 列表及弹窗
    return (
        <>
            <Row gutter={12}>
                <Col span={7}>
                    <ISearchTree
                        iconRender={loop}
                        blockNode={true}
                        treeData={treeData}
                        titleRender={(node) => (
                            <div style={{ width: '100%' }}>
                                <div style={{ float: 'left' }}>
                                    {node.icon} {node.title}
                                </div>
                                <div style={{ float: 'right', zIndex: 999 }}>
                                    <Space>
                                        <Permit authority="menu:saveOrUpdate" key="saveMenu">
                                            <PlusOutlined
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddMenu(node);
                                                }}
                                            />
                                        </Permit>
                                        <Permit authority="menu:saveOrUpdate" key="updateMenu">
                                            <FormOutlined
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditMenu(node);
                                                }}
                                            />
                                        </Permit>
                                        <Permit authority="menu:delete" key="deleteMenu">
                                            <DeleteOutlined
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    showDeleteConfirm('删除菜单前，请确认菜单中不包含子菜单和按钮，确定要删除该菜单吗？', () => handleDeleteMenu(node));
                                                }}
                                            />
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
                <Col span={17}>
                    <IGrid
                        ref={ref}
                        title="按钮列表"
                        components={{
                            tagCellRenderer: TagRenderer,
                            tagActionCellRenderer: TagActionRenderer,
                        }}
                        initColumns={initColumns}
                        request={(pageNo, pageSize) => search(pageNo, pageSize)}
                        dataSource={dataSource}
                        total={total}
                        onSelectedChanged={onChange}
                        clearSelect={searchLoading}
                        onDoubleClick={(record) => handleAddButton(record)}
                        toolBarRender={[
                            <Space key="space">
                                <Permit authority="menu:saveOrUpdate" key="newMenu">
                                    <Button key="newMenu" type="danger" size="small" onClick={handleAddMenu}>新建根菜单</Button>
                                </Permit>
                                <Permit authority="menu:saveOrUpdateButton" key="copyButton">
                                    <Button key="copyButton" type="warn" size="small" onClick={handleCopyButton}>复制新建</Button>
                                </Permit>
                                <Permit authority="menu:saveOrUpdateButton" key="newButton">
                                    <Button key="newButton" type="primary" size="small" onClick={handleAddButton}>新建按钮</Button>
                                </Permit>
                            </Space>
                        ]}
                    />
                    {selectedKeys?.length > 0 && (
                        <IFooterToolbar>
                            <Button type="danger" key="delete"
                                onClick={() => showDeleteConfirm('确定删除选中的用户吗?', () => onDeleteButton(selectedKeys))}>
                                删除
                            </Button>
                        </IFooterToolbar>
                    )}
                </Col>
            </Row>
        </>
    );
};
