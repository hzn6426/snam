import {
    IFormItem,
    IAGrid,
    XSearchForm,
    IGridSearch,
    IStatus
} from '@/common/components';
import {
    INewWindow,
    api,
    dateFormat,
    pluck,
    useObservableAutoCallback
} from '@/common/utils';
import { Form, Select, Input } from 'antd';
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
        // rowDrag: true,
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
        field: 'dataFrom',
    },
    {
        headerName: '功能名称',
        width: 170,
        align: 'left',
        field: 'exchangeName',
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
        width: 190,
        align: 'left',
        field: 'exchangeUrl',
    },
    {
        headerName: 'IP',
        width: 120,
        align: 'left',
        field: 'ipAddress',
    },

];


export default (props) => {
    const [searchForm] = Form.useForm();
    // const [selectedKeys, setSelectedKeys] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
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
            url: '/new/mlogger/' + id,
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
        api.mlogger.searchLogger(param).subscribe({
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
            {/* <XSearchForm
                form={searchForm}
                rows={1}
                onReset={() => ref.current.refresh()}
                onSearch={() => ref.current.refresh()}
            >
                <IFormItem
                    name="state"
                    label="状态"
                    xtype="select"
                    options={[{ label: '成功', value: 'SUCCESS' }, { label: '失败', value: 'FAILURE' }]}
                />
                <IFormItem
                    name="dataFrom"
                    label="来源系统"
                    xtype="input"
                />
                <IFormItem
                    name="exchangeName"
                    label="模块名称"
                    xtype="input"
                />
                <IFormItem
                    name="startTime"
                    label="起始时间"
                    xtype="datetime"
                />
                <IFormItem
                    name="endTime"
                    label="结束时间"
                    xtype="datetime"
                />
            </XSearchForm> */}

            <IAGrid
                ref={ref}
                title="日志列表"
                gridName="perm_hmac_log_list"
                height={offsetHeight - 66}
                // components={{
                //     stateCellRenderer: StateRenderer,
                // }}
                // columnsStorageKey="_cache_role_columns"
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
                    <IGridSearch defaultValue={'dataFrom'} size="small" onSearch={(params) => {
                        let p = {};
                        if (params.startTime) {
                            p.startTime = params.startTime[0];
                            p.endTime = params.startTime[1];
                        } else {
                            p = params;
                        }
                        search(1, pageSize, p);
                    }}
                        options={[{ label: '来源系统', value: 'dataFrom' }, { label: '模块名称', value: 'exchangeName' },
                            { label: '状态', value: 'state', xtype: 'select', valueOptions: [{ label: '成功', value: 'SUCCESS' }, { label: '失败', value: 'FAILURE' }] },
                            { label: '请求时间', value: 'startTime', xtype: 'datetimerange' }
                        ]} />,
                ]}
                // <Select defaultValue={'exchangeName'} size="small" style={{ width: 100 }}
                //     options={[{ label: '来源系统', value: 'dataFrom' }, { label: '模块名称', value: 'exchangeName' }
                //     ]} />,
                // <Input.Search
                //     style={{ width: 150, marginRight: '5px' }}
                //     onSearch={(value) => { }}
                //     size="small" key="columnSearch"
                //     enterButton
                //     placeholder='搜索' allowClear />,
            />
        </>
    );
};
