import { Card, Input, Row, Select, Space, Tree, Col } from 'antd';
import { useEffect, useState } from 'react';

import { copyObject, isFunction, useObservableAutoCallback } from '@/common/utils';
import { debounceTime, distinctUntilChanged, map, shareReplay, tap } from 'rxjs/operators';
import {IIF} from '@/common/components';

// let dataList = [];
// let gData = [];
export default (props) => {

    const { conSelect, onCheck, checkedKeys, groupSelectable, 
        treeData, selectData, placeholder, title, iconRender, 
        bodyStyle, bordered, titleRender, checkable, 
        defaultExpandAll, defaultExpandedKeys, onSelectChange,style,
        ...others } = props;



    const { Search } = Input;

    // 自动展开父节点的状态
    const [autoExpandParent, setAutoExpandParent] = useState(true);
    // // 树节点数据
    // const [treeData, setTreeData] = useState([]);
    // 展开的树节点key
    const [expandedKeys, setExpandedKeys] = useState(defaultExpandedKeys || []);
    // 查询值
    const [searchValue, setSearchValue] = useState('');

    const [dataList, setDataList] = useState([]);
    const [allData, setAllData] = useState([]);

    const onExpand = (expandedKeysValue) => {
        setExpandedKeys(expandedKeysValue);
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
            const beforeStr = item.title.substring(0, index);
            const afterStr = item.title.substring(index + searchValue.length);
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
            className='snam-card'
            style={style}
            title={
                <>
                    <IIF test={title ? true : false}>
                        <Row>
                            <Col span={4}>
                                <span style={{ float: 'right', padding: '5' }}>{title}</span>
                            </Col>
                            <Col span={8}>
                                <Space>
                                    <span style={{ float: 'right', padding: '5' }}>资源类型:</span>
                                    <Select size='small' style={{ width: '100%' }} options={selectData} onChange={onSelectChange} />
                                </Space>
                            </Col>
                            <Col span={12}>
                                <div style={{ float: 'right', width: '100%' }}>
                                    <Search
                                        style={{ marginTop: '0px' }}
                                        size="small"
                                        placeholder={placeholder || "输入名称搜索"}
                                        enterButton
                                        onChange={(e) => onChange([e, dataList, allData])}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </IIF>
                    <IIF test={!title ? true : false}>
                        <Row gutter={5}>
                            {/* <Col span={5}>
                                <span style={{ float: 'right', padding: '2px 1px 3px 0px',fontWeight:'normal',fontSize:13 }}>资源类型:</span>
                            </Col> */}
                            <Col span={10}>
                                 <Select placeholder="选择资源类型" size='small' style={{ width: '100%' }} options={selectData} onChange={onSelectChange} />
                            </Col>
                            <Col span={14}>
                                <div style={{ float: 'right', width: '100%' }}>
                                    <Search
                                        style={{ marginTop: '0px' }}
                                        size="small"
                                        placeholder={placeholder || "输入名称搜索"}
                                        enterButton
                                        onChange={(e) => onChange([e, dataList, allData])}
                                    />
                                </div>
                            </Col>
                        </Row>
                        
                    </IIF>
                </>
            }
            // style={{ borderRadius: '10px' }}
            bordered={bordered === false ? false : true}
            bodyStyle={bodyStyle}
        >
            <Tree
                // showIcon={showIcon}
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                autoExpandParent={autoExpandParent}
                defaultExpandAll={defaultExpandAll}
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