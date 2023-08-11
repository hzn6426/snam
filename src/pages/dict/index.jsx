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
    IGrid,
    ISearchForm,
    IStatus,
    ITag,
    IModal,
    Permit,
    IFooterToolbar,
    ILayout,
} from '@/common/components';
// import IGrid from '@/components/IGrid';
// import ISearchForm from '@/components/ISearchForm';
// import IStatus from '@/components/IStatus';
// import ITag from '@/components/ITag';
// import IIF from '@/components/IIF';
// import Permit from '@/components/Permit';
import { showDeleteConfirm } from '@/common/antd';
import { Form, Button, Modal, message, Space } from 'antd';
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
import { PlusOutlined, LockTwoTone, UnlockTwoTone} from '@ant-design/icons';

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
        title: '状态',
        width: 80,
        dataIndex: 'state',
        cellRenderer: 'stateCellRenderer',
    },
    {
        title: '锁定',
        width: 70,
        dataIndex: 'beLock',
        cellRenderer:'lockRenderer'
    },
    {
        title: '字典编号',
        width: 160,
        align: 'center',
        dataIndex: 'dictCode',
    },
    {
        title: '字典名称',
        width: 100,
        align: 'center',
        dataIndex: 'dictName',
    },
    {
        title: '类型',
        width: 70,
        align: 'center',
        dataIndex: 'dictType',
        valueFormatter: (x) => dictType[x.value],
    },
    {
        title: '优先级',
        width: 70,
        align: 'center',
        dataIndex: 'priority',
    },
];

const childColumns = [
    {
        title: '状态',
        width: 80,
        dataIndex: 'state',
        cellRenderer: 'stateCellRenderer',
    },
    {
        title: '锁定',
        width: 90,
        dataIndex: 'beLock',
        cellRenderer:'lockRenderer'
    },
    {
        title: '父字典名称',
        width: 120,
        align: 'center',
        dataIndex: 'parentName',
    },
    {
        title: '字典编号',
        width: 160,
        align: 'center',
        dataIndex: 'dictCode',
    },
    {
        title: '字典名称',
        width: 100,
        align: 'center',
        dataIndex: 'dictName',
    },
    {
        title: '优先级',
        width: 70,
        align: 'center',
        dataIndex: 'priority',
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
    const refreshParent = () => parentRef.current.refresh();
    const refreshChild = (params) => childRef.current.refresh(params);

    const [onParentChange, selectedParentKeys, setSelectedParentKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap((v) => {
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
    const searchParent = (pageNo, pageSize) => {
        // setSelectedParentKeys([]);
        setSearchLoading(true);
        let param = { dto: searchParentForm.getFieldValue(), pageNo: pageNo, pageSize: pageSize };
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

    // 列表及弹窗
    return (
        <>
            <ISearchForm
                form={searchParentForm}
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
            </ISearchForm>
            <ILayout type="hbox" spans="12 12" gutter="8">
                <>
                    <IGrid
                        ref={parentRef}
                        title="父字典列表"
                        key="parent"
                        components={{
                            stateCellRenderer: StateRenderer,
                            lockRenderer: LockRenderer
                        }}
                        // columnsStorageKey="_cache_user_columns"
                        initColumns={parentColumns}
                        request={(pageNo, pageSize) => searchParent(pageNo, pageSize)}
                        dataSource={parentDataSource}
                        total={parentTotal}
                        onSelectedChanged={onParentChange}
                        onDoubleClick={(record) => onParentDoubleClick(record.id)}
                        toolBarRender={[
                            <Button
                                key="add"
                                size="small"
                                type="primary"
                                shape="round"
                                icon={<PlusOutlined />}
                                onClick={() => onParentNewClick()}
                            >
                                新建
                            </Button>,
                        ]}
                        clearSelect={searchLoading}
                    />
                    <IFooterToolbar
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
                    </IFooterToolbar>
                </>
                <>
                    <IGrid
                        ref={childRef}
                        title="子字典列表"
                        key="child"
                        components={{
                            stateCellRenderer: StateRenderer,
                            lockRenderer: LockRenderer
                        }}
                        // columnsStorageKey="_cache_user_columns"
                        initColumns={childColumns}
                        request={(pageNo, pageSize, params) => searchChild(pageNo, pageSize, params)}
                        dataSource={childDataSource}
                        total={childTotal}
                        onSelectedChanged={onChildChange}
                        onDoubleClick={(record) => onChildDoubleClick(record.id)}
                        toolBarRender={[
                            <Button
                                key="add"
                                size="small"
                                type="primary"
                                shape="round"
                                icon={<PlusOutlined />}
                                onClick={() => onChildNewClick()}
                            >
                                新建
                            </Button>,
                        ]}
                    />
                    <IFooterToolbar
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
                    </IFooterToolbar>
                </>
            </ILayout>
        </>
    );
};