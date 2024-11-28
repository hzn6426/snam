import {
    IAGrid,
    IStatus,
    IGridSearch
} from '@/common/components';
import {
    INewWindow,
    api,
    dateFormat,
    pluck,
    useObservableAutoCallback
} from '@/common/utils';
import { useRef, useState } from 'react';
import { of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    shareReplay,
    switchMap
} from 'rxjs/operators';

const loggerState = {
    FAILURE: { text: '失败', status: 'Error' },
    SUCCESS: { text: '成功', status: 'Success' },
};


const StateRenderer = (props) => {
    if (props.value) {
        return props.value && <IStatus value={props.value} state={loggerState} />;
    }
    return <>{props.value}</>
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
    },
    {
        headerName: '状态',
        width: 80,
        field: 'state',
        cellRenderer: StateRenderer,
    },
    {
        headerName: '操作人',
        width: 100,
        align: 'left',
        field: 'createUserCnName',
    },
    {
        headerName: '来源系统',
        width: 100,
        align: 'left',
        field: 'systemTag',
        valueFormatter: (x) => {
            const text = x.value;
            if (text) {
                if (text.startsWith('business')) {
                    return '业务端';
                } else if (text.startsWith('app')) {
                    return 'APP';
                } else if (text.startsWith('admin')) {
                    return '授权端';
                } else if (text.startsWith('temp')) {
                    return '临时端';
                } else {
                    return '其他';
                }
            }
            return '';
        }
    },
    {
        headerName: '模块名称',
        width: 130,
        align: 'left',
        field: 'executeModuleName',
    },
    {
        headerName: '模块方法',
        width: 130,
        align: 'left',
        field: 'executeMethod',
    },
    {
        headerName: '功能名称',
        width: 130,
        align: 'left',
        field: 'exchangeName',
    },
    {
        headerName: '日志类型',
        width: 100,
        align: 'left',
        field: 'logTypeCode',
    },
    {
        headerName: '请求时间',
        width: 150,
        align: 'left',
        field: 'exchangeTime',
        valueFormatter: (x) => dateFormat(x.value, 'yyyy-MM-dd hh:mm:ss'),
    },
    {
        headerName: '请求方法',
        width: 80,
        align: 'left',
        field: 'exchangeMethod',
    },
    {
        headerName: '请求地址',
        width: 140,
        align: 'left',
        field: 'exchangeUrl',
    },
    {
        headerName: 'IP',
        width: 80,
        align: 'left',
        field: 'ipAddress',
    },
    {
        headerName: '执行时间',
        width: 80,
        align: 'left',
        field: 'executeTimer',
    },
    {
        headerName: '操作系统',
        width: 140,
        align: 'left',
        field: 'os',
    },
    {
        headerName: '浏览器',
        width: 140,
        align: 'left',
        field: 'browser',
    },
];


export default (props) => {
    const [dataSource, setDataSource] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(50);


    const ref = useRef();
    const refresh = () => ref.current.refresh();

    const [onChange, selectedKeys, setSelectedKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((v) => of(pluck('id', v))),
            shareReplay(1),
        ),
    );

    const onDoubleClick = (id) => {
        INewWindow({
            url: '/new/tlog/' + id,
            title: '日志详情',
            width: 1000,
            height: 700,
        });
    }

    //查询
    const search = (pageNo, pageSize, params) => {
        setSelectedKeys([]);
        setSearchLoading(true);
        let param = { dto: params || {}, pageNo: pageNo, pageSize: pageSize };
        api.tlog.searchLogger(param).subscribe({
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
            <IAGrid
                ref={ref}
                title="日志列表"
                gridName="perm_tenant_log_list"
                height={offsetHeight - 66}
                columns={initColumns}
                request={(pageNo, pageSize) => search(pageNo, pageSize)}
                dataSource={dataSource}
                pageNo={pageNo}
                pageSize={pageSize}
                total={total}
                clearSelect={searchLoading}
                onSelectedChanged={onChange}
                onDoubleClick={(record) => onDoubleClick(record.id)}
                toolBarRender={[
                    <IGridSearch defaultValue={'createUserCnName'} size="small" style={{ width: 100 }}
                        onSearch={(params) => {
                            let p = {};
                            if (params.startTime) {
                                p.startTime = params.startTime[0];
                                p.endTime = params.startTime[1];
                            } else {
                                p = params;
                            }
                            search(1, pageSize, p);
                        }}
                        options={[{ label: '来源系统', value: 'systemTag' }, { label: '模块名称', value: 'exchangeName' },
                            { label: '操作人', value: 'createUserCnName' },
                            { label: '状态', value: 'state', xtype: 'select', valueOptions: [{ label: '成功', value: 'SUCCESS' }, { label: '失败', value: 'FAILURE' }] },
                            { label: '请求时间', value: 'startTime', xtype: 'datetimerange' }
                        ]} />,
                ]}
            />
        </>
    );
};
