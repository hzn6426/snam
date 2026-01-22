import React, { useEffect, useState } from 'react';
import { api, useAutoObservable, split, constant, isEmpty, forEach, copyObject, produce } from '@/common/utils';
import { IFormItem, ILayout, ISearchTree, IWindow } from '@/common/components';
import { message, Card, Radio, Row, Col, Space, Table } from 'antd';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { useParams } from '@umijs/max';
import { ApartmentOutlined, UserOutlined,DeleteRowOutlined,UsergroupAddOutlined,DeleteOutlined } from '@ant-design/icons';
import { zip } from 'rxjs'
import { set } from 'lscache';

export default (props) => {
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    // 分配用户窗口中树的数据
    const [treeData, setTreeData] = useState([]);
    // 树显示
    const [treeVisible, setTreeVisible] = useState(false);

    const [uncheckTreeVisible, setUncheckTreeVisible] = useState(false);
    // 选中的自定义职位权限范围
    const [permGroupOrUserId, setPermGroupOrUserId] = useState([]);

    // 排除表格数据源
    const [exceptDataSource, setExceptDataSource] = useState([]);
    const [exceptSelectedKeys, setExceptSelectedKeys] = useState([]);

    const [disabledNodes, setDisAbledNodes] = useState([])

    // 委托列表
    const [entrustDataSource, setEntrustDataSource] = useState([]);
    const [entrustSelectedKeys, setEntrustSelectedKeys] = useState([]);

    const [userIdGroupKeyMap, setUserIdGroupKeyMap] = useState({});
    const [userGroupKeyMap, setUserGroupKeyMap] = useState({});

    const [current, setCurrent] = useState({});
    // const [current, setCurrent] = useAutoObservable((inputs$) =>
    //     inputs$.pipe(
    //         map(([id]) => id),
    //         filter(id => id !== 'ADD'),
    //         switchMap((id) => api.position.getPosition(id)),
    //         map((position) => {

    //             return position[0];
    //         })
    //     ),
    //     [params.id],
    // );

    let uidks = {};
    let ugs = {};

    const exceptColumns = [{
        title: '名称',
        search: false,
        dataIndex: 'title',
    }, {
        title: '操作',
        width: 50,
        search: false,
        dataIndex: 'operator',
        render: (text, record) => {
            return <><DeleteOutlined title='删除排除' onClick={(e) => {
                e.stopPropagation();
                const ds = [];
                forEach((v) => {
                    if (v.key !== record.key) {
                        ds.push(v);
                    }
                }, exceptDataSource);
                setExceptDataSource(ds);
                userGroupKeyMap[record.key].disabled = false;
            }} /></>
        }
    }];

    const entrustColumns = [{
        title: '名称',
        search: false,
        dataIndex: 'title',
    }, {
        title: '操作',
        width: 50,
        search: false,
        dataIndex: 'operator',
        render: (text, record) => {
            return <><DeleteOutlined title='删除' onClick={(e) => {
                e.stopPropagation();
                const ds = [];
                forEach((v) => {
                    if (v.key !== record.key) {
                        ds.push(v);
                    }
                }, entrustDataSource);
                setEntrustDataSource(ds);
                setUserGroupKeyMap(produce(userGroupKeyMap,draft => {
                    draft[record.key].disabled = false;
                }));
                // userGroupKeyMap[record.key].disabled = false;
            }} /></>
        }
    }];

    const removeExtra = (title) => {
        if (title.indexOf('(') > 0 && title.indexOf(')') > 0) {
            title = title.substring(0, title.indexOf('(')) + title.substring(title.indexOf(')') + 1);;
        }
        return title;
    }

    //排除用户
    const onExceptUserPerm = (node, e) => {
        if (node.disabled) {
            return;
        }
        e.stopPropagation();
        if (userGroupKeyMap[node.key]) {
            if (node.selectable === true) {
                userGroupKeyMap[node.key].disabled = true;
            }
            // userGroupKeyMap[node.key].disabled = true;
        }
        let index = exceptDataSource.findIndex(item => item.key === node.key);
        if (index >= 0) {
            return;
        }
        let title = removeExtra(node.text);
        const ds = produce(exceptDataSource, (draft) => {
            
            if (node.parentGroupName) {
                draft.push({ title: title + '[' + node.parentGroupName + ']', key: node.key });
            } else {
                draft.push({ title: title, key: node.key });
            }
        })
        setExceptDataSource(ds);
        if (current.permScope === 'CUSTOMER_SPECIFIED') {
            const index = permGroupOrUserId.indexOf(node.key);
            if (index !== -1) {
                const ks = produce(permGroupOrUserId, (draft) => {
                    draft.splice(index, 1);
                });
                setPermGroupOrUserId(ks);

            }
        }
    }

     //添加委托用户
    const onEntrustUserPerm = (node, e) => {
        
        e.stopPropagation();
        // userGroupKeyMap[node.key].disabled = true;
        // const disables = produce(disabledNodes, (draft) => {
        //     draft.push(node);
        // });
        // setDisAbledNodes(disables);
        let index = entrustDataSource.findIndex(item => item.key === node.key);
        if (index >= 0) {
            return;
        }
        let title = removeExtra(node.text);
        const ds = produce(entrustDataSource, (draft) => {
            
            if (node.parentGroupName) {
                draft.push({ title: title + '[' + node.parentGroupName + ']', key: node.key });
            } else {
                draft.push({ title: title, key: node.key });
            }
        })
        setEntrustDataSource(ds);
    }

    useEffect(() => {
        const id = params.id;
        if (!isEmpty(userIdGroupKeyMap)) {
            zip(api.position.listAdditionalEntrusByPosition(id), api.position.listExceptEntrusByPosition(id)).subscribe({
                next: ([data3, data4]) => {
                    const addDs = [];
                    forEach((v) => {
                        if (v.indexOf('#') >=  0) {
                            // eslint-disable-next-line prefer-destructuring
                            v = split(v, '#')[1];
                        }
                        if (userIdGroupKeyMap[v]) {
                            const node = userIdGroupKeyMap[v];
                            console.log(node);
                            let title = removeExtra(node.title);
                            if (node.parentGroupName) {
                                addDs.push({ title: title + '[' + node.parentGroupName + ']', key: node.key });
                            } else {
                                addDs.push({ title: title, key: node.key });
                            }
                        }
                    }, data3);
                    setEntrustDataSource(addDs);

                    const ds = [];
                    const disables = [];
                    forEach((v) => {
                        if (v.indexOf('#') >= 0 ) {
                            // eslint-disable-next-line prefer-destructuring
                            v = split(v, '#')[1];
                        }
                        if (userIdGroupKeyMap[v]) {
                            const node = userIdGroupKeyMap[v];
                            node.disabled = true;
                            disables.push(node);
                            let title = removeExtra(node.title);
                            if (node.parentGroupName) {
                                ds.push({ title: title + '[' + node.parentGroupName + ']', key: node.key });
                            } else {
                                ds.push({ title: title, key: node.key });
                            }
                        }
                    }, data4);
                    setExceptDataSource(ds);
                    setDisAbledNodes(disables);
                }
            });
        }
    },[userIdGroupKeyMap])

    const getPosition = (id) => {
        zip(api.position.getPosition(id), api.position.listEntrusByPosition(id), 
            ).subscribe({
            next: ([data, data2, data3, data4]) => {
                setPermGroupOrUserId(data2);
                const position = data[0];
                const sparams = window.opener.onGetParams();
                copyObject(position, sparams);
                setCurrent(position);
                if (position.permScope === 'CUSTOMER_SPECIFIED') {
                    setTreeVisible(true);
                    setUncheckTreeVisible(false);
                } else {
                    setTreeVisible(false);
                    setUncheckTreeVisible(true);
                }

                
            }
        });
    }

    useEffect(() => {
        treeAllGroupsAndUsers();
        if (params.id !== 'ADD') {
            setTimeout(() => {
                getPosition(params.id);
            }, 300);
            
        } else {
            const sparams = window.opener.onGetParams() || {};
            console.log(sparams);
            setCurrent(sparams);
        }
       
    }, [params.id]);

    const treeAllGroupsAndUsers = () => {
        api.group.treeAllGroupsAndUsers().subscribe({
            next: (data) => {
                setTreeData(data);
            }
        })
    };

    

    const loopGroup = (data) => {
        forEach((v) => {
            ugs[v.key] = v;
            // 节点是组织不允许修改
            if (v.tag && v.tag === 'GROUP') {
                uidks[v.key] = v;
                copyObject(v, { icon: <ApartmentOutlined />, });
            } else {
                if (v.key && v.key.indexOf('#') !== -1) {
                    const key = v.key.split('#')[1];
                    uidks[key] = v;
                }
                copyObject(v, { icon: <UserOutlined style={{ color: '#52c41a' }} /> });
            }
            if (v.children && !isEmpty(v.children)) {
                loopGroup(v.children);
            }
            setUserIdGroupKeyMap(uidks);
            setUserGroupKeyMap(ugs);
        }, data);
    };

    const loopUnSelectGroup = (data) => {
       
        forEach((v) => {
            ugs[v.key] = v;
            // 节点是组织不允许修改
            if (v.tag && v.tag === 'GROUP') {
                uidks[v.key] = v;
                copyObject(v, { icon: <ApartmentOutlined />,selectable: false });
            } else {
                if (v.key && v.key.indexOf('#') !== -1) {
                    const key = v.key.split('#')[1];
                    uidks[key] = v;
                }
                copyObject(v, { icon: <UserOutlined style={{ color: '#52c41a' }} />, selectable: false});
            }
            if (v.children && !isEmpty(v.children)) {
                loopUnSelectGroup(v.children);
            }
            setUserIdGroupKeyMap(uidks);
            setUserGroupKeyMap(ugs);
        }, data);
    };


    const onSaveClick = (position) => {
        let entrusts = [];
        if (!isEmpty(permGroupOrUserId)) {
            // 将#前的部分(父组织ID)去掉，之所以附加父组织ID是因为一个用户可能添加到多个组织，导致key冲突
            produce(permGroupOrUserId, (draft) => {
                forEach((v) => {
                    if (v.indexOf('#') !== -1) {
                        // eslint-disable-next-line no-param-reassign
                        v = split(v, '#')[1];
                    }
                    entrusts.push(v);
                }, draft);
            });
        } else {
            entrusts = permGroupOrUserId;
        }
        const additionalEntrusts = [];
        if (!isEmpty(entrustDataSource)) {
            forEach((v) => {
                let dsKey = v.key;
                if (dsKey.indexOf('#') !== -1) {
                    dsKey = split(dsKey, '#')[1];
                }
                additionalEntrusts.push(dsKey)
            }, entrustDataSource);
        }
        const exceptEntrusts = [];
        if (!isEmpty(exceptDataSource)) {
            forEach((v) => {
                let dsKey = v.key;
                if (dsKey.indexOf('#') !== -1) {
                    dsKey = split(dsKey, '#')[1];
                }
                exceptEntrusts.push(dsKey)
            }, exceptDataSource);
        }
        copyObject(position, { entrusts, exceptEntrusts, additionalEntrusts });
        console.log(position);
        api.position.saveOrUpdatePosition(position).subscribe({
            next: () => {
                message.success('操作成功!');
                // window.close();
                window.opener.onSuccess();
            }
        });
    };

    return (
        <IWindow
            current={current}
            className="snam-modal"
            title={(current && current.id) ? '编辑角色' : '新建角色'}
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="id" />
            <IFormItem xtype="hidden" name="orgId" />
            <ILayout type="vbox">
                <IFormItem
                    name="postName"
                    label="职位名称"
                    xtype="input"
                    required={true}
                    max={50}
                />
                <IFormItem
                    name="permScope"
                    label="权限范围"
                    xtype="dict"
                    tag={constant.DICT_POSITION_PERM_SCOPE_TAG}
                    required={true}
                    onChange={(v) => {
                        if (v && v === 'CUSTOMER_SPECIFIED') {
                            treeAllGroupsAndUsers();
                            setTreeVisible(true);
                            setUncheckTreeVisible(false);
                        } else {
                            treeAllGroupsAndUsers();
                            setTreeVisible(false);
                            setUncheckTreeVisible(true);
                        }
                    }}
                />
            </ILayout>
            {treeVisible && (
                <ISearchTree
                    bodyStyle={{ height: 210, overflow: 'auto' }}
                    iconRender={loopGroup}
                    blockNode={true}
                    treeData={treeData}
                    size="small"
                    bordered
                    checkable
                    checkedKeys={permGroupOrUserId}
                    onCheck={(checked) => {
                        setPermGroupOrUserId(checked);
                    }}
                    titleRender={(node) => (
                        <div style={{ width: '100%' }}>
                            <div style={{ float: 'left' }}>
                                {node.icon} {node.title}
                            </div>
                            <div style={{ float: 'right', zIndex: 999,marginRight: 5 }}>
                                <Space>
                                    <DeleteRowOutlined
                                        size="small"
                                        title='排除'
                                        onClick={(e) => onExceptUserPerm(node, e)}
                                    />
                                    <UsergroupAddOutlined
                                        size="small"
                                        title='添加'
                                        onClick={(e) => onEntrustUserPerm(node, e)}
                                    />
                                </Space>
                            </div>
                        </div>
                    )}
                />
            )}
            {uncheckTreeVisible && (
                <ISearchTree
                    bodyStyle={{ height: 210, overflow: 'auto' }}
                    iconRender={loopUnSelectGroup}
                    treeData={treeData}
                    size="small"
                    bordered
                    blockNode={true}
                    checkable={false}
                    titleRender={(node) => (
                        <div style={{ width: '100%' }}>
                            <div style={{ float: 'left' }}>
                                {node.icon} {node.title}
                            </div>
                            <div style={{ float: 'right', zIndex: 999,marginRight: 5 }}>
                                <Space>
                                    <DeleteRowOutlined
                                        size="small"
                                        title='排除'
                                        onClick={(e) => onExceptUserPerm(node, e)}
                                    />
                                    <UsergroupAddOutlined
                                        size="small"
                                        title='添加'
                                        onClick={(e) => onEntrustUserPerm(node, e)}
                                    />
                                </Space>
                            </div>
                        </div>
                    )}
                    
                />
            )}
            <Row gutter={2}>
                <Col span={12}>
                    <Table
                        size="small"
                        style={{ marginTop: '5px',marginBottom: '5px'}}
                        // className=" [&_.ant-table-body]:min-h-[180px]"
                        title={() => <><b>排除组织/用户列表</b></>}
                        scroll={{ y: 195, }}
                        bordered
                        rowKey="key"
                        columns={exceptColumns}
                        search={false}
                        dataSource={exceptDataSource}
                        rowSelection={{
                            onChange: (rowKeys) => {
                                setExceptSelectedKeys(rowKeys);
                            },
                        }}
                        pagination={false}
                    />
                </Col>
                <Col span={12}>
                    <Table
                        size="small"
                        style={{ marginTop: '5px',marginLeft:'2px',marginBottom: '5px'}}
                        // className=" [&_.ant-table-body]:min-h-[180px]"
                        title={() => <><b>委托组织/用户列表</b></>}
                        scroll={{ y: 195, }}
                        bordered
                        rowKey="key"
                        columns={entrustColumns}
                        search={false}
                        dataSource={entrustDataSource}
                        rowSelection={{
                            onChange: (rowKeys) => {
                                setEntrustSelectedKeys(rowKeys);
                            },
                        }}
                        pagination={false}
                    />
                </Col>
            </Row>
                                                
            <ILayout type="vbox">
                <IFormItem xtype="radio" name="beManager" label="是否主管" defaultValue={false} >
                    <Radio value={false}>否</Radio>
                    <Radio value={true}>是</Radio>
                </IFormItem>

                <IFormItem
                    name="note"
                    label="备注说明"
                    xtype="textarea"
                    rows={4}
                    max={200}
                />
            </ILayout>
        </IWindow>
    )
}