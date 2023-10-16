import React, { useEffect, useRef, useState } from 'react';
import { api, constant, copyObject, forEach, isEmpty, useAutoObservable, useAutoObservableEvent,produce,startsWith } from '@/common/utils';
import { IFormItem, ILayout, IWindow, IGrid } from '@/common/components';
import { Button, Col, Form, Input, message, Modal, Row, Radio, Divider,Select, InputNumber, Transfer, Card, Tree, Space, Table, Tabs, Tooltip } from 'antd';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import {XButton} from '@/common/componentx'
import { useParams } from 'umi';
import {
    ApartmentOutlined,
    BarsOutlined,
    DeleteOutlined,
    DeleteRowOutlined,
    ScheduleOutlined,
    UserOutlined,
} from '@ant-design/icons';
import './index.less';
import { zip } from 'rxjs';
const userOptions = [{ label: '全部', value: 'ALL' }, { label: '指定', value: 'CUSTOMER' }, { label: '特定', value: 'SPECIAL' }];
const options = [{ label: '全部', value: 'ALL' }, { label: '指定', value: 'CUSTOMER' }];
const urlOptions = [{ label: '全部', value: 'ALL' }, { label: '指定', value: 'CUSTOMER' }];

export default (props) => {
    const { TabPane } = Tabs;
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState({});

    const [key, setKey] = useState('user');
    const [userRuleVisible, setUserRuleVisible] = useState(false);
    const [utagRuleVisible, setUTagRuleVisible] = useState(false);
    const [stagRuleVisible, setSTagRuleVisible] = useState(false);
    const [urlRuleVisible, setUrlRuleVisible] = useState(false);
    const [urlPrefixVisible, setUrlPrefixVisible] = useState(false);

    const [disabledNodes, setDisAbledNodes] = useState([]);
    const [utagDataSource, setUTagDataSource] = useState([]);
    const [utagKeys, setUTagKeys] = useState([]);
    const [stagDataSource, setSTagDataSource] = useState([]);
    const [stagKeys, setSTagKeys] = useState([]);

    const [utagMap, setUTagMap] = useState({});
    const [stagMap, setSTagMap] = useState({});

    // 组织架构树形结构数据
    const [treeData, setTreeData] = useState([]);
    const [userNode, setUserNode] = useState({});
    const [userGroupKeyMap, setUserGroupKeyMap] = useState({});
    const [exceptUserDataSource, setExceptUserDataSource] = useState([]);
    const [exceptUrlDataSource, setExceptUrlDataSource] = useState([]);

    const [urlForm] = Form.useForm();

    useEffect(() => {
        initData();
        if (params.id != 'ADD') {
            getLimit(params.id);
        } else {
            const limit = {ruleUser:'SPECIAL',ruleSystemTag:'ALL',ruleUserTag:'ALL',ruleUrl:'ALL'};
            setCurrent(limit);
        }
    },[params.id]);

    const getLimit = (id) => {
        api.limit.getLimit(id).subscribe({
            next: (datas) => {
                const data = datas[0];
                data.ruleUser = data.ruleUser || 'SPECIAL';
                if (data.ruleUser === 'CUSTOMER') {
                    setUserRuleVisible(true);
                } else {
                    setUserRuleVisible(false);
                }
                data.ruleSystemTag = data.ruleSystemTag || 'ALL';
                if (data.ruleSystemTag === 'CUSTOMER') {
                    setSTagRuleVisible(true);
                } else {
                    setSTagRuleVisible(false);
                }

                data.ruleUserTag = data.ruleUserTag || 'ALL';
                if (data.ruleUserTag === 'CUSTOMER') {
                    setUTagRuleVisible(true);
                } else {
                    setUTagRuleVisible(false);
                }

                data.ruleUrl = data.ruleUrl || 'ALL';
                if (data.ruleUrl === 'CUSTOMER') {
                    setUrlRuleVisible(true);
                } else {
                    setUrlRuleVisible(false);
                }

                const utags = []
                forEach((v) => {
                    utags.push(v.tagCode);
                }, data.utags || [])
                setUTagKeys(utags);

                const stags = [];
                forEach((v) => {
                    stags.push(v.systemTag);
                }, data.stags || []);
                setSTagKeys(stags);

                const users = [];
                const nodes = [];
                forEach((v) => {
                    const user = { title: v.userRealCnName, key: v.userId, userId: v.userId, userRealCnName: v.userRealCnName };
                    if (userNode[v.userId]) {
                        const node = userNode[v.userId];
                        node.disabled = true;
                        nodes.push(node);
                        user.key = node.key;
                        if (node.parentGroupName) {
                            user.title = user.title + '[' + node.parentGroupName + ']';
                        }
                    }
                    users.push(user);
                }, data.users || []);
                setDisAbledNodes(nodes);
                setExceptUserDataSource(users);

                const urls = [];
                forEach((v) => {
                    urls.push({ key: v.id, ...v });
                }, data.requests || []);
                setExceptUrlDataSource(urls);

                setKey("user");
                setCurrent(data);
            }
        })
    }

    const onSaveClick = (limit) => {
        setLoading(true);
        api.limit.saveOrUpdateLimit(limit).subscribe({
            next: () => {
                limit.ruleUser = limit.ruleUser || 'SPECIAL';
                limit.ruleSystemTag = limit.ruleSystemTag || 'ALL';
                limit.ruleUserTag = limit.ruleUserTag || 'ALL';
                limit.ruleUrl = limit.ruleUrl || 'ALL';
                message.success('操作成功!');
                // window.close();
                window.opener.onSuccess();
            }
        }).add(() => setLoading(false));
    }

    const onDoubleClick = (record) => {
        const o = {};

        o.reqUrl = record.resourceId ? record.url : '';
        o.buttonName = record.resourceName;
        o.buttonId = record.resourceId;
        o.method = record.method;
        o.ip = record.ip;
        o.mode = 'API';
        o.priority = record.priority;
        o.key = record.key;
        o.urlPrefix = '';
        const url = record.url;
        if (startsWith('/api/',url)) {
            o.mode = 'API';
            o.urlPrefix = '';
        } else if (startsWith('/wapi/',url)) {
            o.mode = 'WAPI';
            o.urlPrefix = '';
        } else if (startsWith('/**')) {
            o.mode = 'NONE';
            o.urlPrefix = '';
        } else if (url.indexof ('@') !== -1) {
            o.mode = 'CUSTOMER';
            o.urlPrefix = url.substring(0,url.indexOf('@'));
        }
        if (o.mode === 'CUSTOMER') {
            setUrlPrefixVisible(true);
        } else {
            setUrlPrefixVisible(false);
        }
        urlForm.setFieldsValue(o);
    }

    const UrlOperateRenderer = (props) => {
        return <><DeleteOutlined title='删除过滤' onClick={(e) => {
            e.stopPropagation();
            urlForm.resetFields();
            const ds = [];
            forEach((v) => {
                if (v.key !== record.key) {
                    ds.push(v);
                }
            }, exceptUrlDataSource);
            setExceptUrlDataSource(ds);
        }} /></>
    }

    const exceptUrlColumns = [
        {
            title: '#',
            width: 50,
            dataIndex: 'rowNo',
            valueGetter: (params) => params.node.rowIndex + 1
        },
        {
            title: '菜单>按钮',
            width: 150,
            align: 'left',
            dataIndex: 'resourceName',
        },
        {
            title: 'URL',
            width: 200,
            align: 'left',
            dataIndex: 'url',
        },
        {
            title: '方法',
            width: 60,
            align: 'center',
            dataIndex: 'method',
        },
        {
            title: 'IP',
            width: 120,
            align: 'center',
            dataIndex: 'ip',
        },
        {
            title: '优先级',
            width: 70,
            align: 'center',
            dataIndex: 'priority',
        },
        {
            title: '操作',
            width: 60,
            align: 'center',
            search: false,
            dataIndex: 'operator',
            cellRenderer: 'urlOperateRenderer'
            // render: (text, record) => {
            //     return <><DeleteOutlined title='删除过滤' onClick={(e) => {
            //         e.stopPropagation();
            //         urlForm.resetFields();
            //         const ds = [];
            //         forEach((v) => {
            //             if (v.key !== record.key) {
            //                 ds.push(v);
            //             }
            //         }, exceptUrlDataSource);
            //         setExceptUrlDataSource(ds);
            //     }} /></>
            // }
        },
    ];

    const UserOperateRenderer = (props, record) => {
        return <><DeleteOutlined title='删除过滤' onClick={(e) => {
            e.stopPropagation();
            const ds = [];
            forEach((v) => {
                if (v.key !== record.key) {
                    ds.push(v);
                }
            }, exceptUserDataSource);
            setExceptUserDataSource(ds);
            userGroupKeyMap[record.key].disabled = false;
        }} /></>
    } 

    const exceptUserColumns = [
        {
            title: '#',
            width: 60,
            dataIndex: 'rowNo',
            valueGetter: (params) => params.node.rowIndex + 1
        },
        {
            title: '名称',
            align: 'left',
            width: 260,
            dataIndex: 'title',
        }, {
            title: '操作',
            width: 60,
            dataIndex: 'operator',
            cellRenderer: 'userOperateRenderer',
        // render: (text, record) => {
        //     return <><DeleteOutlined title='删除过滤' onClick={(e) => {
        //         e.stopPropagation();
        //         const ds = [];
        //         forEach((v) => {
        //             if (v.key !== record.key) {
        //                 ds.push(v);
        //             }
        //         }, exceptUserDataSource);
        //         setExceptUserDataSource(ds);
        //         userGroupKeyMap[record.key].disabled = false;
        //     }} /></>
        // }
    }];

    const ugs = {};
    const unodes = {};
    // 将组织设置为不可选
    const loopGroup = (data, beConfigSelect) => {
        forEach((v) => {
            ugs[v.key] = v;
            // 节点是组织不允许修改
            if (v.tag && v.tag === 'GROUP') {
                if (beConfigSelect) {
                    copyObject(v, {
                        selectable: false,
                        disableCheckbox: true,
                        icon: <ApartmentOutlined />,
                    });
                } else {
                    copyObject(v, { icon: <ApartmentOutlined /> });
                }
            } else {
                v.disabled = false;
                if (v.key && v.key.indexOf('#') !== -1) {
                    const key = v.key.split('#')[1];
                    unodes[key] = v;
                }
                copyObject(v, { icon: <UserOutlined style={{ color: '#52c41a' }} /> });
            }
            if (v.children && !isEmpty(v.children)) {
                loopGroup(v.children, beConfigSelect);
            }
            setUserGroupKeyMap(ugs);
            setUserNode(unodes);
        },data);
    };

    // let gData = [];

    const loadGroup = () => {
        // 获取所有组织及用户
        api.group.treeAllGroupsAndUsers().subscribe({
            next: (data) => {
                // gData = _.cloneDeep(data);
                // generateList(gData);
                // const copys = _.cloneDeep(data);
                loopGroup(data, true);
                setTreeData(data);

            },
        });
    }


    

    const initData = () => {
        // const stags = [{
        //     key: 'admin',
        //     title: '系统端'
        // }, {
        //     key: 'weixin',
        //     title: '微信端'
        // }, {
        //     key: 'business',
        //     title: '业务端'
        // }, {
        //     key: 'app',
        //     title: '手机端'
        // }, {
        //     key: 'temp',
        //     title: '授权码'
        // }];
        // const smap = {};
        // forEach((v) => {
        //     smap[v.key] = v.title;
        // }, stags);
        // setSTagMap(smap);
        // setSTagDataSource(stags);
        // 权限范围字典 及系统标识字典
        zip(api.dict.listChildByParentCode(constant.DICT_USER_BUSINEESS_TAG),api.dict.listChildByParentCode(constant.SYSTEM_POINT_TAG)).subscribe({
            next: ([data1, data2]) => {
                const utags = [];
                const umap = {};
                forEach((v) => {
                    utags.push({ key: v.dictCode, title: v.dictName });
                    umap[v.value] = v.label;
                }, data1);
                setUTagMap(umap);
                setUTagDataSource(utags);

                const smap = {};
                const stags = [];
                forEach((v) => {
                    stags.push({ key: v.dictCode, title: v.dictName });
                    smap[v.value] = v.label;
                }, data2);
                setSTagMap(smap);
                setSTagDataSource(stags);
            }
        });
        loadGroup();
    }

    return (
        <IWindow
            current={current}
            className="snam-modal"
            //title={(current && current.id) ? '编辑用户组' : '新建用户组'}
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="id" />
            <ILayout type="hbox" spans = "12 12">
                <ILayout type="vbox">

                <IFormItem
                    name="name"
                    label="名称"
                    xtype="input"
                    required={true}
                    max={30}
                />
                <IFormItem
                    name="allowVolume"
                    label="总流量"
                    xtype="number"
                    required={true}
                    min={1} 
                    precision={0}
                />
                </ILayout>
                
                <ILayout type="vbox">

                <IFormItem
                    name="durationInSecond"
                    label="持续时间"
                    xtype="number"
                    required={true}
                    min={1} 
                    precision={0}
                    addonAfter="秒"
                />
                <IFormItem
                    name="speedInSecond"
                    label="流速"
                    xtype="number"
                    required={true}
                    min={1} 
                    precision={0}
                    addonAfter="每秒"
                />
                </ILayout>
            </ILayout>
            <Tabs
                    style={{ marginTop: 20 }}
                    activeKey={key}
                    size="small"
                    type="card"
                    onChange={(activeKey) => {
                        setKey(activeKey);

                    }}>
                    <TabPane tab="用户规则" key="user">
                        <Row style={{ paddingTop: 8 }}>
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{ span: 3 }}
                                    name="ruleUser"
                                    label="用户规则"
                                    rules={[{ whitespace: true, required: false, message: false, max: 50 }]}
                                >
                                    <Radio.Group
                                        defaultValue='SPECIAL'
                                        buttonStyle="solid"
                                        options={userOptions}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (v === 'CUSTOMER') {
                                                setUserRuleVisible(true);
                                            } else {
                                                setUserRuleVisible(false);
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        {userRuleVisible && (
                            <>
                            <Row gutter={5}>
                                <Col span={24}>
                                    <Card
                                        size='small'
                                        bordered={true}
                                        bodyStyle={{ height: 200, overflow: 'scroll' }}
                                        title={<div>指定用户列表</div>}
                                    >
                                        <Tree
                                            size="small"
                                            bordered
                                            // style={{width:250, marginLeft: '5px' }}
                                            blockNode={true}
                                            treeData={treeData}
                                            checkable={false}
                                            // checkedKeys={permGroupOrUserId}
                                            onCheck={(checked) => {

                                            }}
                                            titleRender={(node) => (
                                                <div style={{ width: '100%' }}>
                                                    <div style={{ float: 'left' }}>
                                                        {node.title}
                                                    </div>
                                                    {node.tag === 'USER' && (
                                                        <div style={{ float: 'right', zIndex: 999 }}>
                                                            <Space>
                                                                <DeleteRowOutlined
                                                                    size="small"
                                                                    title='过滤'
                                                                    onClick={(e) => {
                                                                        if (node.disabled) {
                                                                            return;
                                                                        }
                                                                        e.stopPropagation();
                                                                        userGroupKeyMap[node.key].disabled = true;
                                                                        const disables = produce(disabledNodes, (draft) => {
                                                                            draft.push(node);
                                                                        });
                                                                        setDisAbledNodes(disables);
                                                                        const ds = produce(exceptUserDataSource, (draft) => {
                                                                            if (node.parentGroupName) {
                                                                                draft.push({ title: node.title + '[' + node.parentGroupName + ']', key: node.key, userId: node.key, userRealCnName: node.title });
                                                                            } else {
                                                                                draft.push({ title: node.title, key: node.key, userId: node.key, userRealCnName: node.title });
                                                                            }
                                                                        })
                                                                        setExceptUserDataSource(ds);
                                                                    }}
                                                                />
                                                            </Space>
                                                        </div>
                                                    )}
                                                </div>

                                            )}
                                        />
                                    </Card>
                                </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                <Card
                                        style={{marginTop:5}}
                                        size='small'
                                        bordered={true}
                                        bodyStyle={{ height: 200, overflow: 'scroll', padding:"0px 0px 0px 5px",marginTop:1}}
                                        title={<div>过滤用户列表</div>}
                                        > 
                                <IGrid
                                        key="key"
                                        height={188}
                                        components={{
                                            userOperateRenderer: UserOperateRenderer,
                                        }}
                                        optionsHide={{pagination:true, refresh:true, setting:true,noPadding:true}}
                                        initColumns={exceptUserColumns}
                                       
                                        dataSource={exceptUserDataSource}
                                        // total={columnTotal}
                                        // onSelectedChanged={onColumnChange}
                                        // showQuickJumper={false}
                                    />
                                    </Card>
                                    </Col>
                                {/* <Table
                                    size="small"
                                    style={{ marginTop: '5px' }}
                                    title={() => <><b>过滤用户列表</b></>}
                                    className='snam-table'
                                    scroll={{ y: 150, }}
                                    bordered
                                    rowKey="key"
                                    columns={exceptUserColumns}
                                    search={false}
                                    dataSource={exceptUserDataSource}
                                    pagination={false}
                                /> */}
                            </Row>
                            </>
                        )}
                    </TabPane>
                    <TabPane tab="业务规则" key="business">
                        <Row style={{ paddingTop: 8 }}>
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{ span: 3 }}
                                    name="ruleUserTag"
                                    label="业务规则"
                                    rules={[{ whitespace: false, required: false, message: false, max: 100 }]}
                                >
                                    <Radio.Group
                                        buttonStyle="solid"
                                        defaultValue='ALL'
                                        options={options}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (v === 'CUSTOMER') {
                                                setUTagRuleVisible(true);
                                            } else {
                                                setUTagRuleVisible(false);
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        {utagRuleVisible && (
                            <Row>
                                <Col span={24}>
                                    <Transfer
                                        titles={['业务TAG列表', '已过滤TAG']}
                                        listStyle={{
                                            width: 350,
                                            height: 300,
                                        }}
                                        render={(item) => item.title}
                                        dataSource={utagDataSource}
                                        targetKeys={utagKeys}
                                        onChange={(targetKeys) => {
                                            setUTagKeys(targetKeys);
                                        }}
                                    />
                                </Col>
                            </Row>
                        )}
                    </TabPane>
                    <TabPane tab="系统规则" key="system">
                        <Row style={{ paddingTop: 8 }}>
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{ span: 3 }}
                                    name="ruleSystemTag"
                                    label="系统规则"
                                    rules={[{ whitespace: true, required: false, message: false, max: 50 }]}
                                >
                                    <Radio.Group
                                        buttonStyle="solid"
                                        defaultValue='ALL'
                                        options={options}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (v === 'CUSTOMER') {
                                                setSTagRuleVisible(true);
                                            } else {
                                                setSTagRuleVisible(false);
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        {stagRuleVisible && (
                            <Row>
                                <Col span={24}>
                                    <Transfer
                                        titles={['系统TAG列表', '已过滤TAG']}
                                        listStyle={{
                                            width: 350,
                                            height: 300,
                                        }}
                                        render={(item) => item.title}
                                        dataSource={stagDataSource}
                                        targetKeys={stagKeys}
                                        onChange={(targetKeys) => {
                                            setSTagKeys(targetKeys);
                                        }}
                                    />
                                </Col>
                            </Row>
                        )}
                    </TabPane>
                    <TabPane tab="请求规则" key="request">
                        <Row style={{ paddingTop: 8 }}>
                            <Col span={24}>
                                <Form.Item
                                    labelCol={{ span: 3 }}
                                    name="ruleUrl"
                                    label="请求规则"
                                    rules={[{ whitespace: true, required: false, message: false, max: 50 }]}
                                >
                                    <Radio.Group
                                        buttonStyle="solid"
                                        defaultValue='ALL'
                                        options={urlOptions}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (v === 'CUSTOMER') {
                                                setUrlRuleVisible(true);
                                            } else {
                                                setUrlRuleVisible(false);
                                            }
                                        }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        {urlRuleVisible && (
                            <>
                                <Card
                                    size='small'
                                    bordered={true}
                                    bodyStyle={{ height: 255, overflow: 'scroll', marginBottom: 0, paddingBottom: 0 }}
                                    title={<div>指定请求</div>}
                                >
                                    <Form form={urlForm} size='small' className="dsi-form">
                                        <Form.Item style={{ display: 'none' }}>
                                            <Form.Item name="key" label="">
                                                <Input />
                                            </Form.Item>
                                        </Form.Item>
                                        <Form.Item style={{ display: 'none' }}>
                                            <Form.Item name="buttonName" label="">
                                                <Input />
                                            </Form.Item>
                                        </Form.Item>
                                        <Form.Item style={{ display: 'none' }}>
                                            <Form.Item name="reqUrl" label="">
                                                <Input />
                                            </Form.Item>
                                        </Form.Item>
                                        <Form.Item
                                            labelCol={{ span: 3 }}
                                            name="buttonId"
                                            label="请求URL"
                                            rules={[{ whitespace: true, required: false, message: false, max: 50 }]}
                                        >
                                            <XButton onGetButton={(value) => {
                                                console.log(value);
                                                urlForm.setFieldsValue({ method: value.reqMethod, buttonName: value.subMenu + '>' + value.buttonName, reqUrl: value.reqUrl });
                                            }} />
                                        </Form.Item>
                                        <Row>
                                            <Col span={15}>
                                                <Form.Item
                                                    labelCol={{ span: 5 }}
                                                    name="method"
                                                    label="请求方法"
                                                    rules={[{ whitespace: true, required: false, message: false }]}
                                                >
                                                    <Select allowClear options={[{ label: 'POST', value: 'POST' }, { label: 'PUT', value: 'PUT' }, { label: 'GET', value: 'GET' }, { label: 'DELETE', value: 'DELETE' }]} />
                                                </Form.Item>
                                            </Col>
                                            <Col span={9}>
                                                <Form.Item
                                                    labelCol={{ span: 7 }}
                                                    name="priority"
                                                    label="优先级"
                                                    rules={[{required: true, message: false }]}
                                                >
                                                    <InputNumber min={1} precision={0} style={{ width: '100%' }} max={999} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={15}>
                                                <Form.Item
                                                    labelCol={{ span: 5 }}
                                                    name="mode"
                                                    label="授权模式"
                                                    rules={[{ whitespace: true, required: false, message: false, max: 50 }]}
                                                >
                                                    <Radio.Group defaultValue='API'
                                                        buttonStyle="solid"
                                                        options={[{ label: 'JWT', value: 'API' }, { label: 'HMAC', value: 'WAPI' }, { label: '忽略', value: 'NONE' }, { label: '指定', value: 'CUSTOMER' }]}
                                                        onChange={(e) => {
                                                            const v = e.target.value;
                                                            if (v === 'CUSTOMER') {
                                                                setUrlPrefixVisible(true);
                                                            } else {
                                                                setUrlPrefixVisible(false);
                                                            }
                                                        }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            {urlPrefixVisible && (
                                                <Col span={9}>
                                                    <Form.Item
                                                        labelCol={{ span: 7 }}
                                                        name="urlPrefix"
                                                        label="前缀"
                                                        rules={[{ whitespace: true, required: true, message: '不能为空或包含@符号', max: 50, pattern:new RegExp(/^((?!@).)*$/) }]}
                                                        // 
                                                    >
                                                        <Input />
                                                    </Form.Item>
                                                </Col>
                                            )}
                                        </Row>
                                        <Form.Item name="ip" label="允许IP" labelCol={{ span: 3 }} rules={[{ max: 200 }]}>
                                            <Input.TextArea placeholder="空即允许所有IP，多个IP以逗号间隔" rows={4} />
                                        </Form.Item>
                                        
                                        
                                        <Form.Item>
                                        
                                            <Button type="primary" size='small'
                                                style={{ float: 'right' }}
                                                onClick={() => {
                                                    urlForm.validateFields().then(value => {
                                                        //if (!value.reqUrl && !value.ip && ) return;
                                                        let url = value.reqUrl || '/api/**';
                                                        if (value.mode === 'WAPI') {
                                                            url = url.replace('/api/', '/wapi/');
                                                        } else if (value.mode === 'CUSTOMER') {
                                                            url = url.replace('/api/', '' + value.urlPrefix) + '';
                                                        } else if (value.mode === 'NONE') {
                                                            url = url.replace('/**', '/');
                                                            url = url.replace('/api/', '/**');
                                                        }
                                                        const id = value.buttonId || stringRandom(8);
                                                        const ds = [{ resourceName: value.buttonName, url: url,urlPrefix:value.urlPrefix, 
                                                            mode:value.mode, method: value.method, ip: value.ip, key: id, resourceId: value.buttonId,priority:value.priority }, ...exceptUrlDataSource];
                                                        if (value.key) {
                                                            const modifyed = produce(exceptUrlDataSource, (draft) => {
                                                                R.forEach((v) => {
                                                                    if (v.key === value.key) {
                                                                        const copy = { resourceName: value.buttonName, url: url,urlPrefix:value.urlPrefix, 
                                                                            mode:value.mode, method: value.method, ip: value.ip, key: id, resourceId: value.buttonId,priority:value.priority };
                                                                        objectAssign(v, copy);
                                                                    }
                                                                },draft);
                                                            });
                                                            setExceptUrlDataSource(modifyed);
                                                        } else {
                                                            setExceptUrlDataSource(ds);
                                                        }
                                                       
                                                        
                                                        urlForm.resetFields();
                                                    });
                                                }}>
                                                添加
                                            </Button>
                                            <Button type="danger" size='small'
                                                style={{ float: 'right',marginRight:2 }} onClick={() => urlForm.resetFields()}>重置</Button>
                                            </Form.Item>
                                    </Form>
                                </Card>
                        
                                <Card
                                        style={{marginTop:5}}
                                        size='small'
                                        bordered={true}
                                        bodyStyle={{ height: 180, overflow: 'scroll', padding:"0px 0px 0px 5px",marginTop:1}}
                                        title={<Tooltip title="按照列表顺序进行匹配"><b>过滤请求列表</b></Tooltip>}
                                        > 
                                <IGrid
                                        key="key"
                                        height={168}
                                        components={{
                                            urlOperateRenderer: UrlOperateRenderer,
                                        }}
                                        optionsHide={{pagination:true, refresh:true, setting:true,noPadding:true}}
                                        initColumns={exceptUrlColumns}
                                       
                                        dataSource={exceptUrlDataSource}
                                        onDoubleClick={(record) => onDoubleClick(record)}
                                        // total={columnTotal}
                                        // onSelectedChanged={onColumnChange}
                                        // showQuickJumper={false}
                                    />
                                    </Card>
                                {/* <Table
                                    style={{ marginTop: '5px' }}
                                    title={() => <><Tooltip title="按照列表顺序进行匹配"><b>过滤请求列表</b></Tooltip></>}
                                    scroll={{ y: 115, }}
                                    bordered
                                    toolBarRender={false}
                                    rowKey="key"
                                    columns={exceptUrlColumns}
                                    dataSource={exceptUrlDataSource}
                                    search={false}
                                    pagination={false}
                                    onRow={(record) => {
                                        return {
                                            onDoubleClick: () => {
                                                const o = {};

                                                o.reqUrl = record.resourceId ? record.url : '';
                                                o.buttonName = record.resourceName;
                                                o.buttonId = record.resourceId;
                                                o.method = record.method;
                                                o.ip = record.ip;
                                                o.mode = 'API';
                                                o.priority = record.priority;
                                                o.key = record.key;
                                                o.urlPrefix = '';
                                                const url = record.url;
                                                if (R.startsWith('/api/',url)) {
                                                    o.mode = 'API';
                                                    o.urlPrefix = '';
                                                } else if (R.startsWith('/wapi/',url)) {
                                                    o.mode = 'WAPI';
                                                    o.urlPrefix = '';
                                                } else if (R.startsWith('/**')) {
                                                    o.mode = 'NONE';
                                                    o.urlPrefix = '';
                                                } else if (url.indexof ('@') !== -1) {
                                                    o.mode = 'CUSTOMER';
                                                    o.urlPrefix = url.substring(0,url.indexOf('@'));
                                                }
                                                if (o.mode === 'CUSTOMER') {
                                                    setUrlPrefixVisible(true);
                                                } else {
                                                    setUrlPrefixVisible(false);
                                                }
                                                urlForm.setFieldsValue(o);
                                                console.log(record);
                                                console.log(o);
                                            },
                                        };
                                    }}
                                /> */}
                            </>
                        )}
                    </TabPane>
                </Tabs>
        </IWindow>
    )
}