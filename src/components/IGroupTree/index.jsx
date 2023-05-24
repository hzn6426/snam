import React, { useState, useEffect, useRef } from 'react';
import { Tree, Space, Card, Input } from 'antd';
import {
    ApartmentOutlined,
    UserOutlined,
    CaretDownOutlined
} from '@ant-design/icons';

import { api, forEach, isEmpty, copyObject, cloneDeep, useObservableAutoCallback } from '@/common/utils';
import { map, shareReplay, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {ISearchTree} from '@/common/components';
export default (props) => {

    const {...others } = props;
    const [treeData, setTreeData] = useState([]);
    
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
        },data);
    };

    const treeAllGroupsAndUsers = () => {
        api.group.treeAllGroupsAndUsers().subscribe({
            next: (data) => {
                setTreeData(data);
            }
        })
    }

    useEffect(() => {
        treeAllGroupsAndUsers();
    },[]);



    return (
        <ISearchTree
            iconRender={loopGroup}
            treeData={treeData}
            placeholder="输入组织或人员进行搜索"
            
            {...others}
            />
        // <Card
        //     size="small"
        //     title={
        //         <Space>
        //             <Search
        //                 style={{ marginTop: '3px', boxSizing: 'border-box', width: '530px' }}
        //                 size="small"
        //                 placeholder="输入组织或用户名搜索"
        //                 enterButton
        //                 onChange={onChange}
        //             />
        //         </Space>
        //     }
        //     bordered={true}
        //     bodyStyle={{ height: '400px', overflow: 'scroll' }}
        // >
        //     <Tree
        //         showIcon
        //         onExpand={onExpand}
        //         expandedKeys={expandedKeys}
        //         autoExpandParent={autoExpandParent}
        //         switcherIcon={<CaretDownOutlined />}
        //         treeData={loop(treeData)}
        //         // treeData={treeData}
        //         checkable
        //         // checkStrictly
        //         checkedKeys={checkedKeys}
        //         onCheck={onCheck}
        //     />
        // </Card>
    )
}