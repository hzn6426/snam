import {
  IFooterToolbar,
  IFormItem,
  IGrid,
  IAGrid,
  ISearchForm,
  // XSearchForm,
  IStatus,
  ITag,
  Permit
} from '@/common/components';
import XSearchForm from '@/components/XSearchForm';
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
import { PlusOutlined, LockTwoTone, UnlockTwoTone } from '@ant-design/icons';
import { Button, Form, message, Tooltip, Spin, Input } from 'antd';
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
    textAlign: 'center',
    field: 'state',
    // cellRenderer: 'stateCellRenderer',
    cellRenderer: StateRenderer,
  },
  {
    headerName: '锁定',
    width: 70,
    field: 'beLock',
    // cellRenderer:'lockRenderer'
    cellRenderer: LockRenderer
  },
  {
    headerName: '账号',
    width: 90,
    field: 'userName',
  },
  {
    headerName: '姓名',
    width: 90,
    field: 'userRealCnName',
  },
  {
    headerName: '登录模式',
    width: 90,
    align: 'center',
    field: 'beMultiLogin',
    valueFormatter: (x) => x.value === true ? '共享登录' : '单点登录',
  },
  {
    headerName: '过期策略',
    width: 90,
    align: 'center',
    field: 'expirePolicy',
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
    headerName: '性别',
    width: 70,
    align: 'center',
    field: 'userSex',
  },
  {
    headerName: '角色',
    width: 150,
    field: 'userRoles',
  },
  {
    headerName: '用户组',
    width: 150,
    field: 'userSets',
  },
  {
    headerName: '公司',
    width: 100,
    field: 'userParentGroups',
  },
  {
    headerName: '部门',
    width: 90,
    field: 'userGroups',
  },
  {
    headerName: '职位',
    width: 90,
    field: 'userPosts',
  },
  {
    headerName: '属性',
    width: 150,
    field: 'userTag',
    // cellRenderer: 'tagCellRenderer',
    cellRenderer: TagRenderer,
  },
  {
    headerName: '手机',
    width: 120,
    field: 'userMobile',
  },
  {
    headerName: '邮箱',
    width: 180,
    field: 'userEmail',
  },
  {
    headerName: '备注',
    width: 150,
    field: 'note',
  },
  {
    headerName: '创建日期',
    width: 160,
    field: 'createTime',
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
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [searchParam, setSearchParam] = useState({});

  const [disabledActive, setDisabledActive] = useState(true);
  const [disabledStop, setDisabledStop] = useState(true);
  const [disabledUnStop, setDisabledUnStop] = useState(true);


  const [groupTreeData, setGroupTreeData] = useState();
  const [groupIdValue, setGroupIdValue] = useState();
  const ref = useRef();

  const refresh = () => ref.current.refresh();

  // const [selectedKeys, setSelectedKeys] = useState([]);
  const [onChange, selectedKeys, setSelectedKeys] = useObservableAutoCallback((event) =>
    event.pipe(
      // debounceTime(300),
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

  // const onChange = (keys) => {
  //   console.log(keys);
  // }

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
  const search = (pageNo, pageSize, params) => {
    setSelectedKeys([]);
    // setSearchLoading(true);searchForm.getFieldValue()
    let param = { dto: params, pageNo: pageNo, pageSize: pageSize };
    api.user
      .searchUser(param)
      .subscribe({
        next: (data) => {
          console.log(data);
          setDataSource(data.data);
          setTotal(data.total);
        },
      })
      .add(() => {
        // setSearchLoading(false);
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

  const { offsetHeight } = window.document.getElementsByClassName("cala-body")[0]; //获取容器高度

  // 列表及弹窗
  return (
    <>
      <Spin spinning={searchLoading}>
        <XSearchForm
          searchName="businessUser_Search"
          form={searchForm}
          onReset={() => ref.current.refresh()}
          onSearch={(params) => {
            search(1, 50, params);
          }}
        // onHeightChange={(iheight) => setTableHight(iheight)}
        >
          {/* <Form.Item name="userRealCnName" label="中文名" labelCol={{ flex: '80px' }}>
                        <Input />
                    </Form.Item>
         <Form.Item name="userNo" label="账号名" labelCol={{ flex: '80px' }}>
                        <Input />
                    </Form.Item> */}
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
        </XSearchForm>
        <IAGrid
          gridName="businessUser_List"
          // searchName="businessUser_Search"
          ref={ref}
          title="用户列表"
          rowDragManaged={true}
          animateRows={true}
          height={offsetHeight - 150}
          defaultSearch={true}
          // components={{
          //   stateCellRenderer: StateRenderer,
          //   tagCellRenderer: TagRenderer,
          //   lockRenderer: LockRenderer
          // }}
          // columnsStorageKey="_cache_user_columns"
          columns={initColumns}
          request={(pageNo, pageSize) => search(pageNo, pageSize)}
          dataSource={dataSource}
          total={total}
          onSelectedChanged={onChange}
          onDoubleClick={(record) => onDoubleClick(record.id)}
          toolBarRender={[
            <Permit key="user:save" authority="user:save">
              <Button
                key="add"
                size="small"
                type="primary"
                shape="round"
                icon={<PlusOutlined />}
                onClick={() => onNewClick()}
              >
                新建
              </Button>
            </Permit>,
          ]}
          pageToolBarRender={[
            <Permit authority="user:active">
              <Tooltip title="演示环境，激活后密码为123456">
                <Button
                  key="active"
                  onClick={() => onActive(selectedKeys)}
                  disabled={disabledActive}
                  loading={loading}

                >
                  激活
                </Button>
              </Tooltip>
            </Permit>,
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
            </Permit>,
            <Permit authority="user:unstop">
              <Button
                danger
                key="unstop"
                onClick={() => onUnStop(selectedKeys)}
                disabled={disabledUnStop}
                loading={loading}
              >
                启用
              </Button>
            </Permit>,
            <Permit authority="user:delete">
              <Button
                danger
                key="delete"
                onClick={() => showDeleteConfirm('确定删除选中的用户吗?', () => onDelete(selectedKeys))}
              >
                删除
              </Button>
            </Permit>,
            <Permit authority="user:reset">
              <Tooltip title="演示环境，暂不支持该功能">
                <Button danger key="reset" disabled onClick={() => showOperationConfirm('重置密码后,新密码将发送到用户邮箱,确定重置选中用户密码吗？', () => onResetPasswd(selectedKeys))}>
                  重置密码
                </Button>
              </Tooltip>
            </Permit>
          ]}
          clearSelect={searchLoading}
        />
        {/* <IFooterToolbar visible={!isEmpty(selectedKeys)}>

        </IFooterToolbar> */}
      </Spin>
    </>
  );
};
