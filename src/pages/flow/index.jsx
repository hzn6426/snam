import React, { useState, useRef, useEffect, use } from 'react';
import {
    api,
    dateFormat,
    constant,
    state2Option,
    data2Option,
    split,
    useObservableAutoCallback,
    pluck,
    isEmpty,
    beHasRowsPropNotEqual,
    isArray,
    join,
    INewWindow,
    forEach
} from '@/common/utils';
import {
    IFormItem,
    IAGrid,
    IStatus,
    ITag,
    Permit,
    IFooterToolbar,
    ILayout,
    IButton,
    IGridSearch,
    IIF
} from '@/common/components';
import { showDeleteConfirm } from '@/common/antd';
import { Form, Button, Tag, message, Splitter, Input, Tooltip, Card, Space } from 'antd';
import defaultSettings from '../../../config/defaultSettings';
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
import { of, zip, EMPTY, from } from 'rxjs';
import {
    PlusOutlined, LockTwoTone, UnlockTwoTone, DiffOutlined, SunOutlined,
    ApiOutlined,
    EyeOutlined,
    PlayCircleOutlined,
    AuditOutlined,
    SafetyOutlined,
    FormOutlined,
    DoubleLeftOutlined
} from '@ant-design/icons';
import  UFlow from '@ifrog/uflow'
import "@ifrog/uflow/dist/uflow.css"
import data from "../../../data.json";
// import "uflow.css"

const TaskMode = {
    FILL:'发起任务',
    AUDIT:'审核任务'
}

const userState = {
    ACTIVE: { text: '启用', status: 'Success' },
    STOPPED: { text: '停用', status: 'Default' },
};

const executeState = {
    PROCESS: { text: '审核', status: 'Success' },
    REJECT: { text: '驳回', status: 'Error' },
};

const StateRenderer = (props) => {
    return props.value && <IStatus value={props.value} state={userState} />;
};

const ExeCuteRenderer = (props) => {
    return props.value && <IStatus value={props.value} state={executeState} />;
};
//组件
const LockRenderer = (props) => {
    return props.value ? (
      <LockTwoTone twoToneColor="#FF0000" />
    ) : (
      <UnlockTwoTone twoToneColor="#52c41a" />
    );
  };


const childColumns = [
    // {
    //     headerName: '序号',
    //     textAlign: 'center',
    //     checkboxSelection: true,
    //     headerCheckboxSelection: true,
    //     lockPosition: 'left',
    //     width: 80,
    //     cellStyle: { userSelect: 'none' },
    //     valueFormatter: (params) => {
    //         return `${parseInt(params.node.id) + 1}`;
    //     },
    //     // rowDrag: true,
    // },
    {
        headerName: '流程名称',
        width: 100,
        align: 'left',
        field: 'name',
    },
    // {
    //     headerName: '业务关联',
    //     width: 90,
    //     align: 'left',
    //     field: 'businessKey',
    // },
    {
        headerName: '流程版本',
        width: 80,
        align: 'left',
        field: 'flowVersion',
    },
     {
        headerName: '发起人',
        width: 70,
        align: 'left',
        field: 'createUserCnName',
    },
    {
        headerName: '开始时间',
        width: 110,
        field: 'createTime',
        valueFormatter: (x) => dateFormat(x.value, 'yyyy-MM-dd hh:mm:ss'),
    },
];

const taskColumns = [
    // {
    //     headerName: '序号',
    //     textAlign: 'center',
    //     checkboxSelection: true,
    //     headerCheckboxSelection: true,
    //     lockPosition: 'left',
    //     width: 80,
    //     cellStyle: { userSelect: 'none' },
    //     valueFormatter: (params) => {
    //         return `${parseInt(params.node.id) + 1}`;
    //     },
    //     // rowDrag: true,
    // },
    {
        headerName: '任务名称',
        width: 100,
        align: 'left',
        field: 'name',
    },
    {
        headerName: '类型',
        width: 70,
        align: 'left',
        field: 'model',
        valueFormatter: (x) => TaskMode[x.value],
    },
    
    
    
];

const trackColumns = [
    // {
    //     headerName: '序号',
    //     textAlign: 'center',
    //     checkboxSelection: true,
    //     headerCheckboxSelection: true,
    //     lockPosition: 'left',
    //     width: 80,
    //     cellStyle: { userSelect: 'none' },
    //     valueFormatter: (params) => {
    //         return `${parseInt(params.node.id) + 1}`;
    //     },
    //     // rowDrag: true,
    // },
    {
        headerName: '序号',
        width: 70,
        align: 'left',
        field: 'level',
    },
    {
        headerName: '执行人',
        width: 80,
        field: 'actor',
    },
    {
        headerName: '节点',
        width: 100,
        field: 'node',
    },
    {
        headerName: '类型',
        width: 80,
        field: 'executeType',
        cellRenderer: ExeCuteRenderer,
    },
    {
        headerName: '执行路径',
        width: 80,
        field: 'path',
        cellRenderer: (props) => {
           const record = props.data;
           const sources = record.sources || [];
           const targets = record.targets || [];
           const s = sources.join(',');
           const t = targets.join(',');
           return <span>({s}) -&gt; {t} </span>
        },
    },
    {
        headerName: '执行时间',
        width: 110,
        field: 'executeTime',
        valueFormatter: (x) => dateFormat(x.value, 'yyyy-MM-dd hh:mm:ss'),
    },
    
];

export default (props) => {

    const OperateRenderer = (props) => {
    const record = props.data;

    return <Tag size="small" loading={openLoading} color="var(--antd-primary-color)" style={{ width: 85, cursor: 'pointer' }} icon={<EyeOutlined title='流程设计' />} onClick={(e) => {
      e.stopPropagation();
      setOpenLoading(true);
      api.flow.getFlowChart(record.id).subscribe({
        next: (data) => { 
          setChartData(data[0].data);
        },
      }).add(() => setOpenLoading(false))
      // setCurrentFlow({id:record.id, name: record.name,flowVersion: record.flowVersion})
      // window.location.href = "/?ruleId=" + record.id;
      //   history.push('/business/ruleEditor/' + record.id + "?tabTitle=" + record.ruleName + "_" + record.ruleVersion);
    }} >预览流程</Tag>
  }
    //列初始化
const parentColumns = [
    // {
    //     headerName: '序号',
    //     textAlign: 'center',
    //     checkboxSelection: true,
    //     headerCheckboxSelection: true,
    //     lockPosition: 'left',
    //     width: 80,
    //     cellStyle: { userSelect: 'none' },
    //     valueFormatter: (params) => {
    //         return `${parseInt(params.node.id) + 1}`;
    //     },
    //     // rowDrag: true,
    // },
    {
        headerName: '状态',
        width: 70,
        field: 'state',
        cellRenderer: StateRenderer,
    },
    {
        headerName: '流程名称',
        width: 100,
        align: 'left',
        field: 'name',
    },
    {
        headerName: '版本',
        width: 70,
        align: 'left',
        field: 'flowVersion',
    },
    {
      headerName: '操作',
      width: 110,
      field: 'operate',
      cellRenderer: OperateRenderer
    },
];

    const [searchParentForm] = Form.useForm();

    const [settings, setSettings] = useState(localStorage.getItem("settings") == null ? defaultSettings : JSON.parse(localStorage.getItem("settings")));
    // const [selectedKeys, setSelectedKeys] = useState([]);
    const [parentDataSource, setParentDataSource] = useState([]);
    const [childDataSource, setChildDataSource] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [executingLoading, setExecutingLoading] = useState(false);
    const [parentTotal, setParentTotal] = useState(0);
    const [childTotal, setChildTotal] = useState(0);
    const [openLoading, setOpenLoading] = useState(false);

    const [chartData, setChartData] = useState(data);

    const { offsetHeight } = window.document.getElementsByClassName("cala-body")[0]; //获取容器高度

    const [topHeight, setTopHeight] = useState(offsetHeight - 420);
    const [bottomHeight, setBottomHeight] = useState(420);

    const [taskDataSource, setTaskDataSource] = useState([]);

    const [selectedInstanceId, setSelectedInstanceId] = useState(null);

    const [elements, setElements] = useState([]);

    const [current, setCurrent] = useState({});

    const [form] = Form.useForm();

    const [beComplete, setBeComplete] = useState(false);

    const [trackDataSource, setTrackDataSource] = useState([]);

    const [theme, setTheme] = useState(settings.navTheme == 'light' ? 'light' : 'dark')



    const parentRef = useRef();
    const childRef = useRef();


    const refreshParent = () => parentRef.current.refresh();
    const refreshChild = (params) => childRef.current.refresh(params);

    const doExecute = () => {
        form.validateFields().then(values => {
            if (!values.instanceId) {
                values.instanceId = selectedInstanceId;
            }
            if (!values.instanceId) {
                message.error("请选择一个实例!");
                return;
            }
            setExecutingLoading(true);
            api.flow.executeFlow(values).subscribe({
                next: (res) => { 
                    message.success('操作成功');
                    onChildClick(values.instanceId);
                    loadExecutingTask(values.instanceId);
                    setElements([]);
                    setCurrent({});
                },
            }).add(() => setExecutingLoading(false));
        });
    };

    const doReject = () => {
        form.validateFields().then(values => {
            if (!values.instanceId) {
                values.instanceId = selectedInstanceId;
            }
            if (!values.instanceId) {
                message.error("请选择一个实例!");
                return;
            }
            setExecutingLoading(true);
            api.flow.rejectFlow(values).subscribe({
                next: (res) => { 
                    message.success('操作成功');
                    onChildClick(values.instanceId);
                    loadExecutingTask(values.instanceId);
                    setElements([]);
                    setCurrent({});
                },
            }).add(() => setExecutingLoading(false));
        });
    };

    const doSubmit = () => {
        form.validateFields().then(values => {
            setExecutingLoading(true);
            api.flow.executeFlow(values).subscribe({
                next: (res) => { 
                    message.success('提交成功');
                    onChildClick(values.instanceId);
                    loadExecutingTask(values.instanceId);
                    setElements([]);
                    setCurrent({});
                },
            }).add(() => setExecutingLoading(false))
        });
    };

    const [onParentChange, selectedParentKeys, setSelectedParentKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            // debounceTime(300),
            distinctUntilChanged(),
            // tap((v) => {
            //     setDisabledActive(beHasRowsPropNotEqual('state', 'STOPPED', v));
            //     setDisabledStop(beHasRowsPropNotEqual('state', 'ACTIVE', v));
            // }),
            map((v) => {
                return pluck('id', v)
            }),
            tap((v) => refreshChild(v[v.length - 1])),
            shareReplay(1),
        )
    );


    const [onChildChange, selectedChildKeys, setSelectedChildKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((v) => of(pluck('id', v))),
            tap((v) => setSelectedInstanceId(v[v.length - 1])),
            shareReplay(1),
        ),
    );

    const [onTaskChange, selectedTaskKeys, setSelectedTaskKeys] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap((v) => of(pluck('id', v))),
             shareReplay(1),
        ),
    );

    useEffect(() => {
        form.resetFields();
        if (current && !isEmpty(current)) {
            const v = {...current, type:current.type || 'Task'};
            
            if (v.variables) {
                const variables = JSON.parse(v.variables);
                const els = [];
                forEach((v) => {
                    const label="变量[" + v.name + "]";
                    const name="variables[" + v.name + "]"
                    if (v.dataType == 'FLOAT') {
                        els.push(<IFormItem name={name} labelCol={{ flex: '110px' }} label={label} xtype="number" precision={2} required={true} />)
                    } else if (v.dataType == 'INTEGER') {
                        els.push(<IFormItem name={name} labelCol={{ flex: '110px' }} label={label} xtype="number" precision={0} required={true} />)
                    } else if (v.dataType == 'STRING') {
                        els.push(<IFormItem name={name} labelCol={{ flex: '110px' }} label={label} xtype="input" required={true} />)
                    } else if (v.dataType == 'BOOLEAN') {
                        els.push(<IFormItem name={name} labelCol={{ flex: '110px' }} label={label} xtype="select" option={[{label:'是',value:true},{label:'否',value:false}]} required={true} />)
                    } else if (v.dataType == 'DATE') {
                        els.push(<IFormItem name={name} labelCol={{ flex: '110px' }} label={label} xtype="date" required={true} />)
                    } else {
                        els.push(<IFormItem name={name} labelCol={{ flex: '110px' }} label={label} xtype="input" required={true} />)
                    }
                },variables);
                setElements(els);
            }
            
            form.setFieldsValue(v);
        }
    },[current])

    const onStart = (keys) => {
        if (keys.length !== 1) {
            message.error('请选择一条工作流数据！');
            return;
        }
        setLoading(true);
        api.flow.startFlow({flowId: keys[0]}).subscribe({
            next: (res) => { 
                message.success('启动流程成功!');
            },
        }).add(() => setLoading(false))

    }

    const onChildClick = (id) => {
        api.flow.getInstanceChart(id).subscribe({
            next: (data) => {
                setChartData(data[0].data);
                const taskTracks = data[0].tracks;
                if (taskTracks) {
                    const tracks = JSON.parse(taskTracks) || [];
                    setTrackDataSource(tracks.sort((a, b) => b.level - a.level));
                }
            }
        });
    }

    const loadExecutingTask = (id) => {
        api.flow.getRunningTask(id).subscribe({
            next: (data) => {
                setTaskDataSource(data)
            }
        })
    }


    //查询
    const searchParent = (pageNo, pageSize, params) => {
        // setSelectedParentKeys([]);
        setSearchLoading(true);
        let param = { dto: params || {}, pageNo: pageNo, pageSize: pageSize };
        api.flow.searchFlow(param).subscribe({
            next: (data) => {
                setParentDataSource(data.data);
                setParentTotal(data.total);
            },
        }).add(() => {
            setSearchLoading(false);
        });
    };

    //查询
    const searchChild = (pageNo, pageSize, parentId) => {
        setSelectedChildKeys([]);
        if (!parentId) return;
        let dto = { flowId: parentId }
        let param = { dto: dto, pageNo: pageNo, pageSize: pageSize };
        return api.flow.searchInstance(param).subscribe({
            next: (data) => {
                setChildDataSource(data.data);
                setChildTotal(data.total);
            },
        }).add(() => {
        });
    };

    //监控LocalStorage更改
    window.addEventListener('storage', () => {
        const settings = JSON.parse(localStorage.getItem("settings"))
        const navTheme = settings.navTheme == "light" ? "light" : "dark";
        setTheme(navTheme);
    })

    

    // 列表及弹窗
    return (
        <>
        <Splitter layout="vertical" onResizeEnd={sizes => {
            setTopHeight(sizes[0]);
            setBottomHeight(sizes[1]);
            }} style={{ height: 'calc(100vh - 50px)', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <Splitter.Panel >
                <UFlow data={chartData} theme={theme} style={{ height: topHeight }} />
            </Splitter.Panel>
            <Splitter.Panel defaultSize={bottomHeight}>
                <ILayout type="hbox" spans="5 5 4 5 5" style={{marginTop:'8px'}} gutter="0">
                    {/* <List
                    pagination={{ position:'position', align:'end',pageSize:50, total:parentTotal }}
                    size="small"
                    header={<div>流程列表</div>}
                    // footer={<div>Footer</div>}
                    bordered
                    dataSource={parentDataSource}
                    renderItem={item => <List.Item>{item}</List.Item>}
                    /> */}
                    <IAGrid
                        
                        ref={parentRef}
                        title="流程列表"
                        key="parent"
                        gridName="flow_parent_list"
                        height={bottomHeight - 80}
                        columns={parentColumns}
                        request={(pageNo, pageSize) => searchParent(pageNo, pageSize)}
                        dataSource={parentDataSource}
                        total={parentTotal}
                        onSelectedChanged={onParentChange}
                        showTotal={false}
                        // onDoubleClick={(record) => onParentDoubleClick(record.id)}
                        toolBarRender={[
                            // <IGridSearch defaultValue={'name'} size="small" style={{ width: 60 }} onSearch={(params) => searchParent(1, pageSize, params)}
                            //     options={[{ label: '流程名称', value: 'name' }
                            //     ]} />,
                        ]}
                        pageToolBarRender={[
                            <Permit authority="flow:start">
                                <IButton type="warning" size="small" 
                                    icon={<PlayCircleOutlined />} key="use" onClick={() => onStart(selectedParentKeys)} loading={loading}>
                                    开始
                                </IButton>
                            </Permit>,
                        ]}
                        clearSelect={searchLoading}
                    />
                    <IAGrid
                        ref={childRef}
                        title="实例列表"
                        key="child"
                        gridName="instance_child_list"
                        height={bottomHeight - 80}
                        // components={{
                        //     stateCellRenderer: StateRenderer,
                        //     lockRenderer: LockRenderer
                        // }}
                        // columnsStorageKey="_cache_user_columns"
                        columns={childColumns}
                        request={(pageNo, pageSize, params) => searchChild(pageNo, pageSize, params)}
                        dataSource={childDataSource}
                        total={childTotal}
                        showTotal={false}
                        onSelectedChanged={onChildChange}
                        onClick={(record) => {
                            onChildClick(record.data.id)
                            loadExecutingTask(record.data.id);
                            setBeComplete(record.data.beComplete);
                        }}
                        // onDoubleClick={(record) => onChildDoubleClick(record.id)}
                        toolBarRender={[
                          
                        ]}
                        pageToolBarRender={[
                            
                        ]}
                    />

                    <IAGrid
                        optionsHide={{pagination:false}}
                        // ref={childRef}
                        title="正在执行任务"
                        key="task"
                        gridName="instance_task_list"
                        height={bottomHeight - 80}
                        // components={{
                        //     stateCellRenderer: StateRenderer,
                        //     lockRenderer: LockRenderer
                        // }}
                        // columnsStorageKey="_cache_user_columns"
                        columns={taskColumns}
                        // request={(pageNo, pageSize, params) => searchChild(pageNo, pageSize, params)}
                        dataSource={taskDataSource}
                        // total={task}
                        showTotal={false}
                        onSelectedChanged={onTaskChange}
                        onClick={(record) => {
                            // console.log(record);
                            setCurrent(record.data);
                        }}
                        // onDoubleClick={(record) => onChildDoubleClick(record.id)}
                        toolBarRender={[
                          
                        ]}
                        pageToolBarRender={[
                            
                        ]}
                    />
                    <Card
                    size="small"
                    style={{height:bottomHeight - 80}}
                    bodyStyle={{ height: bottomHeight - 156, overflow: 'scroll' }}
                    bordered={true}
                    actions={[
                        <div style={{ float: 'right', paddingRight: '10px', height:'10px',marginTop:'-5px' }} key="bottom">
                            <IIF test={current.model == 'FILL'}>
                            <Permit authority="flow:execute">
                                <IButton
                                key="submit"
                                loading={executingLoading}
                                type="primary"
                                icon={<SafetyOutlined />}
                                size="small"
                                htmlType="submit"
                                onClick={() => doSubmit()}
                                >提交</IButton>
                            </Permit>
                            </IIF>
                            <IIF test={current.model !== 'FILL'}>
                            <Space>
                            <Permit authority="flow:execute">
                                <Button
                                loading={executingLoading}
                                key="execute"
                                type="primary"
                                icon={<AuditOutlined />}
                                size="small"
                                htmlType="submit"
                                onClick={() => doExecute()}
                                >审核</Button>
                            </Permit>
                            <Permit authority="flow:reject">
                                <Button
                                loading={executingLoading}
                                key="reject"
                                danger
                                type="primary"
                                icon={<DoubleLeftOutlined />}
                                size="small"
                                htmlType="submit"
                                onClick={() => doReject()}
                                >驳回</Button>
                            </Permit>
                            </Space>
                            </IIF>
                        </div>,
                    ]}
                    title="执行任务"
                    extra={<IIF test={beComplete == true}>
                        <Tooltip placement="top" title="点击该按钮，在FORM中填充结束节点信息，可以继续进行驳回操作">
                        <Button
                            key="submit"
                            loading={executingLoading}
                            type="primary"
                            icon={<FormOutlined />}
                            size="small"
                            htmlType="submit"
                            onClick={() => setCurrent({instanceId: selectedInstanceId, type:'End', name:'结束'})}
                            >填充结束</Button>
                            </Tooltip>
                    </IIF>}
                    >
                        <Form form={form} size='small' layout="horizontal" className="snam-form">
                            <Form.Item style={{ display: 'none' }}>
                                <Form.Item name="instanceId" label="instanceId">
                                    <Input />
                                </Form.Item>
                            </Form.Item>
                            <ILayout type="vbox" >
                                 <IFormItem labelCol={{ flex: '110px' }} name="name" label="任务节点" xtype="input"  required={true} disabled={true} />
                                 <IFormItem labelCol={{ flex: '110px' }} name="type" label="节点类型" xtype="input"  required={true} disabled={true}/>
                                 <IFormItem labelCol={{ flex: '110px' }} name="actor" label="执行人" xtype="input"  required={true} />
                                 {elements.map((item) => (
                                    item
                                ))}
                                <IIF test={current.model == 'AUDIT'}>
                                <IFormItem
                                    labelCol={{ flex: '110px' }}
                                    name="variables[taskAdvice]"
                                    label="意见"
                                    xtype="textarea"
                                    rows={4}
                                    required={true}
                                />
                                </IIF>
                            </ILayout>
                        </Form>
                    </Card>
                    <IAGrid
                        optionsHide={{pagination:false}}
                        // ref={childRef}
                        title="流程执行日志"
                        key="instance_log"
                        gridName="instance_log_list"
                        height={bottomHeight - 80}
                        // components={{
                        //     stateCellRenderer: StateRenderer,
                        //     lockRenderer: LockRenderer
                        // }}
                        // columnsStorageKey="_cache_user_columns"
                        columns={trackColumns}
                        // request={(pageNo, pageSize, params) => searchChild(pageNo, pageSize, params)}
                        dataSource={trackDataSource}
                        // total={task}
                        showTotal={false}
                        // onSelectedChanged={onTaskChange}
                       
                    />
                    
            
            </ILayout>
            </Splitter.Panel>
        </Splitter>
        </>
    );
};