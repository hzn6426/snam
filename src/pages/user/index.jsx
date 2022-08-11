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
  pluck,
  isEmpty,
  beHasRowsPropNotEqual,
} from '@/common/utils';
import {
  IFormItem,
  IGrid,
  ISearchForm,
  IStatus,
  ITag,
  IIF,
  Permit,
  IFooterToolbar,
} from '@/common/components';
// import IGrid from '@/components/IGrid';
// import ISearchForm from '@/components/ISearchForm';
// import IStatus from '@/components/IStatus';
// import ITag from '@/components/ITag';
// import IIF from '@/components/IIF';
// import Permit from '@/components/Permit';
import { Form, Button, message } from 'antd';
import {
  concatMap,
  debounceTime,
  distinctUntilChanged,
  exhaustMap,
  filter,
  map,
  shareReplay,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { of, zip } from 'rxjs';
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
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [disabledActive, setDisabledActive] = useState(true);
  const [disabledStop, setDisabledStop] = useState(true);
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
      filter(([keys]) => !isEmpty(keys)),
      switchMap(([keys, ref]) => api.user.activeUser(keys)),
      tap(() => refresh()),
    ],
    () => setLoading(false),
  );

  const [onStop] = useAutoObservableEvent(
    [
      tap(() => setLoading(true)),
      filter((keys) => !isEmpty(keys)),
      switchMap((keys) => api.user.stopUser(keys)),
      tap(() => refresh()),
    ],
    () => setLoading(false),
  );

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
    // setPageNo(pageNo);
    // setPageSize(pageSize);
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
        // onDoubleClick={(data) => onDoubleClicked(data)}
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
    </>
  );
};
