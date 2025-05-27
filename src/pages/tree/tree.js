import { Button, Card, Space, Splitter, Tabs } from "antd";
import cx from "classnames";
import { nanoid } from "nanoid";
import * as R from 'ramda';
import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import {
    InteractionMode,
    StaticTreeDataProvider,
    Tree,
    UncontrolledTreeEnvironment,
    ControlledTreeEnvironment
} from "react-complex-tree";
import "react-complex-tree/lib/style-modern.css";
import { template } from "./data";
import "./index.less";
import { useIsMounted } from './useIsMounted';
import { copyObject, produce, INewWindow, every, forEach, pluck } from "@/common/utils";
import stringRandom from 'string-random';
import { useApplicationState } from '@/store/state';
import child from "../dict/child";
import ICodeEditor from "@/components/ICodeEditor";
import groovyBeautify from "groovy-beautify";
import {
    IAGrid,
    IGridSearch,
} from '@/common/components';

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
//列初始化
const initColumns = [
    {
        headerName: '序号',
        textAlign: 'center',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        lockPosition: 'left',
        width: 80,
        cellStyle: { userSelect: 'none' },
        valueFormatter: (params) => {
            return `${parseInt(params.node.id) + 1}`;
        },
    },
    {
        headerName: '变量代码',
        width: 80,
        field: 'code',
    },
    {
        headerName: '变量名称',
        width: 90,
        align: 'left',
        field: 'name',
    }, {
        headerName: '变量类型',
        width: 90,
        align: 'left',
        field: 'type',
    },]

    //列初始化
const initLocalColumns = [
    {
        headerName: '序号',
        textAlign: 'center',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        lockPosition: 'left',
        width: 80,
        cellStyle: { userSelect: 'none' },
        valueFormatter: (params) => {
            return `${parseInt(params.node.id) + 1}`;
        },
    },
    {
        headerName: '变量名称',
        width: 90,
        align: 'left',
        field: 'name',
    }, {
        headerName: '变量类型',
        width: 90,
        align: 'left',
        field: 'type',
    },]
const { TabPane } = Tabs;
export default () => {

    const {
        variables,
        currentItems,
        addRuleItem,
        removeRuleItem,
        updateRuleItem,
        updateChild,
        addOrUpdateVariable,
        deleteVariable,
    } = useApplicationState((s) => ({
        variables:s.variables,
        currentItems: s.items,
        addRuleItem: s.actions.addRuleItem,
        removeRuleItem: s.actions.removeRuleItem,
        updateRuleItem: s.actions.updateRuleItem,
        updateChild: s.actions.updateChild,
        addOrUpdateVariable:s.actions.addOrUpdateVariable,
        deleteVariable:s.actions.deleteVariable
    }));

    useEffect(() => {
        console.log(currentItems);
    }, [currentItems]);

    const ref = useRef();
    const tree = useRef();
    const menu = useRef();
    const globalVariableRef = useRef();
    const localVariableRef = useRef();

    const [key, setKey] = useState('globalVariable');

    // const [localDataSource, setLocalDataSource] = useState([]);

    const [dataSource, setDataSource] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [selectedKeys, setSelectedKeys] = useState([]);


    // const [items,setItems] = useState({ ...template });
    // let items = { ...template };
    // const [currentItems, setCurrentItems] = useState({ ...template });
    const [focusedItem, setFocusedItem] = useState();
    const [expandedItems, setExpandedItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [beFresh, setBeFresh] = useState(false);

    const onChange = (records) => {
        setSelectedKeys(pluck('id', records));
    }

    const onGlobalDoubleClick = (id) => {
        INewWindow({
            url: '/new/globalVariable/' + id,
            title: '全局变量',
            width: 600,
            height: 500,
        });
    }

    //查询
    const searchGlobalVariable = (pageNo, pageSize, params) => {
        setSelectedKeys([]);
        setSearchLoading(true);
        setPageNo(pageNo);
        setPageSize(pageSize);
        let param = { dto: params || {}, pageNo: pageNo, pageSize: pageSize };
        // api.logger.searchLogger(param).subscribe({
        //     next: (data) => {
        //         setDataSource(data.data);
        //         setTotal(data.total);
        //     },
        // }).add(() => {
        //     setSearchLoading(false);
        // });
    };

    const doPreview = () => {
        const values = [];
        const doLoopCode = (children) => {
            forEach(index => {
                const item = currentItems[index];
                if (item.isFolder) {
                    let express = '';
                    if (item.type == 'if') {
                        express = express + `if(${item.data.express}){`;
                    } else if (item.type == 'elseif') {
                        express = express + ` else if(${item.data.express}){`;
                    } else if (item.type == 'else') {
                        express = express + ` else{`;
                    } else if (item.type == 'for' || item.type == 'for_item') {
                        express = express + `for(${item.data.express}){`
                    } else if (item.type == 'while') {
                        express = express + `while(${item.data.express}){`
                    } else if (item.type == 'catch') {
                        express = express + `catch(${item.data.express}){`
                    } else {
                        express = express + `${item.data.express} {`;
                    }
                    values.push(express);
                    if (item.children.length > 0) {
                        doLoopCode(item.children);
                    }
                    values.push(`}`);
                    // values.push(express);
                } else {
                    values.push(item.data.express + '');
                }
            }, children);
        }
        doLoopCode(currentItems['root'].children);
        return values.join('\r\n');
    }

    // let provider = useMemo(
    //     () => {
    //         return new StaticTreeDataProvider(currentItems, (item, data) => ({
    //             ...item,
    //             data,
    //         }))
    //     },
    //     [currentItems]
    // );


    // const getTreeItem = async (itemId) => {
    //     return provider.getTreeItem(itemId);
    // }

    // const getTreeItems = async (itemIds) => {
    //     return provider.getTreeItems
    //         ? provider.getTreeItems(itemIds)
    //         : Promise.all(itemIds.map(id => provider.getTreeItem(id)));
    // }

    const onChangeItemChildren = async (
        itemId,
        newChildren
    ) => {
        updateChild(itemId, newChildren)
        // return provider.onChangeItemChildren?.(itemId, newChildren);
    }

    // const onDidChangeTreeData = async (listener) => {
    //     return provider.onDidChangeTreeData
    //         ? provider.onDidChangeTreeData(listener)
    //         : { dispose: () => { } };
    // }

    // const onRenameItem = async (item, name) => {
    //     return provider.onRenameItem?.(item, name);
    // }

    const [viewState, setViewState] = useState({
        "tree-1": {
            focusedItem,
            expandedItems,
            selectedItems,
        },
    });

    const updateItem = (data, items) => {
        console.log(items);
        console.log(data);
        const d = { ...items[data.index] };
        console.log(d);
        d.data = { ...d.data, ...data };
        // copyObject(o[data.index]?.data,{desc:data.desc,express:data.express});
        updateRuleItem(d);
        // provider.onDidChangeTreeDataEmitter.emit(['root']);
    };
    const callback = (data) => {
        updateItem(data);
    }
    // const [selectedItem, setSelectedItem] = useState();
    const onDoubleClick = (e, item, items) => {
        console.log(item);
        console.log(currentItems);
        if (item.beMenu) {
            return;
        }
        const { type } = item;
        if (type == 'variable') {
            INewWindow({
                url: '/new/rule/variable/' + item.index,
                title: '定义变量',
                width: 600,
                height: 500,
                callback: (data) => {
                    updateItem(data, items);
                    addOrUpdateVariable({name:data.name,type:data.type});
                },
                callparam: () => item,
            });
        } else if (type == 'set_object') {
            INewWindow({
                url: '/new/rule/assign/' + item.index,
                title: '对象赋值',
                width: 600,
                height: 500,
                callback: (data) => updateItem(data, items),
                callparam: () => item,
            });
        } else if (type == 'convert_data') {
            INewWindow({
                url: '/new/rule/objectConvert/' + item.index,
                title: '对象转换',
                width: 600,
                height: 500,
                callback: (data) => updateItem(data, items),
                callparam: () => item,
            });
        } else if (type == 'if') {
            INewWindow({
                url: '/new/rule/ifCondition/' + item.index,
                title: 'IF条件',
                width: 600,
                height: 500,
                callback: (data) => updateItem(data, items),
                callparam: () => item,
            });
        } else if (type == 'elseif') {
            INewWindow({
                url: '/new/rule/elseIfCondition/' + item.index,
                title: 'ELSE IF条件',
                width: 600,
                height: 500,
                callback: (data) => updateItem(data, items),
                callparam: () => item,
            });
        } else if (type == 'groovy') {
            INewWindow({
                url: '/new/rule/groovyCode/' + item.index,
                title: 'Groovy 代码段',
                width: 600,
                height: 500,
                callback: (data) => updateItem(data, items),
                callparam: () => item,
            });
        } else if (type == 'json_parse') {
            INewWindow({
                url: '/new/rule/jsonToObject/' + item.index,
                title: 'Json转换为对象',
                width: 600,
                height: 500,
                callback: (data) => updateItem(data, items),
                callparam: () => item,
            });
        } else if (type == 'json_to_text') {
            INewWindow({
                url: '/new/rule/objectToJson/' + item.index,
                title: '转换为Json文本',
                width: 600,
                height: 500,
                callback: (data) => updateItem(data, items),
                callparam: () => item,
            });
        } else if (type == 'while') {
            INewWindow({
                url: '/new/rule/whileLoop/' + item.index,
                title: 'While条件循环',
                width: 600,
                height: 500,
                callback: (data) => updateItem(data, items),
                callparam: () => item,
            });
        } else if (type == 'for') {
            INewWindow({
                url: '/new/rule/forNumberLoop/' + item.index,
                title: 'For次数循环',
                width: 600,
                height: 500,
                callback: (data) => updateItem(data, items),
                callparam: () => item,
            });
        } else if (type == 'for_item') {
            INewWindow({
                url: '/new/rule/forItemLoop/' + item.index,
                title: 'For项目循环',
                width: 600,
                height: 500,
                callback: (data) => updateItem(data, items),
                callparam: () => item,
            });
        } else if (type == 'return') {
            INewWindow({
                url: '/new/rule/returnData/' + item.index,
                title: 'return返回数据',
                width: 600,
                height: 500,
                callback: (data) => updateItem(data, items),
                callparam: () => item,
            });
        } else if (type == 'catch') {
            INewWindow({
                url: '/new/rule/catchException/' + item.index,
                title: '捕获异常',
                width: 600,
                height: 500,
                callback: (data) => updateItem(data, items),
                callparam: () => item,
            });
        } else if (type == 'throw') {
            INewWindow({
                url: '/new/rule/throwException/' + item.index,
                title: '抛出异常',
                width: 600,
                height: 500,
                callback: (data) => updateItem(data, items),
                callparam: () => item,
            });
        } else if (type == 'db_select') {
            INewWindow({
                url: '/new/rule/selectSqlCode/' + item.index,
                title: 'Select查询',
                width: 600,
                height: 500,
                callback: (data) => updateItem(data, items),
                callparam: () => item,
            });
        }
    }

    // const isMounted = useIsMounted();
    // const writeItems = useCallback(
    //     (newItems) => {
    //         if (!isMounted.current) return;
    //         setRuleItem({ ...currentItems, ...newItems });
    //     },
    //     [isMounted]
    // );

    // useEffect(() => {
    //     const { dispose } = onDidChangeTreeData(changedItemIds => {
    //         getTreeItems(changedItemIds).then(items => {
    //             writeItems(
    //                 items
    //                     .map(item => ({ [item.index]: item }))
    //                     .reduce((a, b) => ({ ...a, ...b }), {})
    //             );
    //         });
    //     });

    //     return dispose;
    // }, [provider, writeItems]);

    const injectItem = (item) => {
        if (currentItems[item.index]) {
            return
        }
        // const o = {...currentItems};
        // o[item.index] = item;
        addRuleItem(item);

        // console.log(currentItems);
        // provider.onDidChangeTreeDataEmitter.emit(['root']);
    };
    const removeItem = () => {
        if (selectedItems.length == 0) return;
        removeRuleItem(selectedItems[0]);
        // provider.onDidChangeTreeDataEmitter.emit(['root']);
    };



    return (

        <Card style={{ margin: '5px' }} size="small" bodyStyle={{ padding: '0px' }} title={<div>规则设计器<span style={{ marginLeft: '12%' }}><Space>
            <Button size="small" type="primary" onClick={injectItem}>保存</Button>
            <Button size="small" type="primary" onClick={() => {
                const code = doPreview();
                const formatted = groovyBeautify(code);
                INewWindow({
                    url: '/new/rule/previewCode',
                    title: '代码预览',
                    width: 900,
                    height: 800,
                    callparam: () => formatted,
                });
                // setPreviewCode(formatted);
            }}>预览</Button>
            <Button size="small" danger onClick={removeItem}>删除节点</Button>
        </Space></span></div>}>
            <ControlledTreeEnvironment
                ref={ref}
                items={currentItems}
                getItemTitle={(item) => {
                    return item.data
                }}
                canDragAndDrop={true}
                canReorderItems={true}
                canDropOnFolder={true}
                canDropOnNonFolder={false}
                canDropBelowOpenFolders={true}
                defaultInteractionMode={{
                    mode: 'custom',
                    extends: InteractionMode.ClickItemToExpand,
                    createInteractiveElementProps: (item, treeId, actions, renderFlags) => ({
                        /**
                         * 1. avoid multi select
                         * 2. (will not work as isFocused is always true, ignore for now) focus on first click and select item if it's focused (second click)
                         * 3. if has children then toggle expand/collapse
                         */
                        onClick: e => { //avoid multi select
                            if (item.hasChildren) {
                                actions.toggleExpandedState();
                            }
                            if (!renderFlags.isFocused) {
                                actions.focusItem();
                            } else {
                                actions.selectItem();
                            }
                        },
                        // onDoubleClick: e => {
                        //     if (!renderFlags.isFocused) {
                        //         actions.focusItem();
                        //     } else {
                        //         actions.selectItem();
                        //     }
                        //     console.log('double click',currentItems);
                        //     onDoubleClick(e, item, currentItems);
                        // },
                        onFocus: (e) => {
                            actions.focusItem();
                        },
                    }),
                }}
                viewState={{
                    "tree-1": {
                        focusedItem,
                        expandedItems,
                        selectedItems,
                    },
                    "tree-0": {
                        focusedItem,
                        expandedItems,
                        selectedItems,
                    },
                }}
                onFocusItem={item => setFocusedItem(item.index)}
                onExpandItem={item => setExpandedItems([...expandedItems, item.index])}
                onCollapseItem={item =>
                    setExpandedItems(expandedItems.filter(expandedItemIndex => expandedItemIndex !== item.index))
                }
                onSelectItems={items => setSelectedItems(items)}
                onDrop={async (items, target) => {
                    const promises = [];
                    // items.forEach(item => {
                    //     item.index = item.index + '_' + nanoid();
                    // });
                    const copyItems = [];
                    R.forEach(item => {
                        const citem = {};
                        copyObject(citem, { ...item });
                        copyObject(citem, item.beMenu && {
                            index: stringRandom(16, { numbers: false }), beMenu: false,
                            isFolder: item.beFolder, children: []
                        });
                        copyItems.push(citem);
                    }, items);
                    // setCurrentItems({...items,...citem})
                    const itemsIndices = copyItems.map(i => i.index);
                    let itemsPriorToInsertion = 0;

                    // move old items out
                    for (const item of items) {
                        const parent = Object.values(currentItems).find(potentialParent =>
                            potentialParent?.children?.includes?.(item.index)
                        );

                        if (!parent) {
                            throw Error(`Could not find parent of item "${item.index}"`);
                        }

                        if (!parent.children) {
                            throw Error(
                                `Parent "${parent.index}" of item "${item.index}" did not have any children`
                            );
                        }
                        const targetParent = Object.values(currentItems).find(potentialParent =>
                            potentialParent?.children?.includes?.(target.parentItem)
                        );
                        if (targetParent && targetParent.beMenu == true) {
                            return;
                        }
                        //菜单按钮不允许拖拽有子节点的菜单
                        if (!!item.beMenu && item.children) {
                            return;
                        }

                        if (
                            target.targetType === 'between-items' &&
                            target.parentItem === item.index
                        ) {
                            // Trying to drop inside itself
                            return;
                        }



                        if (
                            (target.targetType === 'item' || target.targetType === 'root') &&
                            target.targetItem !== parent.index
                        ) {

                            if (item.beMenu == false) {
                                promises.push(
                                    onChangeItemChildren(
                                        parent.index,
                                        parent.children.filter(child => child !== item.index)
                                    )
                                );
                            }
                        }

                        if (target.targetType === 'between-items') {
                            if (target.parentItem === parent.index) {
                                const newParent = currentItems[target.parentItem];
                                const isOldItemPriorToNewItem =
                                    ((newParent.children ?? []).findIndex(
                                        child => child === item.index
                                    ) ?? Infinity) < target.childIndex;
                                itemsPriorToInsertion += isOldItemPriorToNewItem ? 1 : 0;
                            } else {
                                if (item.beMenu == false) {
                                    promises.push(
                                        onChangeItemChildren(
                                            parent.index,
                                            parent.children.filter(child => child !== item.index)
                                        )
                                    );
                                }

                            }
                        }
                    }
                    R.forEach(citem => {
                        injectItem(citem);
                    }, copyItems);

                    // insert new items
                    if (target.targetType === 'item' || target.targetType === 'root') {
                        const children = [
                            ...(currentItems[target.targetItem].children ?? []).filter(
                                i => !itemsIndices.includes(i)
                            ),
                            ...itemsIndices,
                        ]
                        promises.push(
                            onChangeItemChildren(target.targetItem, [...children])
                        );
                    } else {
                        const newParent = currentItems[target.parentItem];
                        const newParentChildren = [...(newParent.children ?? [])].filter(
                            c => !itemsIndices.includes(c)
                        );
                        newParentChildren.splice(
                            target.childIndex - itemsPriorToInsertion,
                            0,
                            ...itemsIndices
                        );
                        promises.push(
                            onChangeItemChildren(
                                target.parentItem,
                                newParentChildren
                            )
                        );
                    }
                    await Promise.all(promises);
                    // props.onDrop?.(items, target);
                }}
                renderItemTitle={({ title, item }) => {
                    // if (item.beMenu) {
                    //     return <div>{item.icon} {title}</div>
                    // }
                    return (
                        <div style={{ fontWeight: 'bold', fontSize: '13px' }} onDoubleClick={(e) => {
                            if (title.beMenu) {
                                return;
                            }
                            onDoubleClick(e, item, currentItems)
                        }}>{title.icon} {title.title}
                            <div style={{ color: '#999', fontSize: '10px' }}>{title.desc}</div>
                        </div>
                    )
                }}
                renderItem={({ item, depth, children, title, context, arrow }) => {
                    const InteractiveComponent = context.isRenaming ? 'div' : 'button';
                    return (
                        <li
                            {...(context.itemContainerWithChildrenProps)}
                            className={cx(
                                'rct-tree-item-li',
                                // (item.beMenu || 'code-height'),
                                item.hasChildren && 'rct-tree-item-li-hasChildren',
                                context.isSelected && 'rct-tree-item-li-selected',
                                context.isExpanded && 'rct-tree-item-li-expanded',
                                context.isFocused && 'rct-tree-item-li-focused',
                                context.isDraggingOver && 'rct-tree-item-li-dragging-over',
                                context.isSearchMatching && 'rct-tree-item-li-search-match'
                            )}

                        >
                            <div
                                {...(context.itemContainerWithoutChildrenProps)}
                                style={{ paddingLeft: `${(depth + 1) * (12)}px`, position: 'relative' }}
                                className={cx(
                                    'rct-tree-item-title-container',
                                    item.hasChildren && 'rct-tree-item-title-container-hasChildren',
                                    context.isSelected && 'rct-tree-item-title-container-selected',
                                    context.isExpanded && 'rct-tree-item-title-container-expanded',
                                    context.isFocused && 'rct-tree-item-title-container-focused',
                                    context.isDraggingOver && 'rct-tree-item-title-container-dragging-over',
                                    context.isSearchMatching && 'rct-tree-item-title-container-search-match'
                                )}
                            >
                                {/* <span  className={cx(
                                    'rct-tree-item-title-container',
                                    item.hasChildren && 'rct-tree-item-title-container-hasChildren',
                                    context.isSelected && 'rct-tree-item-title-container-selected',
                                    context.isExpanded && 'rct-tree-item-title-container-expanded',
                                    context.isFocused && 'rct-tree-item-title-container-focused',
                                    context.isDraggingOver && 'rct-tree-item-title-container-dragging-over',
                                    context.isSearchMatching && 'rct-tree-item-title-container-search-match'
                                )}> */}
                                {React.cloneElement(arrow, { style: { marginTop: '-15px' } })}
                                <InteractiveComponent
                                    {...(context.interactiveElementProps)}
                                    className={cx(
                                        'rct-tree-item-button',
                                        item.hasChildren && 'rct-tree-item-button-hasChildren',
                                        context.isSelected && 'rct-tree-item-button-selected',
                                        context.isExpanded && 'rct-tree-item-button-expanded',
                                        context.isFocused && 'rct-tree-item-button-focused',
                                        context.isDraggingOver && 'rct-tree-item-button-dragging-over',
                                        context.isSearchMatching && 'rct-tree-item-button-search-match'
                                    )}
                                >
                                    {title}
                                </InteractiveComponent>
                                {/* </span> */}
                            </div>
                            {children}
                        </li>
                    );

                }}
            >
                <Splitter style={{ height: 'calc(100vh - 50px)', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                    <Splitter.Panel defaultSize="15%" min="10%" collapsible>
                        <Tree id="tree-0" treeId="tree-0" rootItem="menu" treeLabel="Tree Example" ref={menu} />
                    </Splitter.Panel>
                    <Splitter.Panel>
                        <Splitter layout="vertical">
                            <Splitter.Panel>
                                <Tree id="tree-1" treeId="tree-1" rootItem="root" treeLabel="Tree Example" ref={tree} />
                            </Splitter.Panel>
                            <Splitter.Panel defaultSize="40%" min="20%" collapsible>
                                <Tabs
                                    bodyStyle={{ margin: 0, padding: 0 }}
                                    // style={{ marginTop: 20 }}
                                    activeKey={key}
                                    size="small"
                                    type="card"
                                    onChange={(activeKey) => {
                                        setKey(activeKey);

                                    }}>

                                    <TabPane tab="全局变量" key="globalVariable">
                                        <IAGrid
                                            size="small"
                                            ref={globalVariableRef}
                                            title="变量列表"
                                            height={290}
                                            // height={offsetHeight - 66}
                                            gridName="global_variable_list"
                                            // components={{
                                            //     stateCellRenderer: StateRenderer,
                                            // }}
                                            // columnsStorageKey="_cache_role_columns"
                                            columns={initColumns}
                                            request={(pageNo, pageSize) => searchGlobalVariable(pageNo, pageSize)}
                                            dataSource={dataSource}
                                            pageNo={pageNo}
                                            pageSize={pageSize}
                                            total={total}
                                            clearSelect={searchLoading}
                                            onSelectedChanged={onChange}
                                            // showTotal={false}
                                            onDoubleClick={(record) => onGlobalDoubleClick(record.id)}
                                        // toolBarRender={[
                                        //     <IGridSearch defaultValue={'createUserCnName'} size="small" onSearch={(params) => {
                                        //         let p = {};
                                        //         if (params.startTime) {
                                        //             p.startTime = params.startTime[0];
                                        //             p.endTime = params.startTime[1];
                                        //         } else {
                                        //             p = params;
                                        //         }
                                        //         searchGlobalVariable(1, pageSize, p);
                                        //     }}
                                        //         options={[{ label: '操作人', value: 'createUserCnName' }, { label: '来源系统', value: 'systemTag' }, { label: '模块名称', value: 'exchangeName' },
                                        //             { label: '状态', value: 'state', xtype: 'select', valueOptions: [{ label: '成功', value: 'SUCCESS' }, { label: '失败', value: 'FAILURE' }] },
                                        //             { label: '请求时间', value: 'startTime', xtype: 'datetimerange' }
                                        //         ]} />,
                                        // ]}
                                        />
                                    </TabPane>
                                    <TabPane tab="流程变量" key="localVariable">
                                        <IAGrid
                                            size="small"
                                            ref={localVariableRef}
                                            title="变量列表"
                                            height={290}
                                            // height={offsetHeight - 66}
                                            gridName="local_variable_list"
                                            // components={{
                                            //     stateCellRenderer: StateRenderer,
                                            // }}
                                            // columnsStorageKey="_cache_role_columns"
                                            columns={initLocalColumns}
                                            // request={(pageNo, pageSize) => searchGlobalVariable(pageNo, pageSize)}
                                            dataSource={variables}
                                            // pageNo={pageNo}
                                            // pageSize={pageSize}
                                            // total={total}
                                            // clearSelect={searchLoading}
                                            // onSelectedChanged={onChange}
                                            // showTotal={false}
                                            // onDoubleClick={(record) => onGlobalDoubleClick(record.id)}
                                        // toolBarRender={[
                                        //     <IGridSearch defaultValue={'createUserCnName'} size="small" onSearch={(params) => {
                                        //         let p = {};
                                        //         if (params.startTime) {
                                        //             p.startTime = params.startTime[0];
                                        //             p.endTime = params.startTime[1];
                                        //         } else {
                                        //             p = params;
                                        //         }
                                        //         searchGlobalVariable(1, pageSize, p);
                                        //     }}
                                        //         options={[{ label: '操作人', value: 'createUserCnName' }, { label: '来源系统', value: 'systemTag' }, { label: '模块名称', value: 'exchangeName' },
                                        //             { label: '状态', value: 'state', xtype: 'select', valueOptions: [{ label: '成功', value: 'SUCCESS' }, { label: '失败', value: 'FAILURE' }] },
                                        //             { label: '请求时间', value: 'startTime', xtype: 'datetimerange' }
                                        //         ]} />,
                                        // ]}
                                        />
                                    </TabPane>
                                </Tabs>

                            </Splitter.Panel>
                        </Splitter>
                    </Splitter.Panel>
                   
                </Splitter>

            </ControlledTreeEnvironment>
        </Card>
    );
}