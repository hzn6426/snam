import {
  IFooterToolbar,
  IFormItem,
  IGrid,
  IAGrid,
  ISearchForm,
  // XSearchForm,
  IStatus,
  ITag,
  Permit,
  IGridSearch,
  ISearchTree
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
  useObservableAutoCallback,
  forEach,
  copyObject,
} from '@/common/utils';
import { useEffect, useRef, useState } from 'react';
// import IGrid from '@/components/IGrid';
// import ISearchForm from '@/components/ISearchForm';
// import IStatus from '@/components/IStatus';
// import ITag from '@/components/ITag';
// import IIF from '@/components/IIF';
// import Permit from '@/components/Permit';
import { showDeleteConfirm, showOperationConfirm } from '@/common/antd';
import {
  RestOutlined, ApiOutlined, LockTwoTone, UnlockTwoTone, UserOutlined, ApartmentOutlined, DiffOutlined, HistoryOutlined,
  AimOutlined, FundViewOutlined, KeyOutlined, SunOutlined, EyeOutlined
} from '@ant-design/icons';
import { Form, message, Tooltip, Spin, Input, Row, Col, Divider, Button } from 'antd';
import { IButton } from '@/common/components';
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
import { on } from 'ramda';
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
    width: 60,
    textAlign: 'center',
    field: 'state',
    // cellRenderer: 'stateCellRenderer',
    cellRenderer: StateRenderer,
  },
  {
    headerName: '锁定',
    width: 60,
    field: 'beLock',
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
  const [pageSize, setPageSize] = useState(50);
  const [searchParam, setSearchParam] = useState({});

  const [disabledActive, setDisabledActive] = useState(true);
  const [disabledStop, setDisabledStop] = useState(true);
  const [disabledUnStop, setDisabledUnStop] = useState(true);


  const [groupTreeData, setGroupTreeData] = useState();
  const [groupIdValue, setGroupIdValue] = useState();
  const [treeData, setTreeData] = useState([]);
  // 选中的组织ID
  const [selectedGroupId, setSelectedGroupId] = useState();
  // 选中的组织名称
  const [selectedGroupName, setSelectedGroupName] = useState();
  const ref = useRef();

  const refresh = () => ref.current.refresh();

  // 将组织设置为不可选
  const loopGroup = (data) => {
    forEach((v) => {
      // 节点是组织不允许修改
      if (v.tag && v.tag === 'GROUP') {
        copyObject(v, { icon: <ApartmentOutlined /> });
      } else {
        copyObject(v, {
          selectable: false,
          disableCheckbox: true, icon: <UserOutlined style={{ color: '#52c41a' }} />
        });
      }
      if (v.children && !isEmpty(v.children)) {
        loopGroup(v.children);
      }
    }, data);
  };

  //查询
  const loadGroup = () => {
    api.group.treeAllGroupsAndUsers().subscribe({
      next: (data) => {
        setTreeData(data);
      },
    });
  };

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
  const search = (pageNo, pageSize, params, beBindGroup) => {
    setSelectedKeys([]);
    // setSearchLoading(true);searchForm.getFieldValue()
    let param = { dto: params, pageNo: pageNo, pageSize: pageSize };
    if (beBindGroup === true) {
      params.groupId = selectedGroupId || '';
    }
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

  const onPrivilegeClick = (id) => {
    if (selectedKeys.length !== 1) {
      message.error('只能选择一条用户数据！');
      return;
    }
    if (!selectedGroupId) {
      message.error('必须选中一个组织！');
      return;
    }
    INewWindow({
      url: '/new/user/privilege/' + (id + "_" + selectedGroupId),
      title: '用户权限',
      width: 1280,
      height: 850,
      callback: () => refresh()
    });
  }

  const onResourceClick = (id) => {
    if (selectedKeys.length !== 1) {
      message.error('只能选择一条用户数据！');
      return;
    }
    if (!selectedGroupId) {
      message.error('必须选中一个组织！');
      return;
    }
    INewWindow({
      url: '/new/user/resource/' + (id + "_" + selectedGroupId),
      title: '用户授权',
      width: 1000,
      height: 700,
      callback: () => refresh()
    });
  }

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
    loadGroup();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      search(1, pageSize, searchForm.getFieldsValue(), true);
    }
  }, [selectedGroupId]);

  const { offsetHeight } = window.document.getElementsByClassName("cala-body")[0]; //获取容器高度

  // 列表及弹窗
  return (
    <>
      <Row >
        <Col span={6}>
          <ISearchTree
            iconRender={loopGroup}
            treeData={treeData}
            placeholder="输入组织或人员进行搜索"
            checkable={false}
            blockNode={true}
            bodyStyle={{ height: offsetHeight - 105, overflow: 'scroll' }}
            titleRender={(node) => (
              <div style={{ width: '100%' }}>
                <div style={{ float: 'left' }}>
                  {node.icon} {node.title}
                </div>
              </div>
            )}
            onSelect={(keys, { selected, node }) => {
              if (selected) {
                setSelectedGroupId(keys[0]);
                setSelectedGroupName(node.text);
              }
            }}
          />

        </Col>
        <Col span={18}>
      <Spin spinning={searchLoading}>
            {/* <XSearchForm
          searchName="businessUser_Search"
          form={searchForm}
          span={6}
          onReset={() => ref.current.refresh()}
          onSearch={(params) => {
            search(1, 50, params);
          }}
        // onHeightChange={(iheight) => setTableHight(iheight)}
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
          <IFormItem name="groupState" label="部门" xtype="select" options={[{label:'全部',value:'ALL'}
            ,{label:'未分配',value:'UNASSIGNED'},{label:'已分配',value:'ASSIGNED'}]} />
          <IFormItem name="roleName" label="角色" xtype="input" />
          <IFormItem name="postName" label="职位" xtype="input" />
        </XSearchForm> */}
        <IAGrid
              gridName="perm_user_list"
          // searchName="businessUser_Search"
          ref={ref}
          title="用户列表"
          rowDragManaged={true}
          animateRows={true}
              height={offsetHeight - 66}
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
              pageNo={pageNo}
              pageSize={pageSize}
          onSelectedChanged={onChange}
          onDoubleClick={(record) => onDoubleClick(record.id)}
          toolBarRender={[
            <IGridSearch defaultValue={'userName'} onSearch={(params) => search(1, pageSize, params)}
              options={[{ label: '用户名', value: 'userName' }, { label: '中文名', value: 'userRealCnName' },
              { label: '属性', value: 'userTag', xtype: "select", valueOptions: { userTags } },
              { label: '手机', value: 'userMobile' }, { label: '角色', value: 'roleName' }, { label: '职位', value: 'postName' }]}
              width={150} />,
            // <Select defaultValue={'userName'} size="small" options={[{ label: '用户名', value: 'userName' }, { label: '中文名', value: 'userRealCnName' }]} />,
            // <Input.Search
            //   style={{ width: 150, marginRight: '5px' }}
            //   onSearch={(value) => setColumnSearchValue(value)}
            //   size="small" key="columnSearch"
            //   enterButton
            //   placeholder='搜索' allowClear />,
            <Permit key="user:save" authority="user:save">
              <Button
                key="add"
                size="small"
                type="default" iconPosition="end"
                // type="primary"
                icon={<DiffOutlined />}
                onClick={() => onNewClick()}
              >

              </Button>
            </Permit>,
          ]}
          pageToolBarRender={[
            <Permit authority="user:active">
              <Tooltip>
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
              </Tooltip>
            </Permit>,
            <Permit authority="user:unstop">
              <IButton
                size='small'
                key="unstop"
                onClick={() => onUnStop(selectedKeys)}
                disabled={disabledUnStop}
                loading={loading}
                type="warning"
                icon={<SunOutlined />}
              >
                启用
              </IButton>
            </Permit>,
            <Permit authority="user:stop">
              <IButton
                size='small'
                key="stop"
                // style={{ paddingLeft: 2, paddingRight: 2 }}
                type="warning"
                icon={< ApiOutlined />}
                onClick={() => onStop(selectedKeys)}
                disabled={disabledStop}
                loading={loading}
              >
                停用
              </IButton>
            </Permit>,
            <Permit authority="user:delete">
              <IButton
                danger
                size='small'
                type="primary"
                icon={<RestOutlined />}
                key="delete"
                onClick={() => showDeleteConfirm('确定删除选中的用户吗?', () => onDelete(selectedKeys))}
              >
                删除
              </IButton>
            </Permit>,
            <Permit authority="user:reset">
              <Tooltip title="演示环境，该功能暂时不可用！">
                <IButton
                  danger
                  size='small'
                  key="reset"
                  type="primary"
                  disabled
                  icon={< HistoryOutlined />}
                  onClick={() => showOperationConfirm('重置密码后,新密码将发送到用户邮箱,确定重置选中用户密码吗？', () => onResetPasswd(selectedKeys))}>
                  重置密码
                </IButton>
              </Tooltip>
            </Permit>,
            <Permit authority="user:saveMenuPerm">
              <IButton
                type="success"
                size='small'
                key="saveMenuPerm"
                icon={<KeyOutlined />}
                onClick={() => onResourceClick(selectedKeys[selectedKeys.length - 1])}
              >
                授权
              </IButton>
            </Permit>,
            <Permit authority="user:listPermMenusAndButtons">
              <IButton
                type="info"
                size='small'
                key="listPermMenusAndButtons"
                onClick={() => onPrivilegeClick(selectedKeys[selectedKeys.length - 1])}
                icon={<EyeOutlined />}
              >
                权限
              </IButton>
            </Permit>,

          ]}
          clearSelect={searchLoading}
        />
        {/* <IFooterToolbar visible={!isEmpty(selectedKeys)}>

        </IFooterToolbar> */}
      </Spin>
        </Col>
      </Row>
    </>
  );
};
