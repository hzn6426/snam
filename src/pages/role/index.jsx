import { showDeleteConfirm } from '@/common/antd';
import {
  IFooterToolbar,
  IFormItem,
  IGrid,
  ISearchForm,
  IStatus
} from '@/common/components';
import {
  INewWindow,
  api,
  beHasRowsPropNotEqual,
  isEmpty,
  pluck,
  state2Option,
  useAutoObservableEvent,
  useObservableAutoCallback
} from '@/common/utils';
import {
  PlusOutlined
} from '@ant-design/icons';
import { Button, Form, message } from 'antd';
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


const StateRenderer = (props) => {
  return props.value && <IStatus value={props.value} state={roleState} />;
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
    title: '角色名称',
    width: 100,
    dataIndex: 'roleName',
  },
  {
    title: '用户组',
    width: 140,
    align: 'center',
    dataIndex: 'usetNames',
  },
  {
    title: '职位',
    width: 140,
    align: 'center',
    dataIndex: 'postNames',
  },
  {
    title: '备注',
    width: 100,
    dataIndex: 'note',
  }
];


export default (props) => {
  const [searchForm] = Form.useForm();
  // const [selectedKeys, setSelectedKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [disabledActive, setDisabledActive] = useState(true);
  const [disabledStop, setDisabledStop] = useState(true);

  const [modalItem, setModalItem] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [roleModalItem, setRoleModalItem] = useState({});
  const [roleModalVisible, setRoleModalVisible] = useState(false);

  const [userPerms, setUserPerms] = useState([]);
  // 分配用户窗口中树的数据
  const [treeData, setTreeData] = useState([]);
  // 根据菜单ID获取对应的按钮列表
  const [menuId, setMenuId] = useState();
  const [menuName, setMenuName] = useState();
  // 分配的按钮数据
  const [permButtons, setPermButtons] = useState({});
  const [groupButtons, setGroupButtons] = useState({});
  const [searchValue, setSearchValue] = useState({});
  const [current, setCurrent] = useState({});
  // 自动展开父节点的状态
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  // 展开的树节点key
  const [expandedKeys, setExpandedKeys] = useState([]);
  const onExpand = (keys) => {
    setExpandedKeys(keys);
    setAutoExpandParent(false);
  };

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
      switchMap((keys) => api.role.activeRole(keys)),
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
      switchMap((keys) => api.role.stopRole(keys)),
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
      switchMap((keys) => api.role.deleteRole(keys)),
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
      url: '/new/role/' + id,
      title: '编辑角色',
      width: 600,
      height: 300,
      callback: () => refresh()
    })),
  ]);

  const onNewClick = () => {
    INewWindow({
      url: '/new/role/ADD',
      title: '新建角色',
      width: 600,
      height: 300,
      callback: () => refresh()
    })
  };

  const onAssignUser = (roleId) => {
    INewWindow({
      url: '/new/role/assignUser/' + roleId,
      title: '分配用户',
      width: 700,
      height: 600,
      callback: () => refresh()
    })
  };

  const [onResourceClick] = useAutoObservableEvent([
    tap((id) => INewWindow({
      url: '/new/role/resource/' + id,
      title: '角色授权',
      width: 1000,
      height: 700,
      callback: () => refresh()
    })),
  ]);


  //查询
  const search = (pageNo, pageSize) => {
    setSelectedKeys([]);
    setSearchLoading(true);
    let param = { dto: searchForm.getFieldValue(), pageNo: pageNo, pageSize: pageSize };
    api.role.searchRole(param).subscribe({
      next: (data) => {
        setDataSource(data.data);
        setTotal(data.total);
      },
    })
      .add(() => {
        setSearchLoading(false);
      });
  };


  // 列表及弹窗
  return (
    <>
      <ISearchForm
        form={searchForm}
        onReset={() => ref.current.refresh()}
        onSearch={() => ref.current.refresh()}
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
      </ISearchForm>

      <IGrid
        ref={ref}
        title="角色列表"
        // height={tableHight}
        components={{
          stateCellRenderer: StateRenderer,
        }}
        // columnsStorageKey="_cache_role_columns"
        initColumns={initColumns}
        request={(pageNo, pageSize) => search(pageNo, pageSize)}
        dataSource={dataSource}
        // pageNo={pageNo}
        // pageSize={pageSize}
        total={total}
        onSelectedChanged={onChange}
        onDoubleClick={(record) => onDoubleClick(record.id)}
        toolBarRender={[
          <Button
            key="add"
            size="small"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => onNewClick()}
          >
            新建
          </Button>,

        ]}
        // onClick={(data) => onClicked(data)}
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
          type="danger"
          key="delete"
          onClick={() => showDeleteConfirm('确定删除选中的角色吗?', () => onDelete(selectedKeys))}
        >
          删除
        </Button>
        <Button type="primary" key="saveFromRole" onClick={() => onAssignUser(selectedKeys[selectedKeys.length - 1])}>
          添加用户
        </Button>
        <Button
          key="grant"
          onClick={() => { onResourceClick(selectedKeys[selectedKeys.length - 1]) }}
        >
          角色授权
        </Button>

      </IFooterToolbar>
    </>
  );
};
