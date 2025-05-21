import { Button, Card, Space, Splitter } from "antd";
import cx from "classnames";
import { nanoid } from "nanoid";
import * as R from 'ramda';
import React, { useMemo, useRef, useState } from 'react';
import {
    InteractionMode,
    StaticTreeDataProvider,
    Tree,
    UncontrolledTreeEnvironment
} from "react-complex-tree";
import "react-complex-tree/lib/style-modern.css";
import { template } from "./data";
import "./index.less";

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

    const [selectedItem, setSelectedItem] = useState();
    const onTreeItemDoubleClick = (e, item) => {
        console.log(item);
    }

    // const items = useMemo(() => ({ ...shortTree.items }), []);
      const items = useMemo(() => ({ ...template }), []);
      console.log(items);
    const dataProvider = useMemo(
        () =>
            new StaticTreeDataProvider(items, (item, data) => ({
                ...item,
                data,
            })),
        [items]
    );


    const injectItem = () => {
        const rand = nanoid();
        items[rand] = { data: 'New Item', index: rand };
        items.root.children.push(rand);
        dataProvider.onDidChangeTreeDataEmitter.emit(['root']);
    };
    const getFocus = () => ref.current.viewState['tree-1'].focusedItem || 'Fruit';
    const removeItem = () => {
        R.forEachObjIndexed((v, k) => {
            if (v.index == selectedItem.index) {
                delete items[k];
            }
            if (v.children) {
                removeItemOnce(v.children, selectedItem.index);
            }
        }, items);
        dataProvider.onDidChangeTreeDataEmitter.emit(['root']);
    };

    const changeItem = () => {
        R.forEachObjIndexed((v, k) => {
            if (v.index == selectedItem.index) {
                v.data = nanoid();
            }

        }, items);
        dataProvider.onDidChangeTreeDataEmitter.emit(['root']);
    }

    return (
        
        <Card style={{ margin: '5px' }} size="small" bodyStyle={{ padding: '0px' }} title={<div>树形控件<span style={{ float: 'right' }}><Space>
            <Button size="small" type="primary" onClick={injectItem}>添加节点</Button>
            <Button size="small" type="primary" onClick={changeItem}>更新节点</Button>
            <Button size="small" danger onClick={removeItem}>删除节点</Button>
        </Space></span></div>}>
            <UncontrolledTreeEnvironment
                ref={ref}
                dataProvider={dataProvider}
                getItemTitle={(item) => {
                    return item.data
                }}
                canDragAndDrop={true}
                canReorderItems={true}
                canDropOnFolder={true}
                canDropOnNonFolder={false}
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
                            setSelectedItem(item);
                            // console.log(item, actions, renderFlags)
                            if (item.hasChildren) actions.toggleExpandedState();
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
                            console.log(item);
                        },
                        onFocus: (e) => {
                            actions.focusItem();
                        },
                    }),
                }}
                viewState={{
                    "tree-1": {
                        expandedItems: ["root"],
                    },
                }}
                renderItemTitle={({ title,item }) => {
                    // if (item.beMenu) {
                    //    return <div>{item.icon} {title}</div>
                    // }
                    return (
                        <div style={{fontWeight:'bold',fontSize:'13px'}}>{title.icon} {title.title}
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
                <Splitter style={{ height: 'calc(100vh - 100px)', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <Splitter.Panel defaultSize="20%" min="10%" collapsible>
                 <Tree id="tree-0"  treeId="tree-0" rootItem="menu" treeLabel="Tree Example" ref={menu} />
                </Splitter.Panel>
                <Splitter.Panel>
                <Splitter layout="vertical">
                    <Splitter.Panel>
                    <Tree id="tree-1"  treeId="tree-1" rootItem="root" treeLabel="Tree Example" ref={tree} />
                    </Splitter.Panel>
                    <Splitter.Panel>
                   
                    </Splitter.Panel>
                </Splitter>
                </Splitter.Panel>
            </Splitter>
                
            </UncontrolledTreeEnvironment>
        </Card>
    );
}