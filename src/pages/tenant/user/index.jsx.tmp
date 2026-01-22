import {
  IFooterToolbar,
  IFormItem,
  IGrid,
  IAGrid,
  IStatus,
  ITag,
  Permit,
  IGridSearch,
  ISearchTree
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
import { Form, message, Tooltip, Spin, Input, Row, Col, Tag, Button } from 'antd';
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
// let roles = [];
let userTags = [];
let pointTags = [];
// const roleSource = api.role.listAll();
const userTagSource = api.dict.listChildByParentCode(constant.DICT_TENANT_BUSINEESS_TAG);
const pointTagSource = api.dict.listChildByParentCode(constant.DICT_TENANT_POINT_TAG);
zip( userTagSource, pointTagSource)
  .pipe(
    map(([data1, data2]) => {
      // roles = data2Option('id', 'roleName', data1);

      userTags = data2Option('dictCode', 'dictName', data1);

      pointTags = data2Option('dictCode', 'dictName', data2);
    }),
  )
  .subscribe();

const StateRenderer = (props) => {
  return props.value && <IStatus value={props.value} state={userState} />;
};

const TagRenderer = (props) => {
  return (
    props.value ? (
      <ITag values={split(props.value)} options={userTags} multiColor={true} />
    ) : <span>-</span>
  );
};

const PointTagRenderer = (props) => {
  return (
    props.value ? (
      <ITag values={split(props.value)} options={pointTags} multiColor={true} />
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
const SuperTagRenderer = (props) => {
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
    headerName: '是否超管',
    width: 80,
    field: 'beSuper',
    align: 'center',
    cellRenderer: SuperTagRenderer
  },
  // {
  //   headerName: '登录模式',
  //   width: 90,
  //   align: 'center',
  //   field: 'beMultiLogin',
  //   valueFormatter: (x) => x.value === true ? '共享登录' : '单点登录',
  // },
  // {
  //   headerName: '过期策略',
  //   width: 90,
  //   align: 'center',
  //   field: 'expirePolicy',
  //   valueFormatter: (x) => {
  //     if (x.value === 'LAST_ACTIVE') {
  //       return '最后活跃';
  //     } else if (x.value === 'FIXED') {
  //       return '固定时间';
  //     }
  //     return '';
  //   }
  // },
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
    headerName: '属性',
    width: 150,
    field: 'userTag',
    // cellRenderer: 'tagCellRenderer',
    cellRenderer: TagRenderer,
  },
  {
    headerName: '登录终端',
    width: 220,
    field: 'pointTag',
    // cellRenderer: 'tagCellRenderer',
    cellRenderer: PointTagRenderer,
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
    headerName: '创建人',
    width: 90,
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
    width: 150,
    field: 'note',
  },
];

const userState = {
  UNACTIVE: { text: '未激活', status: 'Warning' },
  ACTIVE: { text: '启用', status: 'Success' },
  STOPPED: { text: '停用', status: 'Default' },
  LOCKED: { text: '锁定', status: 'Error' },
};
let cacheParam = {};
let cacheBeBindGroup = false;
let cachePageNo = 1;
let cachePageSize = 50;
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
    api.tgroup.treeAllGroupsAndUsers(props.tenantId).subscribe({
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
      switchMap((keys) => api.tuser.activeUser(keys)),
      tap(() => {
        message.success('操作成功!');
        search(cachePageNo, cachePageSize, cacheParam, cacheBeBindGroup);
      }),
      shareReplay(1),
    ],
    () => setLoading(false),
  );

  const [onStop] = useAutoObservableEvent(
    [
      tap(() => setLoading(true)),
      switchMap((keys) => api.tuser.stopUser(keys)),
      tap(() => {
        message.success('操作成功!');
        search(cachePageNo, cachePageSize, cacheParam, cacheBeBindGroup);
      }),
      shareReplay(1),
    ],
    () => setLoading(false),
  );

  const [onUnStop] = useAutoObservableEvent(
    [
      tap(() => setLoading(true)),
      switchMap((keys) => api.tuser.unstopUser(keys)),
      tap(() => {
        message.success('操作成功!');
        search(cachePageNo, cachePageSize, cacheParam, cacheBeBindGroup);
      }),
      shareReplay(1),
    ],
    () => setLoading(false),
  );

  const onDelete = (keys) => {
    setLoading(true);
    api.tuser.deleteUser({ids:keys,tenantId:props.tenantId}).subscribe({
      next: (res) => {
        message.success('操作成功!');
        search(cachePageNo, cachePageSize, cacheParam, cacheBeBindGroup);
      },
    }).add(() => setLoading(false))
  }
  // const [onDelete] = useAutoObservableEvent(
  //   [
  //     tap(() => setLoading(true)),
  //     switchMap((keys) => api.tuser.deleteUser(keys)),
  //     tap(() => {
  //       message.success('操作成功!');
  //       search(cachePageNo, cachePageSize, cacheParam, cacheBeBindGroup);
  //     }),
  //     shareReplay(1),
  //   ],
  //   () => setLoading(false),
  // );

  const [onResetPasswd] = useAutoObservableEvent(
    [
      tap(() => setLoading(true)),
      switchMap((keys) => api.tuser.resetUserPasswd(keys)),
      tap(() => {
        message.success('重置密码成功, 请到对应邮箱查看新密码!');
        search(cachePageNo, cachePageSize, cacheParam, cacheBeBindGroup);
      }),
      shareReplay(1),
    ],
    () => setLoading(false),
  );

  //查询
  const search = (pageNo, pageSize, params, beBindGroup) => {
    setSelectedKeys([]);
    params = params || {};
    // setSearchLoading(true);searchForm.getFieldValue()
    let param = { dto: params, pageNo: pageNo, pageSize: pageSize };
    if (beBindGroup === true) {
      params.groupId = selectedGroupId || '';
    }
    params.tenantId = props.tenantId;
    cacheBeBindGroup = beBindGroup;
    cacheParam = params;
    cachePageNo = pageNo;
    cachePageSize = pageSize;
    api.tuser
      .searchUser(param)
      .subscribe({
        next: (data) => {
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
      url: '/new/tuser/ADD_' + props.tenantId,
      title: '新建用户',
      width: 700,
      height: 600,
      callback: () => search(cachePageNo, cachePageSize, cacheParam, cacheBeBindGroup)
    })
  };

  const onDoubleClick = (id) => {
    INewWindow({
      url: '/new/tuser/' + id + "_" + props.tenantId,
      title: '编辑用户',
      width: 700,
      height: 600,
      callback: () => search(cachePageNo, cachePageSize, cacheParam, cacheBeBindGroup)
    })
  }

  const treeAllGroups = () => {
    api.tgroup.treeAllGroups(props.tenantId).subscribe({
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
            bodyStyle={{ height: offsetHeight - 105, overflow: 'auto' }}
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
              // gridName="perm_user_list"
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
