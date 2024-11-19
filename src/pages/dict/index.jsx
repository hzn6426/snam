import React, { useState, useRef, useEffect } from 'react';
import {
    api,
    dateFormat,
    constant,
    state2Option,
    data2Option,
    split,
    useObservableAutoCallback,
    useAutoObservable,
    useAutoObservableEvent,
    useObservableAutoState,
    pluck,
    isEmpty,
    beHasRowsPropNotEqual,
    isArray,
    join,
    INewWindow
} from '@/common/utils';
import {
    IFormItem,
    IAGrid,
    XSearchForm,
    IStatus,
    ITag,
    IModal,
    Permit,
    IFooterToolbar,
    ILayout,
    IButton,
    IGridSearch
} from '@/common/components';
// import IGrid from '@/components/IGrid';
// import ISearchForm from '@/components/ISearchForm';
// import IStatus from '@/components/IStatus';
// import ITag from '@/components/ITag';
// import IIF from '@/components/IIF';
// import Permit from '@/components/Permit';
import { showDeleteConfirm } from '@/common/antd';
import { Form, Button, Modal, message, Select, Input, Tooltip } from 'antd';
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
import {
    PlusOutlined, LockTwoTone, UnlockTwoTone, DiffOutlined, SunOutlined,
    ApiOutlined,
    RestOutlined,
} from '@ant-design/icons';

const dictType = { BUSINESS: '业务', SYSTEM: '系统' };

const userState = {
    ACTIVE: { text: '启用', status: 'Success' },
    STOPPED: { text: '停用', status: 'Default' },
};

const StateRenderer = (props) => {
    return props.value && <IStatus value={props.value} state={userState} />;
};
//组件
const LockRenderer = (props) => {
    return props.value ? (
      <LockTwoTone twoToneColor="#FF0000" />
    ) : (
      <UnlockTwoTone twoToneColor="#52c41a" />
    );
  };
//列初始化
const parentColumns = [
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
        field: 'state',
        cellRenderer: StateRenderer,
    },
    {
        headerName: '锁定',
        width: 70,
        field: 'beLock',
        cellRenderer: LockRenderer
    },
    {
        headerName: '字典编号',
        width: 160,
        align: 'left',
        field: 'dictCode',
    },
    {
        headerName: '字典名称',
        width: 100,
        align: 'left',
        field: 'dictName',
    },
    {
        headerName: '类型',
        width: 70,
        align: 'center',
        field: 'dictType',
        valueFormatter: (x) => dictType[x.value],
    },
    {
        headerName: '优先级',
        width: 70,
        align: 'center',
        field: 'priority',
    },
];

const childColumns = [
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
        field: 'state',
        cellRenderer: StateRenderer,
    },
    {
        headerName: '锁定',
        width: 90,
        field: 'beLock',
        cellRenderer: LockRenderer
    },
    {
        headerName: '父字典名称',
        width: 120,
        align: 'left',
        field: 'parentName',
    },
    {
        headerName: '字典编号',
        width: 160,
        align: 'left',
        field: 'dictCode',
    },
    {
        headerName: '字典名称',
        width: 100,
        align: 'left',
        field: 'dictName',
    },
    {
        headerName: '优先级',
        width: 70,
        align: 'center',
        field: 'priority',
    },
];

export default (props) => {
    const [searchParentForm] = Form.useForm();
    // const [selectedKeys, setSelectedKeys] = useState([]);
    const [parentDataSource, setParentDataSource] = useState([]);
    const [childDataSource, setChildDataSource] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [parentTotal, setParentTotal] = useState(0);
    const [childTotal, setChildTotal] = useState(0);

    const [parentName, setParentName] = useState('');

    const parentRef = useRef();
    const childRef = useRef();
    const [disabledActive, setDisabledActive] = useState(true);
    const [disabledStop, setDisabledStop] = useState(true);

    const [disabledChildActive, setDisabledChildActive] = useState(true);
    const [disabledChildStop, setDisabledChildStop] = useState(true);


    const refreshParent = () => parentRef.current.refresh();
    const refreshChild = (params) => childRef.current.refresh(params);

    const [onParentChange, selectedParentKeys, setSelectedParentKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            // debounceTime(300),
            distinctUntilChanged(),
            tap((v) => {
                setDisabledActive(beHasRowsPropNotEqual('state', 'STOPPED', v));
                setDisabledStop(beHasRowsPropNotEqual('state', 'ACTIVE', v));
                if (v && v.length > 0) {
                    const selected = v[v.length - 1]
                    setParentName(selected.dictName);
                }
            }),
            map((v) => {
                return pluck('id', v)
            }),
            tap((v) => refreshChild(v[v.length - 1])),
            shareReplay(1),
        )
    );


    const [onChildChange, selectedChildKeys, setSelectedChildKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap((keys) => {
                setDisabledChildActive(beHasRowsPropNotEqual('state', 'STOPPED', keys));
                setDisabledChildStop(beHasRowsPropNotEqual('state', 'ACTIVE', keys));
            }),
            switchMap((v) => of(pluck('id', v))),
        ),
    );

    const [onParentUse] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            switchMap((keys) => api.dict.useDictionary(keys)),
            tap(() => {
                message.success('操作成功!');
                refreshParent();
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    const [onParentStop] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            switchMap((keys) => api.dict.stopDictionary(keys)),
            tap(() => {
                message.success('操作成功!');
                refreshParent();
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    const [onParentDelete] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            switchMap((keys) => api.dict.deleteDictionary(keys).pipe(map(() => keys[keys.length - 1]))),
            tap((pid) => {
                message.success('操作成功!');
                refreshParent();
                refreshChild(pid);
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    const [onChildUse] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            switchMap(([keys, parentId]) => api.dict.useChildDictionary(keys).pipe(map(() => parentId))),
            tap((parentId) => {
                message.success('操作成功!');
                refreshChild(parentId);
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    const [onChildStop] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            switchMap(([keys, parentId]) => api.dict.stopChildDictionary(keys).pipe(map(() => parentId))),
            tap((parentId) => {
                message.success('操作成功!');
                refreshChild(parentId);
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    const [onChildDelete] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            switchMap(([keys, parentId]) => api.dict.deleteChildDictionary(keys).pipe(map(() => parentId))),
            tap((parentId) => {
                message.success('操作成功!');
                refreshChild(parentId);
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    //查询
    const searchParent = (pageNo, pageSize, params) => {
        // setSelectedParentKeys([]);
        setSearchLoading(true);
        let param = { dto: params || {}, pageNo: pageNo, pageSize: pageSize };
        api.dict.searchDictionary(param).subscribe({
            next: (data) => {
                setParentDataSource(data.data);
                setParentTotal(data.total);
            },
        }).add(() => {
            setSearchLoading(false);
        });
    };

    //查询
    const searchChild = (pageNo, pageSize, parentId) => {
        setSelectedChildKeys([]);
        if (!parentId) return;
        let dto = { parentId: parentId }
        let param = { dto: dto, pageNo: pageNo, pageSize: pageSize };
        return api.dict.searchChildDictionary(param).subscribe({
            next: (data) => {
                setChildDataSource(data.data);
                setChildTotal(data.total);
            },
        }).add(() => {
        });
    };



    const onParentNewClick = () => {
        INewWindow({
            url: '/new/dict/ADD',
            title: '新建字典',
            width: 600,
            height: 300,
            callback: () => refreshParent()
        })
    };

    const [onParentDoubleClick] = useAutoObservableEvent([
        tap((id) => INewWindow({
            url: '/new/dict/' + id,
            title: '编辑字典',
            width: 600,
            height: 300,
            callback: () => refreshParent()
        })),
    ]);

    const onChildNewClick = () => {
        if (isEmpty(selectedParentKeys)) {
            message.error("请先选择父字典!");
            return;
        }
        const pid = selectedParentKeys[selectedParentKeys.length - 1];
        INewWindow({
            url: '/new/dictChild/ADD?parentId=' + pid + '&parentName=' + parentName,
            title: '新建子字典',
            width: 600,
            height: 300,
            callback: () => refreshChild(pid)
        })
    };

    const [onChildDoubleClick] = useAutoObservableEvent([
        tap((id) => {

            INewWindow({
                url: '/new/dictChild/' + id,
                title: '编辑子字典',
                width: 600,
                height: 300,
                callback: () => refreshChild()
            })
        }),
    ]);

    const { offsetHeight } = window.document.getElementsByClassName("cala-body")[0]; //获取容器高度

    // 列表及弹窗
    return (
        <>
            {/* <XSearchForm
                form={searchParentForm}
                rows={1}
                onReset={() => parentRef.current.refresh()}
                onSearch={() => parentRef.current.refresh()}
            >
                <IFormItem name="dictCode" label="字典编码" xtype="input" />
                <IFormItem name="dictName" label="字典名称" xtype="input" />
                <IFormItem
                    name="state"
                    label="状态"
                    xtype="select"
                    options={() => state2Option(userState)}
                />
                <IFormItem name="childDictCode" label="子编码" xtype="input" />
                <IFormItem name="childdictName" label="子名称" xtype="input" />
            </XSearchForm> */}
            <ILayout type="hbox" spans="12 12" gutter="0">
                <>
                    <IAGrid
                        ref={parentRef}
                        title="父字典列表"
                        key="parent"
                        height={offsetHeight - 66}
                        // components={{
                        //     stateCellRenderer: StateRenderer,
                        //     lockRenderer: LockRenderer
                        // }}
                        // columnsStorageKey="_cache_user_columns"
                        columns={parentColumns}
                        request={(pageNo, pageSize) => searchParent(pageNo, pageSize)}
                        dataSource={parentDataSource}
                        total={parentTotal}
                        onSelectedChanged={onParentChange}
                        onDoubleClick={(record) => onParentDoubleClick(record.id)}
                        toolBarRender={[
                            <IGridSearch defaultValue={'dictName'} size="small" style={{ width: 100 }} onSearch={(params) => searchParent(1, pageSize, params)}
                                options={[{ label: '字典名称', value: 'dictName' }, { label: '字典编码', value: 'dictCode' }
                                ]} />,
                            <Permit key="dictionary:save" authority="dictionary:save">
                                <Tooltip title="新建字典">
                            <Button
                                key="add"
                                size="small"
                                        icon={<DiffOutlined />}
                                onClick={() => onParentNewClick()}
                                    >
                            </Button>
                                </Tooltip>
                            </Permit>,
                        ]}
                        pageToolBarRender={[
                            <Permit authority="dictionary:use">
                                <IButton type="warning" size="small" disabled={disabledActive}
                                    icon={<SunOutlined />} key="use" onClick={() => onParentUse(selectedParentKeys)} loading={loading}>
                                    启用
                                </IButton>
                            </Permit>,
                            <Permit authority="dictionary:stop">
                                <IButton icon={< ApiOutlined />} size="small" disabled={disabledStop}
                                    type="warning" key="stop" onClick={() => onParentStop(selectedParentKeys)} loading={loading}>
                                    停用
                                </IButton>
                            </Permit>,
                            <Permit authority="dictionary:delete">
                                <IButton danger
                                    type="primary" size="small"
                                    icon={<RestOutlined />} key="delete" onClick={() => showDeleteConfirm('父字典删除后,子字典也将被删除,确定删除选中的字典吗?', () => onParentDelete(selectedParentKeys))} loading={loading}>
                                    删除
                                </IButton>
                            </Permit>
                        ]}
                        clearSelect={searchLoading}
                    />
                    {/* <IFooterToolbar
                        visible={!isEmpty(selectedParentKeys)}
                        style={{
                            right: 'calc(45% - 12px)',
                        }}>
                        <Space>
                            <Permit authority="dictionary:use">
                                <Button key="use" onClick={() => onParentUse(selectedParentKeys)} loading={loading}>
                                    启用
                                </Button>
                            </Permit>
                            <Permit authority="dictionary:stop">
                                <Button danger key="stop" onClick={() => onParentStop(selectedParentKeys)} loading={loading}>
                                    停用
                                </Button>
                            </Permit>
                            <Permit authority="dictionary:delete">
                                <Button type="danger" key="delete" onClick={() => showDeleteConfirm('父字典删除后,子字典也将被删除,确定删除选中的字典吗?', () => onParentDelete(selectedParentKeys))} loading={loading}>
                                    删除
                                </Button>
                            </Permit>
                        </Space>
                    </IFooterToolbar> */}
                </>
                <>
                    <IAGrid
                        ref={childRef}
                        title="子字典列表"
                        key="child"
                        height={offsetHeight - 66}
                        // components={{
                        //     stateCellRenderer: StateRenderer,
                        //     lockRenderer: LockRenderer
                        // }}
                        // columnsStorageKey="_cache_user_columns"
                        columns={childColumns}
                        request={(pageNo, pageSize, params) => searchChild(pageNo, pageSize, params)}
                        dataSource={childDataSource}
                        total={childTotal}
                        onSelectedChanged={onChildChange}
                        onDoubleClick={(record) => onChildDoubleClick(record.id)}
                        toolBarRender={[
                            // <Select defaultValue={'childdictName'} size="small" style={{ width: 100 }}
                            //     options={[{ label: '字典名称', value: 'childdictName' }, { label: '字典编码', value: 'childDictCode' }
                            //     ]} />,
                            // <Input.Search
                            //     style={{ width: 150, marginRight: '5px' }}
                            //     onSearch={(value) => { }}
                            //     size="small" key="columnSearch"
                            //     enterButton
                            //     placeholder='搜索' allowClear />,
                            <Permit key="dictChild:save" authority="dictChild:save">
                                <Tooltip title="新建子字典">
                            <Button
                                key="add"
                                size="small"
                                        icon={<DiffOutlined />}
                                onClick={() => onChildNewClick()}
                            >

                            </Button>
                                </Tooltip>
                            </Permit>,
                        ]}
                        pageToolBarRender={[
                            <Permit authority="dictChild:use">
                                <IButton key="use"
                                    size="small"
                                    type="warning"
                                    icon={<SunOutlined />}
                                    disabled={disabledChildActive}
                                    onClick={() => {
                                        const parentId = selectedParentKeys[selectedParentKeys.length - 1];
                                        onChildUse([selectedChildKeys, parentId]);
                                    }}
                                    loading={loading}>
                                    启用
                                </IButton>
                            </Permit>,
                            <Permit authority="dictChild:stop">
                                <IButton danger key="stop"
                                    icon={< ApiOutlined />}
                                    type="warning"
                                    size="small"
                                    disabled={disabledChildStop}
                                    onClick={() => {
                                        const parentId = selectedParentKeys[selectedParentKeys.length - 1];
                                        onChildStop([selectedChildKeys, parentId]);
                                    }}
                                    loading={loading}>
                                    停用
                                </IButton>
                            </Permit>,
                            <Permit authority="dictChild:delete">
                                <IButton danger
                                    type="primary"
                                    size="small"
                                    icon={<RestOutlined />}
                                    key="delete" onClick={() => {

                                    const parentId = selectedParentKeys[selectedParentKeys.length - 1];
                                    showDeleteConfirm('确定删除选中的子字典吗?', () => onChildDelete([selectedChildKeys, parentId]));
                                }}>
                                    删除
                                </IButton>
                            </Permit>
                        ]}
                    />
                    {/* <IFooterToolbar
                        visible={!isEmpty(selectedChildKeys)}
                        style={{
                            left: 'calc(55% + 22px)',
                            width: 'calc(45% - 32px)',
                        }}>
                        <Space>
                            <Permit authority="dictChild:use">
                                <Button key="use"
                                    onClick={() => {
                                        const parentId = selectedParentKeys[selectedParentKeys.length - 1];
                                        onChildUse([selectedChildKeys, parentId]);
                                    }}
                                    loading={loading}>
                                    启用
                                </Button>
                            </Permit>
                            <Permit authority="dictChild:stop">
                                <Button danger key="stop"
                                    onClick={() => {
                                        const parentId = selectedParentKeys[selectedParentKeys.length - 1];
                                        onChildStop([selectedChildKeys, parentId]);
                                    }}
                                    loading={loading}>
                                    停用
                                </Button>
                            </Permit>
                            <Permit authority="dictChild:delete">
                                <Button type="danger" key="delete" onClick={() => {

                                    const parentId = selectedParentKeys[selectedParentKeys.length - 1];
                                    showDeleteConfirm('确定删除选中的子字典吗?', () => onChildDelete([selectedChildKeys, parentId]));
                                }}>
                                    删除
                                </Button>
                            </Permit>
                        </Space>
                    </IFooterToolbar> */}
                </>
            </ILayout>
        </>
    );
};