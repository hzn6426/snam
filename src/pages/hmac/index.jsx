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
        headerName: '系统名称',
        width: 100,
        align: 'left',
        field: 'systemName',
    },
    {
        headerName: 'APPID',
        width: 170,
        align: 'left',
        field: 'appId',
    },
    {
        headerName: 'APPKEY',
        width: 170,
        align: 'left',
        field: 'appKey',
    },
    {
        headerName: '过期时间',
        width: 150,
        field: 'expireDate',
        valueFormatter: (x) => dateFormat(x.value, 'yyyy-MM-dd hh:mm:ss'),
    },
    {
        headerName: '关联用户',
        width: 140,
        align: 'center',
        field: 'userRealCnName',
    },
    {
        headerName: '白名单',
        width: 140,
        align: 'center',
        field: 'whiteIps',
    },
    {
        headerName: '备注',
        width: 140,
        align: 'center',
        field: 'note',
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

    const { offsetHeight } = window.document.getElementsByClassName("cala-body")[0]; //获取容器高度

    // 列表及弹窗
    return (
        <>
            <XSearchForm
                form={searchForm}
                rows={1}
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
            </XSearchForm>

            <IAGrid
                ref={ref}
                title="接入用户列表"
                height={offsetHeight - 150}
                // height={tableHight}
                // components={{
                //     stateCellRenderer: StateRenderer,
                // }}
                // columnsStorageKey="_cache_role_columns"
                columns={initColumns}
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
                pageToolBarRender={[
                    <Permit authority="hmac:delete">
                        <Button
                            danger
                            key="delete"
                            onClick={() => showDeleteConfirm('确定删除选中的外部用户吗?', () => onDelete(selectedKeys))}
                        >
                            删除
                        </Button>
                    </Permit>,
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
                ]}
                // onClick={(data) => onClicked(data)}
                clearSelect={searchLoading}
            />
            {/* <IFooterToolbar visible={!isEmpty(selectedKeys)}>
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
            </IFooterToolbar> */}
        </>
    );
};
