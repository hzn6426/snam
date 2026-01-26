import { showDeleteConfirm } from '@/common/antd';
import {
  IFooterToolbar,
  IFormItem,
  IAGrid,
  IStatus,
  IGridSearch,
  Permit,
  IButton,
} from '@/common/components';
import {
  INewWindow,
  api,
  beHasRowsPropNotEqual,
  isEmpty,
  pluck,
  state2Option,
  useAutoObservableEvent,
  useObservableAutoCallback,
  dateFormat
} from '@/common/utils';
import {
  PlusOutlined,
  LockTwoTone,
  UnlockTwoTone,
  CloudSyncOutlined,
  SyncOutlined,
  DiffOutlined,
  AimOutlined,
  ApiOutlined,
  RestOutlined,
  UserAddOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { Button, Form, Select, Tag, message, Spin, Tooltip } from 'antd';

import { useRef, useState } from 'react';
import { of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  shareReplay,
  switchMap,
  tap
} from 'rxjs/operators';

const roleState = {
  UNACTIVE: { text: '未激活', status: 'Warning' },
  ACTIVE: { text: '启用', status: 'Success' },
};

const TagRenderer = (props) => {
    if (props.value === true) {
        return <Tag color="#f50">是</Tag>;
    }
    return <Tag color="#2db7f5">否</Tag>;
}
const StateRenderer = (props) => {
  return props.value && <IStatus value={props.value} state={roleState} />;
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
    width: 100,
    field: 'state',
    cellRenderer: StateRenderer,
  },
  {
    headerName: '锁定',
    width: 70,
    field: 'beLock',
    cellRenderer: LockRenderer
  },
  {
    headerName: '角色名称',
    width: 100,
    field: 'roleName',
  },
  {
    headerName: '是否超管',
    width: 80,
    field: 'beRoot',
    align: 'center',
    cellRenderer: TagRenderer
  },
  {
    headerName: '创建人',
    width: 100,
    field: 'createUserCnName',
  },
  {
    headerName: '创建时间',
    width: 160,
    field: 'createTime',
    valueFormatter: (x) => dateFormat(x.value, 'yyyy-MM-dd hh:mm:ss'),
  },
  {
    headerName: '备注',
    width: 100,
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
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const [disabledActive, setDisabledActive] = useState(true);
  const [disabledStop, setDisabledStop] = useState(true);


  const ref = useRef();
  const refresh = () => ref.current.refresh();

  const [onChange, selectedKeys, setSelectedKeys] = useObservableAutoCallback((event) =>
    event.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap((keys) => {
        setDisabledActive(beHasRowsPropNotEqual('state', 'UNACTIVE', keys));
        setDisabledStop(beHasRowsPropNotEqual('state', 'ACTIVE', keys));
        // return keys;
      }),
      switchMap((v) => of(pluck('id', v))),
      shareReplay(1),
    ),
  );

  const [onActive] = useAutoObservableEvent(
    [
      tap(() => setLoading(true)),
      filter((keys) => !isEmpty(keys)),
      switchMap((keys) => api.trole.activeRole(keys)),
      tap(() => {
        message.success('操作成功!');
        refresh();
      }),
      shareReplay(1),
    ],
    () => setLoading(false),
  );

  const [onStop] = useAutoObservableEvent(
    [
      tap(() => setLoading(true)),
      switchMap((keys) => api.trole.stopRole(keys)),
      tap(() => {
        message.success('操作成功!');
        refresh();
      }),
      shareReplay(1),
    ],
    () => setLoading(false),
  );

  // const [onDelete] = useAutoObservableEvent(
  //   [
  //     tap(() => setLoading(true)),
  //     switchMap((keys) => api.trole.deleteRole(keys)),
  //     tap(() => {
  //       message.success('操作成功!');
  //       refresh();
  //     }),
  //     shareReplay(1),
  //   ],
  //   () => setLoading(false),
  // );

  const onDelete = (keys) => {
    setLoading(true);
    api.trole.deleteRole({ids:keys, tenantId:props.tenantId}).subscribe({
      next: (res) => {
        message.success('操作成功!');
        refresh();
      },
    }).add(() => setLoading(false))
  }

  const [onDoubleClick] = useAutoObservableEvent([
    tap((id) => INewWindow({
      url: '/new/trole/' + id + '_' + props.tenantId,
      title: '编辑角色',
      width: 600,
      height: 300,
      callback: () => refresh()
    })),
  ]);

  const onNewClick = () => {
    INewWindow({
      url: '/new/trole/ADD' + '_' + props.tenantId,
      title: '新建角色',
      width: 600,
      height: 300,
      callback: () => refresh()
    })
  };

  const onAssignUser = (roleId) => {
    if (selectedKeys.length !== 1) {
      message.error('只能选择一条角色数据！');
      return;
    }
    INewWindow({
      url: '/new/trole/assignUser/' + roleId + '_' + props.tenantId,
      title: '分配用户',
      width: 700,
      height: 600,
      callback: () => refresh()
    })
  };

  const onResourceClick = (id) => {
    if (selectedKeys.length !== 1) {
      message.error('只能选择一条角色数据！');
      return;
    }
    INewWindow({
      url: '/new/trole/resource/' + id + '_' + props.tenantId,
      title: '角色授权',
      width: 1000,
      height: 700,
      callback: () => refresh()
    });
  }


  //查询
  const search = (pageNo, pageSize, params) => {
    setSelectedKeys([]);
    setSearchLoading(true);
    params = params || {};
    let param = { dto: params, pageNo: pageNo, pageSize: pageSize };
    params.tenantId = props.tenantId;
    api.trole.searchRole(param).subscribe({
      next: (data) => {
        setDataSource(data.data);
        setTotal(data.total);
      },
    })
      .add(() => {
        setSearchLoading(false);
      });
  };

  const { offsetHeight } = window.document.getElementsByClassName("cala-body")[0]; //获取容器高度


  // 列表及弹窗
  return (
    <>
      <Spin spinning={searchLoading}>
        {/* <XSearchForm
          form={searchForm}
          onReset={() => ref.current.refresh()}
          rows={1}
          onSearch={(params) => {
            search(1, 50, params);
          }}
        >
          <IFormItem
            name="roleName"
            label="角色名称"
            xtype="input"
          />
          <IFormItem
            name="state"
            label="状态"
            xtype="select"
            options={() => state2Option(roleState)}
          />
        </XSearchForm> */}

        <IAGrid
          gridName="perm_role_list"
          ref={ref}
          title="角色列表"
          columns={initColumns}
          height={offsetHeight - 72}
          defaultSearch={true}
          request={(pageNo, pageSize) => search(pageNo, pageSize)}
          dataSource={dataSource}
          pageNo={pageNo}
          pageSize={pageSize}
          total={total}
          onSelectedChanged={onChange}
          onDoubleClick={(record) => onDoubleClick(record.id)}
          toolBarRender={[
            <IGridSearch defaultValue={'roleName'}
              onSearch={(params) => search(1, pageSize, params)}
              options={[{ label: '角色名', value: 'roleName' }, { label: '状态', value: 'state', xtype: 'select', valueOptions: state2Option(roleState) }]}
            />,
            // <Select defaultValue={'roleName'} size="small" options={[{ label: '角色名', value: 'roleName' }]} />,
            // <Input.Search
            //   style={{ width: 150, marginRight: '5px' }}
            //   onSearch={(value) => {}}
            //   size="small" key="columnSearch"
            //   enterButton
            //   placeholder='搜索' allowClear />,
              <Permit key="role:save" authority="role:save">
                <Tooltip title="创建角色">
                <Button
                  key="add"
                  size="small"
                  // type="primary"
                  icon={<DiffOutlined />}
                  onClick={() => onNewClick()}
                >
                  
                </Button>
                </Tooltip>
              </Permit>
    

          ]}
          pageToolBarRender={[
            <Permit authority="role:use">
              <IButton
                type="primary"
                size='small'
                key="active"
                onClick={() => onActive(selectedKeys)}
                disabled={disabledActive}
                loading={loading}
                icon={<AimOutlined />}
              >
                激活
              </IButton>
            </Permit>,
            <Permit authority="role:stop">
              <IButton
                type="warning"
                key="stop"
                size="small"
                onClick={() => onStop(selectedKeys)}
                disabled={disabledStop}
                loading={loading}
                icon={< ApiOutlined />}
              >
                停用
              </IButton>
            </Permit>,
            <Permit authority="role:delete">
              <IButton
                danger
                type="primary"
                icon={<RestOutlined />}
                size="small"
                key="delete"
                onClick={() => showDeleteConfirm('确定删除选中的角色吗?', () => onDelete(selectedKeys))}
              >
                删除
              </IButton>
            </Permit>,
            <Permit authority="userRole:saveFromRole">
              <IButton 
              size="small"
                type="success"
                icon={<UserAddOutlined />}
              key="saveFromRole" onClick={() => onAssignUser(selectedKeys[selectedKeys.length - 1])}>
                添加用户
              </IButton>
            </Permit>,
            <Permit authority="role:saveMenuPerm">
              <IButton
                key="grant"
                size="small"
                type="info"
                icon={<KeyOutlined />}
                onClick={() => { onResourceClick(selectedKeys[selectedKeys.length - 1]) }}
              >
                授权
              </IButton>
            </Permit>
          ]}
          // onClick={(data) => onClicked(data)}
          clearSelect={searchLoading}
        />
      </Spin>
    </>
  );
};
