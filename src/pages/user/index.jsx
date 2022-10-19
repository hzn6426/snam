import React, { useState, useRef } from 'react';
import {
  api,
  dateFormat,
  constant,
  state2Option,
  data2Option,
  split,
  useObservableAutoCallback,
  useAutoObservableEvent,
  useObservableAutoState,
  pluck,
  isEmpty,
  beHasRowsPropNotEqual,
  isArray,
  join,
} from '@/common/utils';
import {
  IFormItem,
  IGrid,
  ISearchForm,
  IStatus,
  ITag,
  IModal,
  Permit,
  IFooterToolbar,
  ILayout,
} from '@/common/components';
// import IGrid from '@/components/IGrid';
// import ISearchForm from '@/components/ISearchForm';
// import IStatus from '@/components/IStatus';
// import ITag from '@/components/ITag';
// import IIF from '@/components/IIF';
// import Permit from '@/components/Permit';
import { showDeleteConfirm } from '@/common/antd';
import { Form, Button, Modal, message } from 'antd';
import {
  concatMap,
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  filter,
  map,
  mergeMap,
  shareReplay,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { of, zip, EMPTY } from 'rxjs';
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
    props.value && (
      <ITag values={split(props.value)} options={userTags} multiColor={false} noColor={true} />
    )
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
    title: '账号',
    width: 120,
    dataIndex: 'userName',
  },
  {
    title: '姓名',
    width: 100,
    dataIndex: 'userRealCnName',
  },
  {
    title: '性别',
    width: 70,
    dataIndex: 'userSex',
  },
  {
    title: '角色',
    width: 150,
    dataIndex: 'userRoles',
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
  // const [selectedKeys, setSelectedKeys] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useObservableAutoState(false);
  const [total, setTotal] = useState(0);

  const [disabledActive, setDisabledActive] = useState(true);
  const [disabledStop, setDisabledStop] = useState(true);

  const [modalItem, setModalItem] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const ref = useRef();

  const refresh = () => ref.current.refresh();
  // const [pageNo, setPageNo] = useState(1);
  // const [pageSize, setPageSize] = useState(50);
  // const { clientHeight } = window?.document?.documentElement;
  // const tableHight = clientHeight - 252;

  const [onChange, selectedKeys, setSelectedKeys] = useObservableAutoCallback((event) =>
    event.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap((keys) => {
        setDisabledActive(beHasRowsPropNotEqual('state', 'UNACTIVE', keys));
        setDisabledStop(beHasRowsPropNotEqual('state', 'ACTIVE', keys));
      }),
      switchMap((v) => of(pluck('id', v))),
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
    ],
    () => setLoading(false),
  );

  const [onDoubleClick] = useAutoObservableEvent([
    switchMap((id) => api.user.getUser(id)),
    map((data) => {
      const user = data[0];
      if (user && user.userTag) {
        user.userTag = split(user.userTag);
      }
      return user;
    }),
    tap((data) => {
      setModalVisible(true);
      setModalItem(data);
    }),
  ]);

  const [onSaveClick] = useAutoObservableEvent([
    map((user) => {
      if (isArray(user.userTag)) {
        user.userTag = join(',', user.userTag);
      }
      return user;
    }),
    switchMap((user) => api.user.saveOrUpdateUser(user)),
    tap(() => {
      setModalVisible(false);
      message.success('操作成功!');
      refresh();
    }),
  ]);
  // const [onStop] = useObservableAutoCallback(
  //   (event) =>
  //     event.pipe(
  //       debounceTime(300),
  //       distinctUntilChanged(),
  //       tap(() => setLoading(true)),
  //       filter(([keys, ref]) => !isEmpty(keys)),
  //       switchMap(([keys, ref]) =>
  //         api.user.stopUser(keys).pipe(
  //           tap(() => {
  //             ref.refresh();
  //           }),
  //           shareReplay(1),
  //         ),
  //       ),
  //     ),
  //   () => setLoading(false),
  // );

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

  // 列表及弹窗
  return (
    <>
      <ISearchForm
        form={searchForm}
        onReset={() => ref.current.refresh()}
        onSearch={() => ref.current.refresh()}
      >
        <IFormItem name="userName" label="用户名" xtype="input" />
        <IFormItem name="userRealCnName" label="姓名" xtype="input" />
        <IFormItem name="userRoles" label="角色" xtype="select" options={roles} />
        <IFormItem name="userTag" label="属性" xtype="select" options={userTags} />
        <IFormItem name="userMobile" label="手机" xtype="input" />
        <IFormItem
          name="states"
          label="状态"
          xtype="select"
          options={() => state2Option(userState)}
        />
      </ISearchForm>

      <IGrid
        ref={ref}
        title="用户列表"
        // height={tableHight}
        components={{
          stateCellRenderer: StateRenderer,
          tagCellRenderer: TagRenderer,
        }}
        // columnsStorageKey="_cache_user_columns"
        initColumns={initColumns}
        request={(pageNo, pageSize) => search(pageNo, pageSize)}
        dataSource={dataSource}
        // pageNo={pageNo}
        // pageSize={pageSize}
        total={total}
        onSelectedChanged={onChange}
        onDoubleClick={(record) => onDoubleClick(record.id)}
        // onClick={(data) => onClicked(data)}
        clearSelect={searchLoading}
      />
      <IFooterToolbar visible={!isEmpty(selectedKeys)}>
        <Permit authority="user:active">
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
        </Permit>
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
      {/* )} */}
      <IModal
        current={modalItem}
        title={modalItem && modalItem.id ? '编辑用户' : '新建用户'}
        width="800px"
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
        }}
        onSubmit={(item) => onSaveClick(item)}
      >
        <IFormItem xtype="id" />
        <ILayout type="hbox" spans="12 12">
          <IFormItem
            disabled={modalItem && modalItem.id}
            name="userName"
            label="账号"
            xtype="input"
            tooltip="最长为20位,保存后不可更改"
            rules={[{ required: true, message: '请输入账号', max: 20 }]}
          />
        </ILayout>
        <ILayout type="hbox" spans="12 12">
          <IFormItem name="userRealCnName" label="中文名" xtype="input" required={true} max={20} />
          <IFormItem name="userRealEnName" label="英文名" xtype="input" required={true} max={20} />
        </ILayout>
        <ILayout type="hbox" spans="24">
          <IFormItem
            name="userSex"
            label="性别"
            initialValue="男"
            required={true}
            options={[
              {
                label: '男',
                value: '男',
              },
              {
                label: '女',
                value: '女',
              },
              {
                label: '保密',
                value: '保密',
              },
            ]}
            xtype="radio"
          />
        </ILayout>
        <ILayout type="hbox" spans="12 12">
          <IFormItem
            name="userMobile"
            label="手机"
            xtype="input"
            required={true}
            max={20}
            regexp="/^1[3456789]d{9}$/"
          />

          <IFormItem
            name="userEmail"
            label="邮箱"
            xtype="input"
            tooltip="激活后密码将发送到该邮箱"
            required={true}
            max={50}
            ruleType="email"
          />
        </ILayout>
        {/* <ILayout type="hbox" spans="12 12">
          <IFormItem name="qq" label="QQ" xtype="input" max={20} />
        </ILayout> */}
        <ILayout type="hbox" spans="24">
          <IFormItem
            name="userTag"
            label="用户属性"
            xtype="checkbox"
            required={true}
            ruleType="array"
            options={userTags}
          />
        </ILayout>
        <ILayout type="hbox" spans="24">
          <IFormItem
            name="note"
            label="备注说明"
            xtype="textarea"
            max={100}
            autoSize={{ minRows: 4, maxRows: 6 }}
          />
        </ILayout>
      </IModal>
    </>
  );
};
