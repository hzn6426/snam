import { Card, Input, Tree } from 'antd';
import { useEffect, useState } from 'react';

import { copyObject, isFunction, useObservableAutoCallback } from '@/common/utils';
import { debounceTime, distinctUntilChanged, map, shareReplay, tap } from 'rxjs/operators';
import IIF from '../IIF';

// let dataList = [];
// let gData = [];
export default (props) => {

    const { conSelect, onCheck, checkedKeys, groupSelectable, treeData, placeholder, title, iconRender, bodyStyle, bordered, titleRender, checkable, ...others } = props;



    const { Search } = Input;

    // 自动展开父节点的状态
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    // // 树节点数据
    // const [treeData, setTreeData] = useState([]);
    // 展开的树节点key
    const [expandedKeys, setExpandedKeys] = useState([]);
    // 查询值
    const [searchValue, setSearchValue] = useState('');

    const [dataList, setDataList] = useState([]);
    const [allData, setAllData] = useState([]);

    const onExpand = (keys) => {
        setExpandedKeys(keys);
        setAutoExpandParent(false);
    };

    const generateList = (data) => {
        const list = [];
        for (let i = 0; i < data.length; i += 1) {
            const node = data[i];
            const { key, title } = node;
            list.push({ key, title });
            if (node.children) {
                list.push(...generateList(node.children));
            }
        }
        return list;
    };

    const getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i += 1) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some((item) => item.key === key)) {
                    parentKey = node.key;
                } else if (getParentKey(key, node.children)) {
                    parentKey = getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };

    const [onChange] = useObservableAutoCallback((event) =>
        event.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            map(([e, datalist, gdata]) => [e.target.value, datalist, gdata]),
            tap(([value, datalist, gdata]) => {
                const keys = datalist.map((item) => {
                    if (value && item.title.indexOf(value) > -1) {
                        return getParentKey(item.key, gdata);
                    }
                    return null;
                }).filter((item, i, self) => item && self.indexOf(item) === i);
                setExpandedKeys(keys);
                setSearchValue(value);
                setAutoExpandParent(true);
            }),
            shareReplay(1),
        ));

    // const loopGroup = (data) => {
    //     forEach((v) => {
    //         // 节点是组织不允许修改
    //         if (v.tag && v.tag === 'GROUP') {
    //             copyObject(v, { icon: <ApartmentOutlined /> });
    //         } else {
    //             copyObject(v, { icon: <UserOutlined style={{ color: '#52c41a' }} /> });
    //         }
    //         if (v.children && !isEmpty(v.children)) {
    //             loopGroup(v.children);
    //         }
    //     },data);
    // };

    const loop = (data) =>
        data.map((item) => {
            const index = item.title.indexOf(searchValue);
            const beforeStr = item.title.substr(0, index);
            const afterStr = item.title.substr(index + searchValue.length);
            const title =
                index > -1 ? (
                    <span>
                        {beforeStr}
                        <span className="site-tree-search-value">{searchValue}</span>
                        {afterStr}
                    </span>
                ) : (
                    <span>{item.title}</span>
                );
            if (item.children) {
                const c = {};
                copyObject(c, item, {
                    title,
                    key: item.key,
                    text: item.title,
                    parentGroupName: item.parentGroupName,
                    children: loop(item.children),
                });
                return c;
            }
            const d = {};
            copyObject(d, item, { title, text: item.title, parentGroupName: item.parentGroupName });
            return d;
        }
        );
    const initTreeData = (data) => {
        //dataList = [];
        setDataList([]);
        const gbdata = _.cloneDeep(data);
        setAllData(gbdata);
        if (iconRender && isFunction(iconRender)) {
            iconRender(data);
        }
        const list = generateList(gbdata);
        setDataList(list);
    }


    useEffect(() => {
        initTreeData(treeData);
    }, [treeData]);

    return (
        <Card
            size="small"
            title={
                <>
                    <IIF test={title ? true : false}>
                        <span style={{ flat: 'right', padding: '5' }}>{title}</span>
                        <div style={{ float: 'right', paddingRight: '1px', width: '80%' }}>
                            <Search
                                style={{ marginTop: '0px' }}
                                size="small"
                                placeholder={placeholder || "输入名称搜索"}
                                enterButton
                                onChange={(e) => onChange([e, dataList, allData])}
                            />
                        </div>
                    </IIF>
                    <IIF test={!title ? true : false}>
                        <div style={{ float: 'right', width: '100%' }}>
                            <Search
                                style={{ marginTop: '0px' }}
                                size="small"
                                placeholder={placeholder || "输入名称搜索"}
                                enterButton
                                onChange={(e) => onChange([e, dataList, allData])}
                            />
                        </div>
                    </IIF>
                </>
            }
            bordered={bordered === false ? false : true}
            bodyStyle={bodyStyle || { height: 'calc(100vh - 190px)', overflow: 'scroll' }}
        >
            <Tree
                // showIcon={showIcon}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                // switcherIcon={<CaretDownOutlined />}
                treeData={loop(treeData)}
                // treeData={treeData}
                checkable={checkable}
                // checkStrictly
                checkedKeys={checkedKeys}
                onCheck={onCheck}
                // iconRender={iconRender}
                titleRender={titleRender}
                {...others}
            />
        </Card>
    )

}