import {
  IFooterToolbar,
  IFormItem,
  IGrid,
  ISearchForm,
  IStatus,
  ITag
} from '@/common/components';
import {
  INewWindow,
  api,
  beHasRowsPropNotEqual,
  constant,
  data2Option,
  dateFormat,
  isEmpty,
  pluck,
  split,
  state2Option,
  useAutoObservableEvent,
  useObservableAutoCallback
} from '@/common/utils';
import { useEffect, useRef, useState } from 'react';
// import IGrid from '@/components/IGrid';
// import ISearchForm from '@/components/ISearchForm';
// import IStatus from '@/components/IStatus';
// import ITag from '@/components/ITag';
// import IIF from '@/components/IIF';
// import Permit from '@/components/Permit';
import { showDeleteConfirm, showOperationConfirm } from '@/common/antd';
import { PlusOutlined,LockTwoTone,UnlockTwoTone } from '@ant-design/icons';
import { Button, Form, message } from 'antd';
import { of, zip } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  switchMap,
  tap
} from 'rxjs/operators';
// import { FooterToolbar } from '@ant-design/pro-layout';

// //初始化角色,用户属性
let roles = [];
let userTags = [];
const roleSource = api.role.listAll();
const userTagSource = api.dict.listChildByParentCode(constant.DICT_USER_BUSINEESS_TAG);
zip(roleSource, userTagSource)
  .pipe(
    map(([data1, data2]) => {
      roles = data2Option('id', 'roleName', data1);

      userTags = data2Option('dictCode', 'dictName', data2);
    }),
  )
  .subscribe();

const StateRenderer = (props) => {
  return props.value && <IStatus value={props.value} state={userState} />;
};

const TagRenderer = (props) => {
  return (
    props.value ? (
      <ITag values={split(props.value)} options={userTags} multiColor={false} />
    ) : <span>-</span>
  );
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
    align: 'center',
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
    title: '账号',
    width: 90,
    dataIndex: 'userName',
  },
  {
    title: '姓名',
    width: 90,
    dataIndex: 'userRealCnName',
  },
  {
    title: '登录模式',
    width: 90,
    align: 'center',
    dataIndex: 'beMultiLogin',
    valueFormatter: (x) => x.value === true ? '共享登录' : '单点登录',
  },
  {
    title: '过期策略',
    width: 90,
    align: 'center',
    dataIndex: 'expirePolicy',
    valueFormatter: (x) => {
      if (x.value === 'LAST_ACTIVE') {
        return '最后活跃';
      } else if (x.value === 'FIXED') {
        return '固定时间';
      }
      return '';
    }
  },
  {
    title: '性别',
    width: 70,
    align: 'center',
    dataIndex: 'userSex',
  },
  {
    title: '角色',
    width: 150,
    dataIndex: 'userRoles',
  },
  {
    title: '用户组',
    width: 150,
    dataIndex: 'userSets',
  },
  {
    title: '公司',
    width: 100,
    dataIndex: 'userParentGroups',
  },
  {
    title: '部门',
    width: 90,
    dataIndex: 'userGroups',
  },
  {
    title: '职位',
    width: 90,
    dataIndex: 'userPosts',
  },
  {
    title: '属性',
    width: 150,
    dataIndex: 'userTag',
    cellRenderer: 'tagCellRenderer',
  },
  {
    title: '手机',
    width: 120,
    dataIndex: 'userMobile',
  },
  {
    title: '邮箱',
    width: 180,
    dataIndex: 'userEmail',
  },
  {
    title: '备注',
    width: 150,
    dataIndex: 'note',
  },
  {
    title: '创建日期',
    width: 160,
    dataIndex: 'createTime',
    valueFormatter: (x) => dateFormat(x.value, 'yyyy-MM-dd hh:mm:ss'),
  },
];

const userState = {
  UNACTIVE: { text: '未激活', status: 'Warning' },
  ACTIVE: { text: '启用', status: 'Success' },
  STOPPED: { text: '停用', status: 'Default' },
  LOCKED: { text: '锁定', status: 'Error' },
};

export default (props) => {
  const [searchForm] = Form.useForm();
  const { clientWidth, clientHeight } = window?.document?.documentElement;
  const [tableHight, setTableHight] = useState(clientHeight - 260);
  const [dataSource, setDataSource] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [disabledActive, setDisabledActive] = useState(true);
  const [disabledStop, setDisabledStop] = useState(true);
  const [disabledUnStop, setDisabledUnStop] = useState(true);


  const [groupTreeData, setGroupTreeData] = useState();
  const [groupIdValue, setGroupIdValue] = useState();
  const ref = useRef();

  const refresh = () => ref.current.refresh();

  const [onChange, selectedKeys, setSelectedKeys] = useObservableAutoCallback((event) =>
    event.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap((keys) => {
        setDisabledActive(beHasRowsPropNotEqual('state', 'UNACTIVE', keys));
        setDisabledStop(beHasRowsPropNotEqual('state', 'ACTIVE', keys));
        setDisabledUnStop(beHasRowsPropNotEqual('state', 'STOPPED', keys));
      }),
      switchMap((v) => of(pluck('id', v))),
      shareReplay(1),
    ),
  );

  const [onActive] = useAutoObservableEvent(
    [
      tap(() => setLoading(true)),
      filter((keys) => !isEmpty(keys)),
      switchMap((keys) => api.user.activeUser(keys)),
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
      switchMap((keys) => api.user.stopUser(keys)),
      tap(() => {
        message.success('操作成功!');
        refresh();
      }),
      shareReplay(1),
    ],
    () => setLoading(false),
  );

  const [onUnStop] = useAutoObservableEvent(
    [
      tap(() => setLoading(true)),
      switchMap((keys) => api.user.unstopUser(keys)),
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
      switchMap((keys) => api.user.deleteUser(keys)),
      tap(() => {
        message.success('操作成功!');
        refresh();
      }),
      shareReplay(1),
    ],
    () => setLoading(false),
  );

  const [onResetPasswd] = useAutoObservableEvent(
    [
      tap(() => setLoading(true)),
      switchMap((keys) => api.user.resetUserPasswd(keys)),
      tap(() => {
        message.success('重置密码成功, 请到对应邮箱查看新密码!');
        refresh();
      }),
      shareReplay(1),
    ],
    () => setLoading(false),
  );

  //查询
  const search = (pageNo, pageSize) => {
    setSelectedKeys([]);
    setSearchLoading(true);
    let param = { dto: searchForm.getFieldValue(), pageNo: pageNo, pageSize: pageSize };
    api.user
      .searchUser(param)
      .subscribe({
        next: (data) => {
          setDataSource(data.data);
          setTotal(data.total);
        },
      })
      .add(() => {
        setSearchLoading(false);
      });
  };

  const onNewClick = () => {
    INewWindow({
      url: '/new/user/ADD',
      title: '新建用户',
      width: 700,
      height: 600,
      callback: () => refresh()
    })
  };

  const [onDoubleClick] = useAutoObservableEvent([
    tap((id) => INewWindow({
      url: '/new/user/' + id,
      title: '编辑用户',
      width: 700,
      height: 600,
      callback: () => refresh()
    })),
  ]);

  const treeAllGroups = () => {
    api.group.treeAllGroups().subscribe({
      next: (data) => setGroupTreeData(data)
    })
  };

  useEffect(() => {
    treeAllGroups();
  }, []);

  // 列表及弹窗
  return (
    <>
      <ISearchForm
        form={searchForm}
        onReset={() => ref.current.refresh()}
        onSearch={() => ref.current.refresh()}
        onHeightChange={(iheight) => setTableHight(iheight)}
      >
        <IFormItem name="userNo" label="账号" xtype="input" />
        <IFormItem name="userRealCnName" label="姓名" xtype="input" />
        <IFormItem name="userTag" label="属性" xtype="select" options={userTags} />
        <IFormItem name="userMobile" label="手机" xtype="input" />
        <IFormItem
          name="state"
          label="状态"
          xtype="select"
          options={() => state2Option(userState)}
        />
        <IFormItem name="groupId" label="部门" xtype="department" />
        <IFormItem name="roleName" label="角色" xtype="input" />
        <IFormItem name="postName" label="职位" xtype="input" />
      </ISearchForm>
      <IGrid
        ref={ref}
        title="用户列表"
        height={tableHight}
        components={{
          stateCellRenderer: StateRenderer,
          tagCellRenderer: TagRenderer,
          lockRenderer: LockRenderer
        }}
        // columnsStorageKey="_cache_user_columns"
        initColumns={initColumns}
        request={(pageNo, pageSize) => search(pageNo, pageSize)}
        dataSource={dataSource}
        total={total}
        onSelectedChanged={onChange}
        onDoubleClick={(record) => onDoubleClick(record.id)}
        toolBarRender={[
          <Button
            key="add"
            size="small"
            type="primary"
            shape="round"
            icon={<PlusOutlined />}
            onClick={() => onNewClick()}
          >
            新建
          </Button>,
        ]}
        clearSelect={searchLoading}
      />
      <IFooterToolbar visible={!isEmpty(selectedKeys)}>
        <Button
          key="active"
          onClick={() => onActive(selectedKeys)}
          disabled={disabledActive}
          loading={loading}
        >
          激活
        </Button>
        <Button
          danger
          key="stop"
          onClick={() => onStop(selectedKeys)}
          disabled={disabledStop}
          loading={loading}
        >
          停用
        </Button>
        <Button
          danger
          key="unstop"
          onClick={() => onUnStop(selectedKeys)}
          disabled={disabledUnStop}
          loading={loading}
        >
          启用
        </Button>
        <Button
          type="danger"
          key="delete"
          onClick={() => showDeleteConfirm('确定删除选中的用户吗?', () => onDelete(selectedKeys))}
        >
          删除
        </Button>
        <Button danger key="reset" onClick={() => showOperationConfirm('重置密码后,新密码将发送到用户邮箱,确定重置选中用户密码吗？', () => onResetPasswd(selectedKeys))}>
          重置密码
        </Button>
        {/* <Permit authority="user:active">
          <Button
            key="active"
            onClick={() => onActive(selectedKeys)}
            disabled={disabledActive}
            loading={loading}
          >
            激活
          </Button>
        </Permit>
        <Permit authority="user:stop">
          <Button
            danger
            key="stop"
            onClick={() => onStop(selectedKeys)}
            disabled={disabledStop}
            loading={loading}
          >
            停用
          </Button>
        </Permit>

        <Permit authority="user:delete">
          <Button
            type="danger"
            key="delete"
            onClick={() => showDeleteConfirm('确定删除选中的用户吗?', () => onDelete(selectedKeys))}
          >
            删除
          </Button>
        </Permit> */}
        {/* <Permit authority="user:unstop">
            <Button key="unstop" onClick={handleUnstop}>
              启用
            </Button>
          </Permit>
          <Permit authority="user:stop">
            <Button danger key="stop" onClick={handleStop}>
              停用
            </Button>
          </Permit>
          <Permit authority="user:reset">
            <Button danger key="reset" onClick={handleReset}>
              重置密码
            </Button>
          </Permit>
          <Permit authority="user:delete">
            <Button type="danger" key="delete" onClick={handleDelete}>
              删除
            </Button>
          </Permit> */}
        {/* <Permit authority="userRole:saveFromUser">
            <Button type="primary" key="role" onClick={handleAssignRoles}>
              分配角色
            </Button>
          </Permit> */}
      </IFooterToolbar>

    </>
  );
};
