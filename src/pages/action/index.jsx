import { showDeleteConfirm } from '@/common/antd';
import {
  IFooterToolbar,
  IFormItem,
  IAGrid,
  XSearchForm,
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
import { Button, Form, Select, Input,Tag, message, Spin, Tooltip } from 'antd';

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
import { refreshCache } from './service';

const actionState = {
  UNACTIVE: { text: '未激活', status: 'Warning' },
  ACTIVE: { text: '启用', status: 'Success' },
};


const StateRenderer = (props) => {
  return props.value && <IStatus value={props.value} state={actionState} />;
};
//组件
const LockRenderer = (props) => {
  return props.value ? (
    <LockTwoTone twoToneColor="#FF0000" />
  ) : (
    <UnlockTwoTone twoToneColor="#52c41a" />
  );
};
const TagRenderer = (props) => {
    if (props.value === true) {
        return <Tag color="#f50">是</Tag>;
    }
    return <Tag color="#2db7f5">否</Tag>;
}
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
    headerName: '权限动作',
    width: 90,
    field: 'actionValue',
  },
  {
    headerName: '忽略用户权限',
    width: 100,
    field: 'actionIgnoreUserScope',
    cellRenderer: TagRenderer
  },
  {
    headerName: '忽略组织权限',
    width: 100,
    field: 'actionIgnoreGroupScope',
    cellRenderer: TagRenderer
  },
  {
    headerName: '忽略公司权限TAG',
    width: 120,
    field: 'actionIgnoreCompanyScopeTags',
  },
  {
    headerName: '只过滤公司TAG',
    width: 110,
    field: 'actionOnlyFilterCompanyTags',
  },
  {
    headerName: '动作连接',
    width: 100,
    field: 'connectValue',
  },
  {
    headerName: '忽略用户权限TAG',
    width: 120,
    field: 'connectIgnoreUserScopeTags',
  },
  {
    headerName: '忽略组织权限TAG',
    width: 120,
    field: 'connectIgnoreGroupScopeTags',
  },
  {
    headerName: '过滤用户列',
    width: 100,
    field: 'connectBeAlwaysFilterCreateUserColumn',
    cellRenderer: TagRenderer
  },
  {
    headerName: '用户权限列',
    width: 100,
    field: 'connectUserAuthColumn',
  },
  {
    headerName: '组织权限列',
    width: 100,
    field: 'connectGroupAuthColumn',
  },
  {
    headerName: '权限注入表名',
    width: 100,
    field: 'connectTableNameWithAuthInject',
  },
  {
    headerName: '列权限注入表名',
    width: 110,
    field: 'connectTableNameWithColumnInject',
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
      switchMap((keys) => api.action.activeAction(keys)),
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
      switchMap((keys) => api.action.stopAction(keys)),
      tap(() => {
        message.success('操作成功!');
        refresh();
      }),
      shareReplay(1),
    ],
    () => setLoading(false),
  );

  const [onDelete] = useAutoObservableEvent(
    [
      tap(() => setLoading(true)),
      switchMap((keys) => api.action.deleteAction(keys)),
      tap(() => {
        message.success('操作成功!');
        refresh();
      }),
      shareReplay(1),
    ],
    () => setLoading(false),
  );

  const [onDoubleClick] = useAutoObservableEvent([
    tap((id) => INewWindow({
      url: '/new/action/' + id,
      title: '编辑Action',
      width: 900,
      height: 600,
      callback: () => refresh()
    })),
  ]);

  const onNewClick = () => {
    INewWindow({
      url: '/new/action/ADD',
      title: '新建Action',
      width: 900,
      height: 600,
      callback: () => refresh()
    })
  };

  const onRefreshCache = (ids) => {
    setLoading(true);
    api.action.refreshCache(ids).subscribe({
      next: () => message.success('操作成功！')
    }).add(() => setLoading(false));
  }



  //查询
  const search = (pageNo, pageSize, params) => {
    setSelectedKeys([]);
    setSearchLoading(true);
    let param = { dto: params || {}, pageNo: pageNo, pageSize: pageSize };
    api.action.searchAction(param).subscribe({
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
          gridName="perm_action_list"
          ref={ref}
          title="权限动作列表"
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
            <IGridSearch defaultValue={'actionValue'}
              onSearch={(params) => search(1, pageSize, params)}
              options={[{ label: '权限动作', value: 'actionValue' },
                 { label: '动作连接', value: 'connectValue' },
                 { label: '用户列', value: 'connectUserAuthColumn' },
                 { label: '组织列', value: 'connectGroupAuthColumn' },
                 { label: '状态', value: 'state', xtype: 'select', valueOptions: state2Option(actionState) }]}
            />,
              <Permit key="action:save" authority="action:save">
                <Tooltip title="创建Action">
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
            <Permit authority="action:use">
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
            <Permit authority="action:stop">
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
            <Permit authority="action:delete">
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
            <Permit authority="action:refreshCache">
              <IButton 
              size="small"
              type="success"
              icon={<CloudSyncOutlined />}
              key="refreshCache" onClick={() => onRefreshCache(selectedKeys)}>
                刷新缓存
              </IButton>
            </Permit>,
          ]}
          // onClick={(data) => onClicked(data)}
          clearSelect={searchLoading}
        />
      </Spin>
    </>
  );
};
