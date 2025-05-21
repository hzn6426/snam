import { Button, Card, Space, Splitter } from "antd";
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
import { CompleteTreeDataProvider } from "./CompleteTreeDataProvider";
import { useIsMounted } from './useIsMounted';
import { copyObject, produce, INewWindow } from "@/common/utils";
import { set } from "lscache";

function removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
export default () => {

    const ref = useRef();
    const tree = useRef();
    const menu = useRef();

    // const [items,setItems] = useState({ ...template });

    const [currentItems, setCurrentItems] = useState(template);
    const [focusedItem, setFocusedItem] = useState();
    const [expandedItems, setExpandedItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [beFresh, setBeFresh] = useState(false);


    const provider = useMemo(
        () => {
            return new StaticTreeDataProvider(currentItems, (item, data) => ({
                ...item,
                data,
            }))
        },
        [currentItems]
    );


    const getTreeItem = async (itemId) => {
        return provider.getTreeItem(itemId);
    }

    const getTreeItems = async (itemIds) => {
        return provider.getTreeItems
            ? provider.getTreeItems(itemIds)
            : Promise.all(itemIds.map(id => provider.getTreeItem(id)));
    }

    const onChangeItemChildren = async (
        itemId,
        newChildren
    ) => {
        return provider.onChangeItemChildren?.(itemId, newChildren);
    }

    const onDidChangeTreeData = async (listener) => {
        return provider.onDidChangeTreeData
            ? provider.onDidChangeTreeData(listener)
            : { dispose: () => { } };
    }

    const onRenameItem = async (item, name) => {
        return provider.onRenameItem?.(item, name);
    }

    const [viewState, setViewState] = useState({
        "tree-1": {
            focusedItem,
            expandedItems,
            selectedItems,
        },
    });

    const updateItem = (data) => {
        setCurrentItems(produce(currentItems, draft => {
            R.forEachObjIndexed((v, k) => {
                if (v.index == data.index) {
                    copyObject(v.data, data);
                }
            }, draft);
        }));
        
        provider.onDidChangeTreeDataEmitter.emit(['root']);
    };
    const callback = (data) => {
       updateItem(data);
    }
    // const [selectedItem, setSelectedItem] = useState();
    const onDoubleClick = (e, item) => {
        if (item.beMenu) {
            return;
        }
        const {type} = item;
        if (type == 'variable') {
            INewWindow({
                url: '/new/rule/variable/' + item.index,
                title: '编辑变量',
                width: 600,
                height: 300,
                callback: (data) => callback(data),
                callparam: () => item,
            });
        }
    }

    const isMounted = useIsMounted();
    const writeItems = useCallback(
        (newItems) => {
            if (!isMounted.current) return;
            setCurrentItems(oldItems => ({ ...oldItems, ...newItems }));
        },
        [isMounted]
    );

    useEffect(() => {
        const { dispose } = onDidChangeTreeData(changedItemIds => {
            getTreeItems(changedItemIds).then(items => {
                writeItems(
                    items
                        .map(item => ({ [item.index]: item }))
                        .reduce((a, b) => ({ ...a, ...b }), {})
                );
            });
        });

        return dispose;
    }, [provider, writeItems]);

    const injectItem = (item) => {
        if (currentItems[item.index]) {
            return
        }
        currentItems[item.index] = item;
        setCurrentItems(currentItems);
        provider.onDidChangeTreeDataEmitter.emit(['root']);
    };
    const removeItem = () => {
        if (selectedItems.length == 0) return;
        setCurrentItems(produce(currentItems, draft => {
            R.forEachObjIndexed((v, k) => {
                if (v.index == selectedItems[0]) {
                    delete draft[k];
                }
                if (v.children) {
                    removeItemOnce(v.children, selectedItems[0]);
                }
            }, draft);

        }));
        
        provider.onDidChangeTreeDataEmitter.emit(['root']);
    };

    

    return (

        <Card style={{ margin: '5px' }} size="small" bodyStyle={{ padding: '0px' }} title={<div>规则设计器<span style={{ marginLeft:'12%' }}><Space>
            <Button size="small" type="primary" onClick={injectItem}>保存</Button>
            <Button size="small" type="primary" onClick={() => {}}>预览</Button>
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
                        onDoubleClick: e => {
                            if (!renderFlags.isFocused) {
                                actions.focusItem();
                            } else {
                                actions.selectItem();
                            }
                            onDoubleClick(e, item);
                        },
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
                        copyObject(citem,item, item.beMenu && {index:item.index + '_' + nanoid(), beMenu:false,
                            isFolder: item.beFolder, children:[]});
                        copyItems.push(citem);
                    },items);
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
                    },copyItems);
                    
                    // insert new items
                    if (target.targetType === 'item' || target.targetType === 'root') {
                        const children = [
                                ...(currentItems[target.targetItem].children ?? []).filter(
                                    i => !itemsIndices.includes(i)
                                ),
                                ...itemsIndices,
                            ]
                        promises.push(
                            onChangeItemChildren(target.targetItem, children )
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
                        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{title.icon} {title.title}
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
                            <Splitter.Panel defaultSize="30%" min="10%" collapsible>
                                
                            </Splitter.Panel>
                        </Splitter>
                    </Splitter.Panel>
                    <Splitter.Panel defaultSize="15%" min="10%" collapsible>
                    </Splitter.Panel>
                </Splitter>

            </ControlledTreeEnvironment>
        </Card>
    );
}