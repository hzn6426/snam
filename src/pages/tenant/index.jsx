import { showDeleteConfirm } from '@/common/antd';
import {
    IFooterToolbar,
    IFormItem,
    IAGrid,
    XSearchForm,
    IStatus,
    Permit
} from '@/common/components';
import {
    INewWindow,
    dateFormat,
    api,
    beHasRowsPropNotEqual,
    isEmpty,
    pluck,
    state2Option,
    useAutoObservableEvent,
    useObservableAutoCallback,
    formatNumber
} from '@/common/utils';
import {
    PlusOutlined,
    LockTwoTone,
    UnlockTwoTone,
    CloudSyncOutlined,
    SyncOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { Button, Form, Space, message, Spin, Tag } from 'antd';
import { useRef, useState } from 'react';
import { of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    shareReplay,
    switchMap,
    tap
} from 'rxjs/operators';

const tenantState = {
    LOCKED: { text: '锁定', status: 'Warning' },
    ACTIVE: { text: '启用', status: 'Success' },
};


const StateRenderer = (props) => {
    return props.value && <IStatus value={props.value} state={tenantState} />;
};
//组件
const LockRenderer = (props) => {
    return props.value ? (
        <LockTwoTone twoToneColor="#FF0000" />
    ) : (
        <UnlockTwoTone twoToneColor="#52c41a" />
    );
};

const TagRenderer = (props) => {
    if (props.value === true) {
        return <Tag color="#f50">是</Tag>;
    }
    return <Tag color="#2db7f5">否</Tag>;
}

//列初始化
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
        headerName: '状态',
        width: 80,
        field: 'state',
        cellRenderer: StateRenderer,
    },
    {
        headerName: '租户简称',
        width: 100,
        field: 'simpleName',
    },
    {
        headerName: '租户全称',
        width: 160,
        field: 'name',
    },
    {
        headerName: '账户余额',
        width: 80,
        field: 'balance',
        valueFormatter: (params) => {
            return params.value && formatNumber(params.value, 2);
        },
    },
    {
        headerName: '标识',
        width: 80,
        field: 'root',
    },
    {
        headerName: '联系方式',
        width: 110,
        field: 'phone',
    },
    {
        headerName: '地址',
        width: 130,
        field: 'address',
    },
    {
        headerName: '业务ID',
        width: 160,
        field: 'businessId',
    },
    {
        headerName: '初始化账号',
        width: 100,
        field: 'beHaveSuper',
        cellRenderer: TagRenderer
    },
    {
        headerName: '备注',
        width: 100,
        field: 'note',
    },
    {
        headerName: '创建人',
        width: 100,
        field: 'createUserCnName',
    },
    {
        headerName: '创建时间',
        width: 150,
        field: 'createTime',
        valueFormatter: (x) => dateFormat(x.value, 'yyyy-MM-dd hh:mm:ss'),
    }
];

export default (props) => {
    const [searchForm] = Form.useForm();
    // const [selectedKeys, setSelectedKeys] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const [disabledLock, setDisabledLock] = useState(true);
    const [disabledUnlock, setDisableUnlock] = useState(true);


    const ref = useRef();
    const refresh = () => ref.current.refresh();

    const [onChange, selectedKeys, setSelectedKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap((keys) => {
                setDisabledLock(beHasRowsPropNotEqual('state', 'ACTIVE', keys));
                setDisableUnlock(beHasRowsPropNotEqual('state', 'LOCKED', keys));
                // return keys;
            }),
            switchMap((v) => of(pluck('id', v))),
            shareReplay(1),
        ),
    );

    const onNewClick = () => {
        INewWindow({
            url: '/new/tenant/ADD',
            title: '新建租户',
            width: 600,
            height: 400,
            callback: () => refresh()
        })
    };

    const [onDoubleClick] = useAutoObservableEvent([
        tap((id) => INewWindow({
            url: '/new/tenant/' + id,
            title: '编辑租户',
            width: 600,
            height: 400,
            callback: () => refresh()
        })),
    ]);

    const [onFunctionClick] = useAutoObservableEvent([
        tap((id) => INewWindow({
            url: '/new/tenant/function/' + id,
            title: '接口管理',
            width: 900,
            height: 600,
            callback: () => { }
        })),
    ]);

    const [onLock] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            filter((keys) => !isEmpty(keys)),
            switchMap((keys) => api.tenant.lock(keys)),
            tap(() => {
                message.success('操作成功!');
                refresh();
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    const [onUnlock] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            filter((keys) => !isEmpty(keys)),
            switchMap((keys) => api.tenant.unlock(keys)),
            tap(() => {
                message.success('操作成功!');
                refresh();
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    const [handleInitSUser] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            switchMap((key) => api.tenant.doInitSUser({ tenantId: key})),
            tap(() => {
                message.success('操作成功!');
                refresh();
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    const onChargeClick = (id) => {
        if (selectedKeys.length !== 1) {
            message.error('只能选择一条用户数据！');
            return;
        }
        INewWindow({
            url: '/new/tenant/charge/' + id,
            title: '余额充值',
            width: 500,
            height: 250,
            callback: () => refresh()
        });
    }

    const onBillClick = (id) => {
        if (selectedKeys.length !== 1) {
            message.error('只能选择一条用户数据！');
            return;
        }
        INewWindow({
            url: '/new/tenant/bill/' + id,
            title: '账单查看',
            width: 900,
            height: 600,
            // callback: () => refresh()
        });
    }

    const onResourceClick = (id) => {
        if (selectedKeys.length !== 1) {
            message.error('只能选择一条用户组数据！');
            return;
        }
        INewWindow({
            url: '/new/tenant/resource/' + id,
            title: '租户授权',
            width: 1000,
            height: 700,
            callback: () => refresh()
        });
    }

    //查询
    const search = (pageNo, pageSize) => {
        setSelectedKeys([]);
        setSearchLoading(true);
        let param = { dto: searchForm.getFieldValue(), pageNo: pageNo, pageSize: pageSize };
        api.tenant.searchTenant(param).subscribe({
            next: (data) => {
                setDataSource(data.data);
                setTotal(data.total);
            },
        }).add(() => {
            setSearchLoading(false);
        });
    };

    const { offsetHeight } = window.document.getElementsByClassName("cala-body")[0]; //获取容器高度


    // 列表及弹窗
    return (
        <>
            <Spin spinning={searchLoading}>
                <XSearchForm
                    form={searchForm}
                    onReset={() => ref.current.refresh()}
                    rows={1}
                    onSearch={(params) => {
                        search(1, 50, params);
                    }}
                >
                    <IFormItem
                        name="name"
                        label="租户名称"
                        xtype="input"
                    />
                    <IFormItem
                        name="state"
                        label="状态"
                        xtype="select"
                        options={() => state2Option(tenantState)}
                    />
                </XSearchForm>

                <IAGrid
                    gridName="businessTenant_List"
                    ref={ref}
                    title="租户列表"
                    columns={initColumns}
                    height={offsetHeight - 150}
                    defaultSearch={true}
                    request={(pageNo, pageSize) => search(pageNo, pageSize)}
                    dataSource={dataSource}
                    // pageNo={pageNo}
                    // pageSize={pageSize}
                    total={total}
                    onSelectedChanged={onChange}
                    onDoubleClick={(record) => onDoubleClick(record.id)}
                    toolBarRender={[
                        <Space key="space">
                            <Permit key="tenant:save" authority="tenant:save">
                                <Button
                                    key="add"
                                    size="small"
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => onNewClick()}
                                >
                                    新建
                                </Button>
                            </Permit>
                        </Space>

                    ]}
                    pageToolBarRender={[
                        <Permit authority="tenant:lock">
                            <Button
                                key="lock"
                                onClick={() => onLock(selectedKeys)}
                                disabled={disabledLock}
                                loading={loading}
                            >
                                锁定
                            </Button>
                        </Permit>,
                        <Permit authority="tenant:unlock">
                            <Button
                                danger
                                key="unlock"
                                onClick={() => onUnlock(selectedKeys)}
                                disabled={disabledUnlock}
                                loading={loading}
                            >
                                解锁
                            </Button>
                        </Permit>,
                        <Permit authority="tenant:assignMenus">
                            <Button
                                danger
                                key="assignMenus"
                                onClick={() => onResourceClick(selectedKeys[selectedKeys.length - 1])}
                            >
                                授权
                            </Button>
                        </Permit>,
                        <Permit authority="tfunction:open">
                            <Button
                                key="open"
                                onClick={() => onFunctionClick(selectedKeys[selectedKeys.length - 1])}
                            >
                                接口管理
                            </Button>
                        </Permit>,
                        <Permit authority="tenant:doInitSUser">
                            <Button danger key="doInitSUser" onClick={() => handleInitSUser(selectedKeys[selectedKeys.length - 1])}>
                                初始化超管
                            </Button>
                        </Permit>,
                        <Permit authority="tenant:charge">
                            <Button danger key="charge" onClick={() => onChargeClick(selectedKeys[selectedKeys.length - 1])}>
                                充值
                            </Button>
                        </Permit>,
                        <Permit authority="tenant:searchTenantFee">
                            <Button
                                key="searchTenantFee"
                                onClick={() => onBillClick(selectedKeys[selectedKeys.length - 1])}
                            >
                                账单
                            </Button>
                        </Permit>,
                        
                    ]}
                    // onClick={(data) => onClicked(data)}
                    clearSelect={searchLoading}
                />
            </Spin>
        </>
    );
};