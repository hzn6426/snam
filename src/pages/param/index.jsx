import { showDeleteConfirm } from '@/common/antd';
import {
    IFooterToolbar,
    IFormItem,
    IAGrid,
    XSearchForm,
    IButton,
    Permit
} from '@/common/components';
import {
    INewWindow,
    api,
    isEmpty,
    pluck,
    useAutoObservableEvent,
    useObservableAutoCallback
} from '@/common/utils';
import {
    PlusOutlined
} from '@ant-design/icons';
import { Button, Form, Tooltip, message, Input, Select } from 'antd';
import { useRef, useState } from 'react';
import { of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    shareReplay,
    switchMap,
    tap
} from 'rxjs/operators';
import {
LockTwoTone,
    RestOutlined,
    UnlockTwoTone,
    DiffOutlined
} from '@ant-design/icons';
//组件
const LockRenderer = (props) => {
    return props.value ? (
      <LockTwoTone twoToneColor="#FF0000" />
    ) : (
      <UnlockTwoTone twoToneColor="#52c41a" />
    );
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
        headerName: '锁定',
        width: 70,
        field: 'beLock',
        cellRenderer: LockRenderer
    },
    {
        headerName: '参数编码',
        width: 150,
        align: 'left',
        field: 'paramCode',
    },
    {
        headerName: '参数名称',
        width: 160,
        align: 'left',
        field: 'paramName',
    },
    {
        headerName: '参数值',
        width: 160,
        align: 'left',
        field: 'paramValue',
    },
    {
        headerName: '备注',
        width: 160,
        align: 'left',
        field: 'note',
    }
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
            switchMap((keys) => api.param.deleteParam(keys)),
            tap(() => {
                message.success('操作成功!');
                refresh();
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    //双击
    const onDoubleClick = (param) => {
        INewWindow({
            url: '/new/param/save',
            title: '编辑参数',
            width: 600,
            height: 400,
            callback: () => refresh(),
            callparam: () => param
        })
    }

    //新增
    const onNewClick = () => {
        const param = {};
        INewWindow({
            url: '/new/param/save',
            title: '新建参数',
            width: 600,
            height: 400,
            callback: () => refresh(),
            callparam: () => param
        })
    };


    //查询
    const search = (pageNo, pageSize) => {
        setSelectedKeys([]);
        setSearchLoading(true);
        let param = { dto: searchForm.getFieldValue(), pageNo: pageNo, pageSize: pageSize };
        api.param.searchParam(param).subscribe({
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
                    name="paramCode"
                    label="参数编码"
                    xtype="input"
                />
                <IFormItem
                    name="paramName"
                    label="参数名称"
                    xtype="input"
                />
            </XSearchForm> */}

            <IAGrid
                ref={ref}
                title="参数列表"
                height={offsetHeight - 66}
                // columnsStorageKey="_cache_role_columns"
                columns={initColumns}
                request={(pageNo, pageSize) => search(pageNo, pageSize)}
                dataSource={dataSource}
                // components={{
                //     lockRenderer: LockRenderer
                // }}
                // pageNo={pageNo}
                // pageSize={pageSize}
                total={total}
                clearSelect={searchLoading}
                onSelectedChanged={onChange}
                onDoubleClick={(record) => onDoubleClick(record)}
                toolBarRender={[
                    <Select defaultValue={'paramName'} size="small" options={[{ label: '参数名称', value: 'paramName' }, { label: '参数编码', value: 'paramCode' }]} />,
                    <Input.Search
                        style={{ width: 150, marginRight: '5px' }}
                        onSearch={(value) => { }}
                        size="small" key="columnSearch"
                        enterButton
                        placeholder='搜索' allowClear />,
                    <Permit authority="param:save" key="save">
                        <Tooltip title="新建参数">
                        <Button
                            key="newParam"
                            size="small"
                                icon={<DiffOutlined />}
                            onClick={() => onNewClick()}
                            >
                        </Button>
                        </Tooltip>
                    </Permit>

                ]}
                pageToolBarRender={[
                    <Permit authority="param:delete">
                        <IButton
                            danger
                            type="primary"
                            icon={<RestOutlined />}
                            size="small"
                            key="delete"
                            loading={loading}
                            onClick={() => showDeleteConfirm('确定删除选中的参数吗?', () => onDelete(selectedKeys))}
                        >
                            删除
                        </IButton>
                    </Permit>
                ]}
            />
            {/* <IFooterToolbar visible={!isEmpty(selectedKeys)}>
                <Permit authority="param:delete">
                    <Button
                        type="danger"
                        key="delete"
                        loading={loading}
                        onClick={() => showDeleteConfirm('确定删除选中的参数吗?', () => onDelete(selectedKeys))}
                    >
                        删除
                    </Button>
                </Permit>

            </IFooterToolbar> */}
        </>
    );
};
