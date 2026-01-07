import {
    IAGrid,
    IGridSearch,
    IIF
} from '@/common/components';
import {
    INewWindow,
    api,
    dateFormat,
    forEach,
    pluck
} from '@/common/utils';
import { Alert, Form, message, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';

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
        headerName: '订单编码',
        width: 110,
        field: 'code',
    },
    {
        headerName: '商品名称',
        width: 100,
        field: 'itemName',
    },
    {
        headerName: '数量',
        width: 100,
        field: 'quantity',
    },
    {
        headerName: '单价',
        width: 100,
        field: 'price',
    },
    {
        headerName: '总价',
        width: 100,
        field: 'money',
    },
    {
        headerName: '客服',
        width: 100,
        field: 'service',
    },
    {
        headerName: '销售',
        width: 100,
        field: 'seller',
    },
    {
        headerName: '公司名称',
        width: 120,
        field: 'companyName',
    },
    {
        headerName: '下单时间',
        width: 150,
        field: 'createTime',
        valueFormatter: (x) => dateFormat(x.value, 'yyyy-MM-dd hh:mm:ss'),
    },
    {
        headerName: '购买人',
        width: 120,
        field: 'buyer',
    },
     {
        headerName: '租户',
        width: 120,
        field: 'buyerTenantName',
    },
    {
        headerName: '备注',
        width: 100,
        field: 'note',
    }
];

let tokenMap = {};

const outerOptions = [{
    label: '深深',
    value:'1142843465877422080',
    xtype: 'hidden'
},{
    label:'青青',
    value:'1699691851604324354',
    xtype: 'hidden'
},{
    label:'刘星',
    value:'1143122331925741568',
    xtype: 'hidden'
}];

const outerNoteOptions = {
    '1142843465877422080':'深深为租户中的用户,可在租户管理[管理-用户]中查看,通过接入用户APPID和APPKEY进行登录映射为内部的租户用户,对内部租户用户进行角色资源授权和数据权限授权,从而控制接入用户访问的权限,此处只能查看购买人为当前用户的数据!',
    '1699691851604324354':'青青为租户中的用户,可在租户管理[管理-用户]中查看,通过接入用户APPID和APPKEY进行登录映射为内部的租户用户,对内部租户用户进行角色资源授权和数据权限授权,从而控制接入用户访问的权限,此处只能查看购买人为当前用户的数据!',
    '1143122331925741568':'刘星为内部用户,通过接入用户的[用户]模式,请求后映射为内部用户, 通过角色 职位及资源授权等方式对其分配资源权限和数据权限,从而控制接入该用户所能访问的权限!'
}

export default (props) => {
    const [searchForm] = Form.useForm();
    const [dataSource, setDataSource] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [options, setOptions] = useState([]);
    const [note, setNote] = useState('请在右侧选择对应的用户(接入用户为"接入用户"功能中定义的第三方用户), 列表将展示不同的用户对应的权限数据, 同时展示该用户如何实现权限分配信息!');
    const [searchType, setSearchType] = useState('user');

    const ref = useRef();

    const refresh = () => ref.current.refresh();

    const onChange = (record) => {
        setSelectedKeys(pluck('id', record));
    }


    const onDelete = () => {
        api.order.deleteOrder(selectedKeys).subscribe({
            next: () => {
                message.success('操作成功!');
                search(pageNo,pageSize);
            }
        });
    }

    const onDoubleClick = (id) => {
        // INewWindow({
        //     url: '/new/order/' + id,
        //     title: '编辑提单',
        //     width: 700,
        //     height: 600,
        //     callback: () => refresh()
        // });
    }

    const onNewClick = () => {
        INewWindow({
            url: '/new/order/ADD',
            title: '新建提单',
            width: 700,
            height: 600,
            callback: () => refresh()
        });
    }


    //查询
    const search = (pageNo, pageSize, token) => {
        if (!token) {
            return;
        }
        setSelectedKeys([]);
       
        let param = { dto: {}, pageNo: pageNo, pageSize: pageSize };
        if (searchType == 'user') {
             setSearchLoading(true);
            api.order.searchOrder(token, param).subscribe({
                next: (data) => {
                    setDataSource(data.data);
                    setTotal(data.total);
                },
            }).add(() => {
                setSearchLoading(false);
            });
        } else {
            param.dto.hmacUserId = token;
            setSearchLoading(true);
            api.order.searchOrderByOuter(param).subscribe({
                next: (data) => {
                    setDataSource(data.data);
                    setTotal(data.total);
                },
            }).add(() => {
                setSearchLoading(false);
            });
        }
    };
    const { offsetHeight } = window.document.getElementsByClassName("cala-body")[0]; //获取容器高度

    const onTokenChange = (v) => {
        const map = tokenMap[v];
        const token = map.token;
        const note = map.description;
        setNote(note);
        search(pageNo, pageSize, token);
    }

    const onOuterUserChange = (v) => {
        const note = outerNoteOptions[v];
        setNote(note);
        search(pageNo, pageSize, v);
    }
    useEffect(() => {
        api.order.tokens().subscribe({
            next: (data) => {
                const opt = [];
                forEach((v => {
                    opt.push({
                        label: v.userCnName,
                        value: v.userNo,
                        xtype:"hidden",
                    });
                    tokenMap[v.userNo] = v;
                }),data);
                setOptions(opt);
            }
        });
    },[])

    // 列表及弹窗
    return (
        <>
            {/* <ISearchForm
                form={searchForm}
                onReset={() => ref.current.refresh()}
                onSearch={() => ref.current.refresh()}
            >
                <IFormItem
                    name="code"
                    label="提单编码"
                    xtype="input"
                />
                <IFormItem
                    name="name"
                    label="商品名称"
                    xtype="input"
                />
            </ISearchForm> */}
            <IIF test = {note}>
            <Alert size="small" style={{ fontSize: 12, marginBottom: 10 }} message={note} type="warning" showIcon={true} />
            </IIF>
            <IAGrid
                ref={ref}
                title="商品列表"
                height={offsetHeight - 111}
                // columnsStorageKey="_cache_role_columns"
                columns={initColumns}
                request={(pageNo, pageSize) => search(pageNo, pageSize)}
                dataSource={dataSource}
                pageNo={pageNo}
                pageSize={pageSize}
                total={total}
                onSelectedChanged={onChange}
                onDoubleClick={(record) => onDoubleClick(record.id)}
                toolBarRender={[
                    <Select defaultValue={searchType} size='small' style={{width:'100px'}} options={[{label:'接入用户',value:'outer'}, {label:'内部用户',value:'user'}]} onChange={(value) => setSearchType(value)}/>,
                    <IIF test={searchType === 'user'}>
                    <IGridSearch defaultPlaceholder="选择用户查看权限" selectWidth={150}  size="small" hiddenField={true} onSearch={(params) => search(1, pageSize, params)} onChange={(v) => onTokenChange(v)}
                        options={options} />
                    </IIF>,
                    <IIF test={searchType !== 'user'}>
                        <IGridSearch defaultPlaceholder="选择用户查看权限" selectWidth={150}  size="small" hiddenField={true} onSearch={(params) => search(1, pageSize, params)} onChange={(v) => onOuterUserChange(v)}
                        options={outerOptions} />
                    </IIF>
                    // <Permit authority="param:save" key="save">
                    // <Button
                    //     key="add"
                    //     size="small"
                    //     type="default"
                    //     icon={<PlusOutlined />}
                    //     onClick={() => onNewClick()}
                    // >
                    // </Button>
                    // </Permit>,

                ]}
                // onClick={(data) => onClicked(data)}
                clearSelect={searchLoading}
                pageToolBarRender={[
                    // <Permit authority="order:delete">
                    // <IButton
                    //         danger
                    //         type="primary"
                    //         icon={<RestOutlined />}
                    //         size="small"
                    //         key="delete"
                    //         loading={searchLoading}
                    //         onClick={() => showDeleteConfirm('确定删除选中的订单吗?', () => onDelete(selectedKeys))}
                    //     >
                    //         删除
                    //     </IButton>
                    // </Permit>
                ]}
            />
        </>
    );
};
