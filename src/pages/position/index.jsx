import React, { useState, useRef, useEffect } from 'react';
import {
    api,
    forEach,
    mapObjIndexed,
    groupBy,
    includes,
    constant,
    state2Option,
    data2Option,
    split,
    useObservableAutoCallback,
    useAutoObservableEvent,
    useObservableAutoState,
    pluck,
    isEmpty,
    beHasRowsPropNotEqual,
    isArray,
    join,
    INewWindow,
    copyObject,
    data2TextObject,
    data2States,
} from '@/common/utils';
import { showDeleteConfirm, showOperationConfirm } from '@/common/antd';
import { Col, Form, Input, Row, Card, Tree, Checkbox, Space, Button, message, Tag } from 'antd';
import {
    IFormItem,
    IGrid,
    ISearchForm,
    IStatus,
    ITag,
    IModal,
    Permit,
    IFooterToolbar,
    ISearchTree,
    ILayout,
    IFieldset,
} from '@/common/components';
import {
    SolutionOutlined,
    ApartmentOutlined,
} from '@ant-design/icons';
import {
    concatMap,
    debounceTime,
    distinctUntilChanged,
    exhaustMap,
    filter,
    map,
    mergeMap,
    shareReplay,
    switchMap,
    tap,
    withLatestFrom,
} from 'rxjs/operators';
import { of, zip, EMPTY, from } from 'rxjs';

const positionState = {
    UNACTIVE: { text: '未激活', status: 'Warning' },
    ACTIVE: { text: '启用', status: 'Success' },
};

const StateRenderer = (props) => {
    return props.value && <IStatus value={props.value} state={positionState} />;
};
const TagRenderer = (props) => {
    if (props.value === true) {
        return <Tag color="#f50">是</Tag>;
    }
    return <Tag color="#2db7f5">否</Tag>;
}
let permScope = {};
api.dict.listChildByParentCode(constant.DICT_POSITION_PERM_SCOPE_TAG).subscribe({
    next: (data) => {
        permScope = data2TextObject('dictCode', 'dictName', data);
    }
});

export default () => {

    // 分配用户窗口中树的数据
    const [treeData, setTreeData] = useState([]);
    // 选中的组织ID
    const [selectedGroupId, setSelectedGroupId] = useState();
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [dataSource, setDataSource] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [disabledActive, setDisabledActive] = useState(true);
    const [disabledStop, setDisabledStop] = useState(true);

    //列初始化
    const initColumns = [
        {
            title: '状态',
            width: 80,
            dataIndex: 'state',
            cellRenderer: 'stateCellRenderer',
        },
        {
            title: '职位名称',
            width: 100,
            dataIndex: 'postName',
        },
        {
            title: '权限范围',
            width: 160,
            dataIndex: 'permScope',
            valueFormatter: (x) => permScope[x.value],
        },
        {
            title: '是否主管',
            width: 100,
            dataIndex: 'beManager',
            cellRenderer: 'tagCellRenderer',
        },
        {
            title: '备注',
            width: 160,
            align: 'left',
            dataIndex: 'note',
        },
    ];


    const [onChange, selectedKeys, setSelectedKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap((keys) => {
                setDisabledActive(beHasRowsPropNotEqual('state', 'UNACTIVE', keys));
                setDisabledStop(beHasRowsPropNotEqual('state', 'ACTIVE', keys));
            }),
            switchMap((v) => of(pluck('id', v))),
            shareReplay(1),
        ),
    );

    // 将组织设置为不可选
    const loopGroup = (data) => {
        forEach((v) => {
            if (v.tag === 'POSITION') {
                copyObject(v, {
                    selectable: false,
                    //disableCheckbox: true,
                    icon: <SolutionOutlined style={{ color: '#eb2f96' }} />,
                });
            } else {
                // 节点是组织不允许修改
                copyObject(v, { icon: <ApartmentOutlined /> });
            }
            if (v.children && !isEmpty(v.children)) {
                loopGroup(v.children);
            }
        }, data);
    };

    const onNewClick = () => {
        if (!selectedGroupId || selectedGroupId === constant.ROOT_OF_GROUP) {
            message.error('请先选择一个部门或者公司!');
            return;
        }
        const param = { orgId: selectedGroupId };
        INewWindow({
            url: '/new/position/ADD',
            title: '新建职位',
            width: 700,
            height: 600,
            callback: () => {
                loadGroup();
                searchPositionByGroup(pageNo, pageSize);
            },
            callparam: () => param
        });
    };

    // 双击用户 显示详情
    const onDoubleClick = (record) => {
        INewWindow({
            url: '/new/position/' + record.id,
            title: '编辑职位',
            width: 700,
            height: 600,
            callback: () => {
                loadGroup();
                searchPositionByGroup(pageNo, pageSize);
            },
            callparam: () => { orgId: selectedGroupId }
        });
    }

    //启用
    const handleUse = () => {
        api.position.use(selectedKeys).subscribe({
            next: (data) => {
                message.success('操作成功!');
                searchPositionByGroup(pageNo, pageSize);
            }
        });
    }

    //停用
    const handleStop = () => {
        api.position.stop(selectedKeys).subscribe({
            next: (data) => {
                message.success('操作成功!');
                searchPositionByGroup(pageNo, pageSize);
            }
        });
    }

    //删除
    const handleDelete = () => {
        api.position.deletePosition(selectedKeys).subscribe({
            next: () => {
                message.success('操作成功!');
                loadGroup();
                searchPositionByGroup(pageNo, pageSize);
            }
        });
    }

    //分配角色
    const handleAssignRoles = () => {
        if (selectedKeys.length !== 1) {
            message.error('只能选择一条职位数据');
            return;
        }
        const pid = selectedKeys[0];
        api.role.listByPosition(pid).subscribe({
            next: (data) => {
                const arr = [];
                forEach((v) => {
                    arr.push(v.id);
                }, data);
                const param = { positionId: pid, roleIds: arr };
                INewWindow({
                    url: '/new/position/role',
                    title: '新建职位',
                    width: 600,
                    height: 300,
                    callback: () => {
                        loadGroup();
                        searchPositionByGroup(pageNo, pageSize);
                    },
                    callparam: () => param,
                });
            }
        });
    }

    //根据组织查询职位
    const searchPositionByGroup = (pageNo, pageSize) => {
        setSelectedKeys([]);
        setSearchLoading(true);
        let param = { dto: {}, pageNo: pageNo, pageSize: pageSize };
        param.dto.orgId = selectedGroupId;
        api.position.searchPosition(param).subscribe({
            next: (data) => {
                setDataSource(data.data);
                setTotal(data.total);
            },
        }).add(() => {
            setSearchLoading(false);
        });
    }

    //加载组织及职位信息
    const loadGroup = () => {
        api.group.treeAllGroupsAndPositions().subscribe({
            next: (data) => {
                setTreeData(data);
            }
        });
    }

    useEffect(() => {
        loadGroup();
    }, []);

    useEffect(() => {
        searchPositionByGroup(pageNo, pageSize);
    }, [selectedGroupId]);

    return (
        <Row gutter={5}>
            <Col span={7}>
                <ISearchTree
                    iconRender={loopGroup}
                    treeData={treeData}
                    placeholder="输入组织或职位进行搜索"
                    checkable={false}
                    blockNode={true}
                    onSelect={(keys, { selected }) => {
                        if (selected) {
                            setSelectedGroupId(keys[0]);
                            searchPositionByGroup(pageNo, pageSize);
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
            </Col>
            <Col span={17}>
                <IGrid
                    title="职位列表"
                    initColumns={initColumns}
                    components={{
                        stateCellRenderer: StateRenderer,
                        tagCellRenderer: TagRenderer,
                    }}
                    request={(pageNo, pageSize) => searchPositionByGroup(pageNo, pageSize)}
                    dataSource={dataSource}
                    total={total}
                    onSelectedChanged={onChange}
                    clearSelect={searchLoading}
                    pageNo={pageNo}
                    pageSize={pageSize}
                    onDoubleClick={(record) => onDoubleClick(record)}
                    toolBarRender={[
                        <Permit authority="position:save" key="new">
                            <Button
                                size='small'
                                type="primary"
                                onClick={onNewClick}
                            >
                                添加
                            </Button>
                        </Permit>
                    ]}
                />
                {selectedKeys?.length > 0 && (
                    <IFooterToolbar>
                        <Permit authority="position:use">
                            <Button key="use" onClick={handleUse} disabled={disabledActive}>
                                启用
                            </Button>
                        </Permit>
                        <Permit authority="position:stop">
                            <Button danger key="stop" onClick={handleStop} disabled={disabledStop}>
                                停用
                            </Button>
                        </Permit>
                        <Permit authority="position:delete">
                            <Button type="danger" key="delete" onClick={() => showDeleteConfirm('删除职位后,对应的权限将失效, 确定要删除选中职位吗？', () => handleDelete())}>
                                删除
                            </Button>
                        </Permit>
                        <Permit authority="position:savePositionRole">
                            <Button type="danger" key="assign" onClick={handleAssignRoles}>
                                分配角色
                            </Button>
                        </Permit>
                    </IFooterToolbar>
                )}
            </Col>
        </Row>

    )
}