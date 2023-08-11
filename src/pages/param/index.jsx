import { showDeleteConfirm } from '@/common/antd';
import {
    IFooterToolbar,
    IFormItem,
    IGrid,
    ISearchForm,
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
import {
LockTwoTone,
UnlockTwoTone 
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
        title: '#',
        width: 60,
        dataIndex: 'rowNo',
        valueGetter: (params) => params.node.rowIndex + 1
    },
    {
        title: '锁定',
        width: 70,
        dataIndex: 'beLock',
        cellRenderer:'lockRenderer'
    },
    {
        title: '参数编码',
        width: 150,
        align: 'left',
        dataIndex: 'paramCode',
    },
    {
        title: '参数名称',
        width: 160,
        align: 'left',
        dataIndex: 'paramName',
    },
    {
        title: '参数值',
        width: 160,
        align: 'left',
        dataIndex: 'paramValue',
    },
    {
        title: '备注',
        width: 160,
        align: 'left',
        dataIndex: 'note',
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


    // 列表及弹窗
    return (
        <>
            <ISearchForm
                form={searchForm}
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
            </ISearchForm>

            <IGrid
                ref={ref}
                title="参数列表"
                // columnsStorageKey="_cache_role_columns"
                initColumns={initColumns}
                request={(pageNo, pageSize) => search(pageNo, pageSize)}
                dataSource={dataSource}
                components={{
                    lockRenderer: LockRenderer
                }}
                // pageNo={pageNo}
                // pageSize={pageSize}
                total={total}
                clearSelect={searchLoading}
                onSelectedChanged={onChange}
                onDoubleClick={(record) => onDoubleClick(record)}
                toolBarRender={[
                    <Permit authority="param:save" key="save">
                        <Button
                            key="newParam"
                            size="small"
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => onNewClick()}
                        >
                            新建
                        </Button>
                    </Permit>

                ]}
            />
            <IFooterToolbar visible={!isEmpty(selectedKeys)}>
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

            </IFooterToolbar>
        </>
    );
};
