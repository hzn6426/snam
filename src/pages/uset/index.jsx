import { showDeleteConfirm, showOperationConfirm } from '@/common/antd';
import {
    IFooterToolbar,
    IGrid,
    IStatus,
    Permit
} from '@/common/components';
import {
    INewWindow,
    api,
    beHasRowsPropNotEqual,
    isEmpty,
    pluck,
    useObservableAutoCallback
} from '@/common/utils';
import {
    PlusOutlined,
    LockTwoTone,
    UnlockTwoTone 
} from '@ant-design/icons';
import { Button, message } from 'antd';
import { useState } from 'react';
import { of } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    shareReplay,
    switchMap,
    tap
} from 'rxjs/operators';


const usetState = {
    UNACTIVE: { text: '未激活', status: 'Warning' },
    ACTIVE: { text: '启用', status: 'Success' },
};

const StateRenderer = (props) => {
    return props.value && <IStatus value={props.value} state={usetState} />;
};

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
        title: '状态',
        width: 80,
        dataIndex: 'state',
        cellRenderer: 'stateCellRenderer',
    },
    {
        title: '锁定',
        width: 70,
        dataIndex: 'beLock',
        cellRenderer:'lockRenderer'
      },
    {
        title: '组名称',
        width: 100,
        dataIndex: 'usetName',
    },
    {
        title: '组描述',
        width: 140,
        align: 'left',
        dataIndex: 'note',
    },
];

export default () => {

    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [dataSource, setDataSource] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [disabledActive, setDisabledActive] = useState(true);
    const [disabledStop, setDisabledStop] = useState(true);

    const [onChange, selectedKeys, setSelectedKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            tap((keys) => {
                setDisabledActive(beHasRowsPropNotEqual('state', 'UNACTIVE', keys));
                setDisabledStop(beHasRowsPropNotEqual('state', 'ACTIVE', keys));
            }),
            switchMap((v) => of(pluck('id', v))),
            shareReplay(1),
        ),
    );

    const handleUse = () => {
        setLoading(true);
        api.uset.useUset(selectedKeys).subscribe({
            next: () => {
                message.success('操作成功!');
                search(pageNo, pageSize);
            }
        }).add(() => setLoading(false));
    }

    const handleStop = () => {
        setLoading(true);
        api.uset.stopUset(selectedKeys).subscribe({
            next: () => {
                message.success('操作成功!');
                search(pageNo, pageSize);
            }
        }).add(() => setLoading(false));
    }

    const handleDelete = () => {
        setLoading(true);
        api.uset.deleteUset(selectedKeys).subscribe({
            next: () => {
                message.success('操作成功!');
                search(pageNo, pageSize);
            }
        }).add(() => setLoading(false));
    }

    //分配用户
    const handleAssignUsers = () => {
        if (selectedKeys.length !== 1) {
            message.error('只能选择一条用户组数据！');
            return;
        }
        const usetId = selectedKeys[0];
        INewWindow({
            url: '/new/uset/user/' + usetId,
            title: '添加用户',
            width: 700,
            height: 600,
            callback: () => search(pageNo, pageSize)
        });
    }

    const handleAssignRoles = () => {
        if (selectedKeys.length !== 1) {
            message.error('只能选择一条用户组数据！');
            return;
        }
        const usetId = selectedKeys[0];
        INewWindow({
            url: '/new/uset/role/' + usetId,
            title: '分配角色',
            width: 700,
            height: 600,
            callback: () => search(pageNo, pageSize)
        });
    }

    //双击
    const onDoubleClick = (id) => {
        INewWindow({
            url: '/new/uset/' + id,
            title: '编辑用户组',
            width: 600,
            height: 300,
            callback: () => search(pageNo, pageSize)
        });
    };

    const onNewClick = () => {
        INewWindow({
            url: '/new/uset/ADD',
            title: '新增用户组',
            width: 600,
            height: 300,
            callback: () => search(pageNo, pageSize)
        })
    };

    //查询
    const search = (pageNo, pageSize) => {
        setSelectedKeys([]);
        setSearchLoading(true);
        let param = { dto: {}, pageNo: pageNo, pageSize: pageSize };
        api.uset.searchUset(param).subscribe({
            next: (data) => {
                setDataSource(data.data);
                setTotal(data.total);
            },
        }).add(() => {
            setSearchLoading(false);
        });
    };

    return (<>
        <IGrid
            title="用户组列表"
            components={{
                stateCellRenderer: StateRenderer,
                lockRenderer: LockRenderer
            }}
            initColumns={initColumns}
            request={(pageNo, pageSize) => search(pageNo, pageSize)}
            dataSource={dataSource}
            pageNo={pageNo}
            pageSize={pageSize}
            total={total}
            onSelectedChanged={onChange}
            onDoubleClick={(record) => onDoubleClick(record.id)}
            toolBarRender={[
                <Permit key="uset:save" authority="uset:save">
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
            clearSelect={searchLoading}
        />
        <IFooterToolbar visible={!isEmpty(selectedKeys)}>
            <Permit authority="uset:use">
                <Button key="active" onClick={handleUse} loading={loading} disabled={disabledActive}>
                    启用
                </Button>
            </Permit>
            <Permit authority="uset:stop">
                <Button danger key="stop" onClick={() => showOperationConfirm('用户组停用后不可用，对应权限将失效，确定停用选中用户组吗？', () => handleStop())} disabled={disabledStop} loading={loading}>
                    停用
                </Button>
            </Permit>
            <Permit authority="uset:delete">
                <Button type="danger" key="delete" onClick={() => showDeleteConfirm('删除后用户组中的用户权限将失效,确定删除选中用户组吗？', () => handleDelete())}>
                    删除
                </Button>
            </Permit>
            <Permit authority="userUset:saveFromUset">
                <Button type="primary" key="saveFromUset" onClick={handleAssignUsers}>
                    添加用户
                </Button>
            </Permit>
            <Permit authority="uset:saveRoleFromUset">
                <Button type="primary" key="saveRoleFromUset" onClick={handleAssignRoles}>
                    分配角色
                </Button>
            </Permit>
        </IFooterToolbar>
    </>)
}