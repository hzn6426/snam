import { showDeleteConfirm } from '@/common/antd';
import {
    IFooterToolbar,
    IFormItem,
    IGrid,
    ISearchForm,
    IStatus,
    Permit
} from '@/common/components';
import {
    INewWindow,
    api,
    dateFormat,
    isEmpty,
    pluck,
    useAutoObservableEvent,
    useObservableAutoCallback
} from '@/common/utils';
import {
    PlusOutlined
} from '@ant-design/icons';
import { Button, Form, message } from 'antd';
import { useRef, useState } from 'react';
import { of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    shareReplay,
    switchMap,
    tap
} from 'rxjs/operators';




const StateRenderer = (props) => {
    return props.value && <IStatus value={props.value} state={roleState} />;
};

//列初始化
const initColumns = [
    {
        title: '系统名称',
        width: 100,
        align: 'left',
        dataIndex: 'systemName',
    },
    {
        title: 'APPID',
        width: 170,
        align: 'left',
        dataIndex: 'appId',
    },
    {
        title: 'APPKEY',
        width: 170,
        align: 'left',
        dataIndex: 'appKey',
    },
    {
        title: '过期时间',
        width: 150,
        dataIndex: 'expireDate',
        valueFormatter: (x) => dateFormat(x.value, 'yyyy-MM-dd hh:mm:ss'),
    },
    {
        title: '关联用户',
        width: 140,
        align: 'center',
        dataIndex: 'userRealCnName',
    },
    {
        title: '白名单',
        width: 140,
        align: 'center',
        dataIndex: 'whiteIps',
    },
    {
        title: '备注',
        width: 140,
        align: 'center',
        dataIndex: 'note',
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


    const [onDelete] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            switchMap((keys) => api.hmac.deleteHmacUser(keys)),
            tap(() => {
                message.success('操作成功!');
                refresh();
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    const onRefreshCache = (keys) => {
        api.hmac.refreshCache(keys).subscribe({
            next: () => message.success('操作成功!')
        });
    }

    const [onDoubleClick] = useAutoObservableEvent([
        tap((id) => INewWindow({
            url: '/new/hmac/' + id,
            title: '编辑接入用户',
            width: 700,
            height: 600,
            callback: () => refresh()
        })),
    ]);

    const onNewClick = () => {
        INewWindow({
            url: '/new/hmac/ADD',
            title: '新建接入用户',
            width: 700,
            height: 600,
            callback: () => refresh()
        })
    };



    //查询
    const search = (pageNo, pageSize) => {
        setSelectedKeys([]);
        setSearchLoading(true);
        let param = { dto: searchForm.getFieldValue(), pageNo: pageNo, pageSize: pageSize };
        api.hmac.searchHmacUser(param).subscribe({
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
                    name="systemName"
                    label="系统名称"
                    xtype="input"
                />
                <IFormItem
                    name="appId"
                    label="APPID"
                    xtype="input"
                />
                <IFormItem
                    name="userId"
                    label="用户"
                    xtype="user"
                />
            </ISearchForm>

            <IGrid
                ref={ref}
                title="接入用户列表"
                // height={tableHight}
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
                onSelectedChanged={onChange}
                onDoubleClick={(record) => onDoubleClick(record.id)}
                toolBarRender={[
                    <Permit authority="hmac:save" key="save">
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
                // onClick={(data) => onClicked(data)}
                clearSelect={searchLoading}
            />
            <IFooterToolbar visible={!isEmpty(selectedKeys)}>
                <Permit authority="hmac:delete">
                    <Button
                        type="danger"
                        key="delete"
                        onClick={() => showDeleteConfirm('确定删除选中的外部用户吗?', () => onDelete(selectedKeys))}
                    >
                        删除
                    </Button>
                </Permit>
                <Permit authority="hmac:refreshCache">
                    <Button
                        type='dashed'
                        danger
                        key="delete"
                        onClick={() => onRefreshCache(selectedKeys)}
                    >
                        刷新缓存
                    </Button>
                </Permit>
            </IFooterToolbar>
        </>
    );
};
