
import { IAGrid, IWindow } from '@/common/components';
import { api, contains, dateFormat } from '@/common/utils';
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined
} from '@ant-design/icons';
import { message, Modal, Space, Spin, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useParams } from '@umijs/max';

let functionIds = [];
export default (props) => {
    const ref = useRef();
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    // const [functionIds,setFunctionIds] =useState([]);

    const [current, setCurrent] = useState({});
    const [refresh, setBeRefresh] = useState(false);


    const OperateRenderer = (props) => {
        const record = props.data;
        console.log(record)
        const beOpen = contains(record.functionId, functionIds);
        if (beOpen) {
        
            // if (record.feeType === 'MONTH') {
            //     return <Space><Tag color="#f50" style={{ width: 90, cursor: 'pointer' }} icon={<CloseCircleOutlined title='关闭功能' />} onClick={(e) => {
            //         e.stopPropagation();
            //         Modal.confirm({
            //             title: "关闭该功能后，接口不可用，并且可能涉及到退费事项，您确认关闭该功能吗？",
            //             okText: '确认',
            //             okType: 'danger',
            //             cancelText: '取消',
            //             onOk() {
            //                 api.tfunction.close({ 'tenantId': params.id, 'functionId': record.functionId }).subscribe({
            //                     next: (x) => {
            //                         message.success('关闭成功');
            //                         doRefresh();
            //                     }
            //                 });
            //             }
            //           });
                    
            //     }} >关闭功能</Tag>
            //     <Tag color="#2db7f5" style={{ width: 90, cursor: 'pointer' }} icon={<ClockCircleOutlined  title='延期功能' />} onClick={(e) => {
            //         e.stopPropagation();
            //         api.tfunction.defer({ 'tenantId': params.id, 'functionId': record.functionId }).subscribe({
            //             next: (x) => {
            //                 message.success('延期成功');
            //                 doRefresh();
            //             }
            //         });
            //     }} >延期功能</Tag>
            //     </Space>;
            // } else {
                    return <Space><Tag color="#f50" style={{ width: 90, cursor: 'pointer' }} icon={<CloseCircleOutlined title='关闭功能' />} onClick={(e) => {
                        e.stopPropagation();
                        api.tfunction.close({ 'tenantId': params.id, 'functionId': record.functionId }).subscribe({
                            next: (x) => {
                                message.success('关闭成功');
                                doRefresh();
                            }
                        });
                    }} >关闭功能</Tag>
                    <Tag color="#2db7f5" style={{ width: 90, cursor: 'pointer' }} icon={<ClockCircleOutlined  title='延期功能' />} onClick={(e) => {
                        e.stopPropagation();
                        api.tfunction.defer({ 'tenantId': params.id, 'functionId': record.functionId }).subscribe({
                            next: (x) => {
                                message.success('延期成功');
                                doRefresh();
                            }
                        });
                    }} >延期功能</Tag>
                    </Space>
                // }
            
        }
            
        return <Tag color="#f50" style={{ width: 90, cursor: 'pointer' }} icon={<CheckCircleOutlined title='开通功能' />} onClick={(e) => {
            e.stopPropagation();
            Modal.confirm({
                title: "您确认开通该功能吗？",
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    api.tfunction.open({ 'tenantId': params.id, 'functionId': record.functionId }).subscribe({
                        next: (x) => {
                            message.success('开通成功');
                            doRefresh();
                        }
                    });
                }
            });
        }} >开通功能</Tag>
    }

    const StateRenderer = (props) => {
        const record = props.data;
        const beOpen = contains(record.functionId, functionIds);
       
        console.log(record.functionId);
        return beOpen ? <Tag color="success">已开通</Tag> : <Tag color="default">未开通</Tag>
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
            width: 90,
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
        // {
        //     headerName: '费用类型',
        //     width: 80,
        //     field: 'feeType',
        //     valueFormatter: (x) => {
        //         if (x.value === 'MONTH') {
        //             return '月付费';
        //         } else if (x.value === 'REQUEST') {
        //             return '请求付费';
        //         }
        //         return '';
        //     },
        // },
        // {
        //     headerName: '单价',
        //     width: 60,
        //     field: 'unitPrice',
        // },
        {
            headerName: '过期时间',
            field: 'expireTime',
            width: 110,
            align: 'center',
            valueFormatter: (x) => dateFormat(x.value, 'yyyy-MM-dd'),
        },
        {
            headerName: '操作',
            width: 230,
            field: 'operate',
            cellRenderer: OperateRenderer
        }
    ];

    const loadTenantFunction = (tid, callback) => {
        api.tfunction.listByTenant(tid).subscribe({
            next: (list) => {
                functionIds = list;
                api.tfunction.listAllOnline().subscribe({
                    next: (online) => {
                        setDataSource(online);
        
                    }
                });
            }
        });
    }
    const loadFunctions = () => {
        api.tfunction.listAllOnline().subscribe({
            next: (online) => {
                setDataSource(online);

            }
        });
    }

    const doRefresh = () => {
        functionIds = [];
        loadTenantFunction(params.id);
        // loadFunctions();
    }
    useEffect(() => {
        functionIds = [];
        loadTenantFunction(params.id);
        // loadFunctions();
    }, [params.id]);

    return (
        <IWindow

            current={current}
            className="odm-modal"
            title={(current && current.id) ? '租户接口管理' : '租户接口管理'}
            width={clientWidth}
            height={clientHeight}
            saveVisible={false}
            onSubmit={(params) => { }}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <Spin spinning={loading}>
                <IAGrid
                    childRef={ref}
                    gridName="tenant_Function_List"
                    title="功能列表"
                    columns={initColumns}
                    height={clientHeight - 150}
                    defaultSearch={true}
                    dataSource={dataSource}
                    optionsHide={{ pagination: true, topTool: true }}
                // components={{
                //     operateRenderer: OperateRenderer,
                // }}
                />
            </Spin>
        </IWindow>
    )
}