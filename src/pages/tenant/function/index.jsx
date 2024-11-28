
import React, { useRef, useState, useEffect } from 'react';
import { api, useAutoObservable, useAutoObservableEvent, contains, forEach } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IAGrid } from '@/common/components';
import { message, Spin, Tag } from 'antd';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { useParams } from 'umi';
import { zip } from 'rxjs';
import { use } from '@/pages/position/service';
import {
    CloseCircleOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';


export default (props) => {
    const ref = useRef();
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    let functionIds = [];

    const [current, setCurrent] = useState({});
    const [refresh, setBeRefresh] = useState(false);


    const OperateRenderer = (props) => {
        const record = props.data;
        const beOpen = contains(record.id, functionIds);
        console.log(beOpen);
        return beOpen ? <Tag color="#2db7f5" style={{ width: 90, cursor: 'pointer' }} icon={<CloseCircleOutlined title='关闭功能' />} onClick={(e) => {
            e.stopPropagation();
            api.tfunction.close({ 'tenantId': params.id, 'functionId': record.id }).subscribe({
                next: (x) => {
                    message.success('关闭成功');
                    doRefresh();
                }
            });
        }} >关闭功能</Tag> : <Tag color="#f50" style={{ width: 90, cursor: 'pointer' }} icon={<CheckCircleOutlined title='开通功能' />} onClick={(e) => {
            e.stopPropagation();
            api.tfunction.open({ 'tenantId': params.id, 'functionId': record.id }).subscribe({
                next: (x) => {
                    message.success('开通成功');
                    doRefresh();
                }
            });
        }} >开通功能</Tag>
    }

    const StateRenderer = (props) => {
        const record = props.data;
        const beOpen = contains(record.id, functionIds);
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
        {
            headerName: '费用类型',
            width: 80,
            field: 'feeType',
            valueFormatter: (x) => {
                if (x.value === 'YEAR') {
                    return '年付费';
                } else if (x.value === 'REQUEST') {
                    return '请求付费';
                }
                return '';
            },
        },
        {
            headerName: '单价',
            width: 60,
            field: 'unitPrice',
        },
        {
            headerName: '操作',
            width: 110,
            field: 'operate',
            cellRenderer: OperateRenderer
        }
    ];

    const loadTenantFunction = (tid, callback) => {
        api.tfunction.listByTenant(tid).subscribe({
            next: (list) => {
                functionIds = list;
                if (callback) {
                    callback();
                }
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
        loadTenantFunction(params.id, () => ref.current.getGridApi().redrawRows());
    }
    useEffect(() => {
        loadTenantFunction(params.id);
        loadFunctions();
    }, [params.id]);

    return (
        <IWindow

            current={current}
            className="snam-modal"
            title={(current && current.id) ? '编辑租户' : '新建租户'}
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