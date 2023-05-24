import React, { useEffect, useState } from 'react';
import { api, useAutoObservable, split, constant, isEmpty, forEach, copyObject, produce } from '@/common/utils';
import { IFormItem, ILayout, ISearchTree, IWindow } from '@/common/components';
import { message, Card, Radio } from 'antd';
import { filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { useParams } from 'umi';
import { ApartmentOutlined, UserOutlined } from '@ant-design/icons';
import { zip } from 'rxjs'

export default (props) => {
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    // 分配用户窗口中树的数据
    const [treeData, setTreeData] = useState([]);
    // 树显示
    const [treeVisible, setTreeVisible] = useState(false);
    // 选中的自定义职位权限范围
    const [permGroupOrUserId, setPermGroupOrUserId] = useState([]);

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

    const getPosition = (id) => {
        zip(api.position.getPosition(id), api.position.listEntrusByPosition(id)).subscribe({
            next: ([data, data2]) => {
                setPermGroupOrUserId(data2);
                const position = data[0];
                const sparams = window.opener.onGetParams();
                copyObject(position, sparams);
                setCurrent(position);
                if (position.permScope === 'CUSTOMER_SPECIFIED') {
                    setTreeVisible(true);
                } else {
                    setTreeVisible(false);
                }
            }
        });
    }

    useEffect(() => {
        if (params.id !== 'ADD') {
            getPosition(params.id);
        } else {
            const sparams = window.opener.onGetParams() || {};
            console.log(sparams);
            setCurrent(sparams);
        }
        treeAllGroupsAndUsers();
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
            // 节点是组织不允许修改
            if (v.tag && v.tag === 'GROUP') {
                copyObject(v, { icon: <ApartmentOutlined /> });
            } else {
                copyObject(v, { icon: <UserOutlined style={{ color: '#52c41a' }} /> });
            }
            if (v.children && !isEmpty(v.children)) {
                loopGroup(v.children);
            }
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
        copyObject(position, { entrusts });
        console.log()
        api.position.saveOrUpdatePosition(position).subscribe({
            next: () => {
                message.success('操作成功!');
                window.close();
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
                        } else {
                            setTreeVisible(false);
                        }
                    }}
                />
            </ILayout>
            {treeVisible && (
                <ISearchTree
                    bodyStyle={{ height: 'calc(100vh - 345px)', overflow: 'scroll' }}
                    iconRender={loopGroup}
                    showIcon={true}
                    treeData={treeData}
                    checkable
                    checkedKeys={permGroupOrUserId}
                    onCheck={(checked) => {
                        setPermGroupOrUserId(checked);
                    }}
                />
            )}
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