
import React, { useRef, useState, useEffect } from 'react';
import { api, useAutoObservable, useAutoObservableEvent, contains, dateFormat } from '@/common/utils';
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
    const [total, setTotal] = useState(0);
    const [current, setCurrent] = useState({});

    //查询
    const search = (pageNo, pageSize) => {
        setLoading(true);
        let param = { dto: { tenantId: params.id }, pageNo: pageNo, pageSize: pageSize };
        api.tenant.searchFeeByTenant(param).subscribe({
            next: (data) => {
                setDataSource(data.data);
                setTotal(data.total);
            },
        }).add(() => {
            setLoading(false);
        });
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
            headerName: '功能名称',
            width: 120,
            field: 'exchangeName',
        },
        {
            headerName: '请求时间',
            width: 150,
            field: 'exchangeTime',
            valueFormatter: (x) => dateFormat(x.value, 'yyyy-MM-dd hh:mm:ss'),
        },
        {
            headerName: '操作用户',
            width: 80,
            field: 'createUserCnName',
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
                } else if (x.value === 'CHARGE') {
                    return '充值';
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
            headerName: '数量',
            width: 60,
            field: 'requestQty',
        },
        {
            headerName: '总价',
            width: 80,
            field: 'totalPrice'
        },
        {
            headerName: 'IP地址',
            width: 80,
            field: 'ipAddress'
        },
        {
            headerName: '操作系统',
            width: 120,
            field: 'os'
        },
        {
            headerName: '浏览器',
            width: 120,
            field: 'browser'
        }
    ];


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
                    request={(pageNo, pageSize) => search(pageNo, pageSize)}
                    height={clientHeight - 150}
                    defaultSearch={true}
                    dataSource={dataSource}
                    total={total}
                // optionsHide={{ pagination: true, topTool: true }}
                // components={{
                //     operateRenderer: OperateRenderer,
                // }}
                />
            </Spin>
        </IWindow>
    )
}