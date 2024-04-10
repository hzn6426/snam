import { Button, Form, message } from 'antd';
import { useRef, useState } from 'react';
import {
    IFooterToolbar,
    IFormItem,
    IAGrid,
    ISearchForm,
    IStatus,
    Permit
  } from '@/common/components';
import { option2TextObject } from '@/common/utils';
import {showOperationConfirm} from '@/common/antd';
import {
    INewWindow,
    api,
    beHasRowsPropNotEqual,
    isEmpty,
    pluck,
    useObservableAutoCallback
} from '@/common/utils';
import {
    PlusOutlined,
    LockTwoTone,
    UnlockTwoTone 
} from '@ant-design/icons';
import { of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  shareReplay,
  switchMap,
  tap
} from 'rxjs/operators';

const limitState = {
    STOPPED: { text: '停用', status: 'Warning' },
    USED: { text: '启用', status: 'Success' },
};
const StateRenderer = (props) => {
    return props.value && <IStatus value={props.value} state={limitState} />;
};
//组件
const LockRenderer = (props) => {
    return props.value ? (
      <LockTwoTone twoToneColor="#FF0000" />
    ) : (
      <UnlockTwoTone twoToneColor="#52c41a" />
    );
  };
const userOptions = [{ label: '全部', value: 'ALL' }, { label: '指定', value: 'CUSTOMER' }, { label: '特定', value: 'SPECIAL' }];
const options = [{ label: '全部', value: 'ALL' }, { label: '指定', value: 'CUSTOMER' }];

const optMap = option2TextObject(options);
const userOptMap = option2TextObject(userOptions);
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
        width: 70,
        field: 'state',
        cellRenderer: StateRenderer
    },
    {
        headerName: '锁定',
        width: 70,
        field: 'beLock',
        cellRenderer: LockRenderer
      },
    {
        headerName: '名称',
        width: 120,
        align: 'left',
        field: 'name',
    },
    {
        headerName: '用户规则',
        width: 90,
        align: 'center',
        field: 'ruleUser',
        valueFormatter: (x) => userOptMap[x.value]
    },
    {
        headerName: '业务规则',
        width: 90,
        align: 'center',
        field: 'ruleUserTag',
        valueFormatter: (x) => optMap[x.value]
    },
    {
        headerName: '系统规则',
        width: 90,
        align: 'center',
        field: 'ruleSystemTag',
        valueFormatter: (x) => optMap[x.value]
    },
    {
        headerName: '请求规则',
        width: 90,
        align: 'center',
        field: 'ruleUrl',
        valueFormatter: (x) => optMap[x.value]
    },
    {
        headerName: '单位时间',
        width: 90,
        align: 'center',
        field: 'durationInSecond',
    },
    {
        headerName: '允许流量',
        width: 90,
        align: 'center',
        field: 'allowVolume',
    },
    {
        headerName: '流速(每秒)',
        width: 110,
        align: 'center',
        field: 'speedInSecond',
    },
    {
        headerName: '备注',
        width: 160,
        align: 'left',
        field: 'note',
    }
];

export default () => {

    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [dataSource, setDataSource] = useState([]);

    const [searchLoading, setSearchLoading] = useState(false);
    const [disabledActive, setDisabledActive] = useState(true);
    const [disabledStop, setDisabledStop] = useState(true);

    const ref = useRef();
    const refresh = () => ref.current.refresh();

    const [onChange, selectedKeys, setSelectedKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap((keys) => {
                setDisabledActive(beHasRowsPropNotEqual('state', 'STOPPED', keys));
                setDisabledStop(beHasRowsPropNotEqual('state', 'USED', keys));
            }),
            switchMap((v) => of(pluck('id', v))),
            shareReplay(1),
        ),
    );

    const handleUse = () => {
        setLoading(true);
        api.limit.useLimit(selectedKeys).subscribe({
            next: () => {
                message.success('操作成功!');
                search(pageNo, pageSize);
            }
        }).add(() => setLoading(false));
    }

    const handleStop = () => {
        setLoading(true);
        api.limit.stopLimit(selectedKeys).subscribe({
            next: () => {
                message.success('操作成功!');
                search(pageNo, pageSize);
            }
        }).add(() => setLoading(false));
    }

    const handleDelete = () => {
        setLoading(true);
        api.limit.deleteLimit(selectedKeys).subscribe({
            next: () => {
                message.success('操作成功!');
                search(pageNo, pageSize);
            }
        }).add(() => setLoading(false));
    }

     //新增
     const onNewClick = () => {
        INewWindow({
            url: '/new/limit/ADD',
            title: '新建限流',
            width: 850,
            height: 805,
            callback: () => refresh(),
        })
    };

    //新增
    const onDoubleClick = (id) => {
        INewWindow({
            url: '/new/limit/' + id,
            title: '编辑限流',
            width: 850,
            height: 805,
            callback: () => refresh(),
        })
    };

    const handleRefreshCache = () => {
        api.limit.refreshCache().subscribe({
            next: () => message.success('操作成功！')
        });
    }

    const search = (pageNo, pageSize) => {
        setSelectedKeys([]);
        setSearchLoading(true);
        let param = { dto: {}, pageNo: pageNo, pageSize: pageSize };
        api.limit.searchLimit(param).subscribe({
            next: (data) => {
                setDataSource(data.data);
                setTotal(data.total);
            },
        }).add(() => {
            setSearchLoading(false);
        });
    };

    const { offsetHeight } = window.document.getElementsByClassName("cala-body")[0];
    return (<>
        <IAGrid
            ref={ref}
            title="限流列表"
            height={offsetHeight - 72}
            // components={{
            //     stateRenderer: StateRenderer,
            //     lockRenderer: LockRenderer
            // }}
            columns={initColumns}
            request={(pageNo, pageSize) => search(pageNo, pageSize)}
            dataSource={dataSource}
            pageNo={pageNo}
            pageSize={pageSize}
            total={total}
            onSelectedChanged={onChange}
            onDoubleClick={(record) => onDoubleClick(record.id)}
            toolBarRender={[
                <Permit key="limit:save" authority="limit:save">
                <Button
                    key="add"
                    size="small"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => onNewClick()}
                >
                    新建
                </Button>
                </Permit>,

            ]}
            pageToolBarRender={[
                <Permit authority="limit:use">
                    <Button key="active" onClick={() => showOperationConfirm('只能启用一条限流规则，本条启用后，其他的启用的将自动停用，确定启用吗？', () => handleUse())} loading={loading} disabled={disabledActive}>
                        启用
                    </Button>
                </Permit>,
                <Permit authority="limit:stop">
                    <Button danger key="stop" onClick={() => handleStop()} disabled={disabledStop} loading={loading}>
                        停用
                    </Button>
                </Permit>,
                <Permit authority="limit:delete">
                    <Button danger key="delete" onClick={() => showDeleteConfirm('确定删除选中限流器吗？', () => handleDelete())}>
                        删除
                    </Button>
                </Permit>
            ]}
            clearSelect={searchLoading}
        />
        {/* <IFooterToolbar visible={!isEmpty(selectedKeys)}>
            <Permit authority="limit:use">
                <Button key="active" onClick={() => showOperationConfirm('只能启用一条限流规则，本条启用后，其他的启用的将自动停用，确定启用吗？', () => handleUse())} loading={loading} disabled={disabledActive}>
                    启用
                </Button>
            </Permit>
            <Permit authority="limit:stop">
                <Button danger key="stop" onClick={() => handleStop()} disabled={disabledStop} loading={loading}>
                    停用
                </Button>
            </Permit>
            <Permit authority="limit:delete">
                <Button type="danger" key="delete" onClick={() => showDeleteConfirm('确定删除选中限流器吗？', () => handleDelete())}>
                    删除
                </Button>
            </Permit>
        </IFooterToolbar> */}
    </>)

}