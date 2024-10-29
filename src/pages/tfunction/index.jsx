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
    useObservableAutoCallback
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

const functionState = {
    ONLINE: { text: '正常', status: 'Success' },
    OFFLINE: { text: '下线', status: 'Warning' },
};


const StateRenderer = (props) => {
    return props.value && <IStatus value={props.value} state={functionState} />;
};


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
        headerName: '功能名称',
        width: 140,
        field: 'functionName',
    },
    {
        headerName: '请求URL',
        width: 160,
        field: 'requestUrl',
    },
    {
        headerName: '请求方法',
        width: 80,
        field: 'requestMethod',
    },
    {
        headerName: '费用类型',
        width: 140,
        field: 'feeType',
        valueFormatter: (x) => {
            if (x.value === 'YEAR') {
                return '年付费';
            } else if (x.value === 'REQUEST') {
                return '请求付费';
            }
            return '';
        },
    },
    {
        headerName: '单价',
        width: 80,
        field: 'unitPrice',
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



    const [dataSource, setDataSource] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    const [disabledOnline, setDisabledOnline] = useState(false);
    const [disabledOffline, setDisabledOffline] = useState(false);

    const ref = useRef();
    const refresh = () => ref.current.refresh();

    const [onChange, selectedKeys, setSelectedKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap((keys) => {
                setDisabledOnline(beHasRowsPropNotEqual('state', 'OFFLINE', keys));
                setDisabledOffline(beHasRowsPropNotEqual('state', 'ONLINE', keys));
                // return keys;
            }),
            switchMap((v) => of(pluck('id', v))),
            shareReplay(1),
        ),
    );

    //查询
    const search = (pageNo, pageSize) => {
        setSelectedKeys([]);
        setSearchLoading(true);
        let param = { dto: {}, pageNo: pageNo, pageSize: pageSize };
        api.tfunction.searchFunction(param).subscribe({
            next: (data) => {
                setDataSource(data.data);
                setTotal(data.total);
            },
        }).add(() => {
            setSearchLoading(false);
        });
    };

    const [onDelete] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            switchMap((keys) => api.tfunction.deleteFunction(keys)),
            tap(() => {
                message.success('操作成功!');
                refresh();
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    const [onDoubleClick] = useAutoObservableEvent([
        tap((id) => INewWindow({
            url: '/new/tfunction/' + id,
            title: '编辑租户接口',
            width: 700,
            height: 400,
            callback: () => refresh()
        })),
    ]);

    const [online] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            switchMap((keys) => api.tfunction.online(keys)),
            tap(() => {
                message.success('操作成功!');
                refresh();
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    const [offline] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            switchMap((keys) => api.tfunction.offline(keys)),
            tap(() => {
                message.success('操作成功!');
                refresh();
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    const onNewClick = () => {
        INewWindow({
            url: '/new/tfunction/ADD',
            title: '新建租户接口',
            width: 700,
            height: 400,
            callback: () => refresh()
        })
    };

    const { offsetHeight } = window?.document?.documentElement;

    return (<>
        <Spin spinning={searchLoading}>
            <IAGrid
                gridName="businessFunction_List"
                title="功能列表"
                ref={ref}
                columns={initColumns}
                height={offsetHeight - 150}
                defaultSearch={true}
                request={(pageNo, pageSize) => search(pageNo, pageSize)}
                dataSource={dataSource}
                total={total}
                onSelectedChanged={onChange}
                onDoubleClick={(record) => onDoubleClick(record.id)}
                toolBarRender={[
                    <Space key="space">
                        <Permit key="function:save" authority="tfunction:save">
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
                    <Permit authority="tfunction:offline">
                        <Button
                            key="offline"
                            onClick={() => offline(selectedKeys)}
                            disabled={disabledOffline}
                            loading={loading}
                        >
                            下线
                        </Button>
                    </Permit>,
                    <Permit authority="tfunction:online">
                        <Button
                            danger
                            key="online"
                            onClick={() => online(selectedKeys)}
                            disabled={disabledOnline}
                            loading={loading}
                        >
                            上线
                        </Button>
                    </Permit>,
                    <Permit authority="tfunction:delete">
                        <Button
                            danger
                            key="delete"
                            onClick={() => showDeleteConfirm('确定删除选中的功能吗?', () => onDelete(selectedKeys))}
                        >
                            删除
                        </Button>
                    </Permit>,

                ]}
                // onClick={(data) => onClicked(data)}
                clearSelect={searchLoading}
            />
        </Spin >
    </>
    )


}