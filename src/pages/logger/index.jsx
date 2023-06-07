import {
    IFormItem,
    IGrid,
    ISearchForm,
    IStatus
} from '@/common/components';
import {
    INewWindow,
    api,
    dateFormat,
    pluck,
    useObservableAutoCallback
} from '@/common/utils';
import { Form } from 'antd';
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
        title: '状态',
        width: 80,
        dataIndex: 'state',
        cellRenderer: 'stateCellRenderer',
    },
    {
        title: '操作人',
        width: 100,
        align: 'left',
        dataIndex: 'createUserCnName',
    },
    {
        title: '来源系统',
        width: 100,
        align: 'left',
        dataIndex: 'systemTag',
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
        title: '模块名称',
        width: 130,
        align: 'left',
        dataIndex: 'executeModuleName',
    },
    {
        title: '模块方法',
        width: 130,
        align: 'left',
        dataIndex: 'executeMethod',
    },
    {
        title: '功能名称',
        width: 130,
        align: 'left',
        dataIndex: 'exchangeName',
    },
    {
        title: '日志类型',
        width: 100,
        align: 'left',
        dataIndex: 'logTypeCode',
    },
    {
        title: '请求时间',
        width: 150,
        align: 'left',
        dataIndex: 'exchangeTime',
        valueFormatter: (x) => dateFormat(x.value, 'yyyy-MM-dd hh:mm:ss'),
    },
    {
        title: '请求方法',
        width: 80,
        align: 'left',
        dataIndex: 'exchangeMethod',
    },
    {
        title: '请求地址',
        width: 140,
        align: 'left',
        dataIndex: 'exchangeUrl',
    },
    {
        title: 'IP',
        width: 80,
        align: 'left',
        dataIndex: 'ipAddress',
    },
    {
        title: '执行时间',
        width: 80,
        align: 'left',
        dataIndex: 'executeTimer',
    },
    {
        title: '操作系统',
        width: 140,
        align: 'left',
        dataIndex: 'os',
    },
    {
        title: '浏览器',
        width: 140,
        align: 'left',
        dataIndex: 'browser',
    },
];


export default (props) => {
    const [searchForm] = Form.useForm();
    // const [selectedKeys, setSelectedKeys] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);


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
            url: '/new/logger/' + id,
            title: '日志详情',
            width: 1000,
            height: 700,
        });
    }

    //查询
    const search = (pageNo, pageSize) => {
        setSelectedKeys([]);
        setSearchLoading(true);
        let param = { dto: searchForm.getFieldValue(), pageNo: pageNo, pageSize: pageSize };
        api.logger.searchLogger(param).subscribe({
            next: (data) => {
                setDataSource(data.data);
                setTotal(data.total);
            },
        }).add(() => {
            setSearchLoading(false);
        });
    };


    // 列表及弹窗
    return (
        <>
            <ISearchForm
                form={searchForm}
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
                    name="createUserCnName"
                    label="操作人"
                    xtype="input"
                />
                <IFormItem
                    name="systemTag"
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
            </ISearchForm>

            <IGrid
                ref={ref}
                title="日志列表"
                components={{
                    stateCellRenderer: StateRenderer,
                }}
                // columnsStorageKey="_cache_role_columns"
                initColumns={initColumns}
                request={(pageNo, pageSize) => search(pageNo, pageSize)}
                dataSource={dataSource}
                // pageNo={pageNo}
                // pageSize={pageSize}
                total={total}
                clearSelect={searchLoading}
                onSelectedChanged={onChange}
                onDoubleClick={(record) => onDoubleClick(record.id)}
            />
        </>
    );
};
