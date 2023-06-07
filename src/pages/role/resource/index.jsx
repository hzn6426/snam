import { IFieldset, IFor, IFormItem, ILayout, IWindow } from '@/common/components';
import { api, contains, copyObject, forEach, forEachObject, groupBy, isEmpty, mapObjIndexed, produce, useAutoObservable, useAutoObservableEvent } from '@/common/utils';
import { Button, Card, Checkbox, Space, Tree, message } from 'antd';
import { useRef, useState } from 'react';
import { zip } from 'rxjs';
import { map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { useParams } from 'umi';

import {
    BarsOutlined,
    CheckSquareOutlined,
    CloseSquareOutlined,
    SaveOutlined,
    ScheduleOutlined
} from '@ant-design/icons';


const loop = (data) =>
    forEachObject((v, k, item) => {
        item.key = item.id;
        const index = item.name?.indexOf(searchValue);
        const beforeStr = item.name?.substr(0, index);
        const afterStr = item.name?.substr(index + searchValue.length);
        const name =
            index > -1 ? (
                <span>
                    {beforeStr}
                    <span className="site-tree-search-value">{searchValue}</span>
                    {afterStr}
                </span>
            ) : (
                <span>{item.name}</span>
            );
        if (item.children) {
            const c = {};
            copyObject(c, item, {
                name,
                id: item.id,
                key: item.key,
                title: item.name,
                parentGroupName: item.parentGroupName,
                children: loop(item.children),
            });
            return c;
        }
        const d = {};
        copyObject(d, item, { name, title: item.name, parentGroupName: item.parentGroupName });
        //console.log("Item的ID应为:" + item.id);
        return d;
    }, data);

//渲染图标
const addIcon = (data) => {
    if (isEmpty(data)) return;
    forEach((v) => {
        if (v.tag === 'MENU') {
            copyObject(v, { icon: <BarsOutlined /> });
        } else {
            copyObject(v, { icon: <ScheduleOutlined /> });
        }
        if (v.children && !isEmpty(v.children)) {
            addIcon(v.children);
        }
    }, data);
};

export default (props) => {
    const ref = useRef();
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);

    const [userPerms, setUserPerms] = useState([]);
    // 分配用户窗口中树的数据
    const [treeData, setTreeData] = useState([]);
    // 根据菜单ID获取对应的按钮列表
    const [menuId, setMenuId] = useState();
    const [menuName, setMenuName] = useState('');
    // 分配的按钮数据
    const [permButtons, setPermButtons] = useState({});

    const [groupButtons, setGroupButtons] = useState({});


    const [current, setCurrent] = useAutoObservable((inputs$) =>
        inputs$.pipe(
            map(([id]) => id),
            switchMap((id) => zip(api.role.treeAllMenus(), api.role.listPermMenus(id))),
            map(([menus, permMenus]) => {
                addIcon(menus);
                setTreeData(menus);
                setUserPerms(permMenus)
                return { roleId: params.id };
            })
        ),
        [params.id],
    )

    const [onClickMenu] = useAutoObservableEvent(
        [
            tap(() => setLoading(true)),
            switchMap(([menuId, roleId]) => zip(api.role.listAllButtonsByMenu(menuId), api.role.listPermButtons(roleId, menuId))),
            map(([buttons, permButtonIds]) => {
                const results = [];
                forEach((v) => {
                    results.push({ label: v.buttonName, value: v.id, subMenu: v.subMenu });
                }, buttons);
                // setAllButtons(results);
                const grouped = groupBy(function (b) {
                    return b.subMenu;
                }, results);
                const permIdGrouped = {};
                mapObjIndexed(function (num, key, obj) {
                    permIdGrouped[key] = [];
                    const arr = obj[key];
                    forEach(function (v) {
                        if (contains(v.value, permButtonIds)) {
                            permIdGrouped[key].push(v.value);
                        }
                    }, arr);
                }, grouped);
                setGroupButtons(grouped);
                setPermButtons(permIdGrouped);
            }),
            shareReplay(1),
        ],
        () => setLoading(false),
    );

    const onMenuSave = (privileges) => {
        api.role.saveMenuPerm(privileges).subscribe({
            next: () => {
                message.success('操作成功!');
            }
        });
    }

    const onButtonSave = (privileges) => {
        api.role.saveButtonPerm(privileges).subscribe({
            next: () => {
                message.success('操作成功!');
            }
        })
    }

    return (
        <IWindow
            current={current}
            saveVisible={false}
            className="snam-modal"
            title='角色授权'
            width={clientWidth}
            height={clientHeight}
            //onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="hidden" name="roleId" />
            <ILayout type="hbox" spans="12 12" gutter="8">
                <Card
                    size="small"
                    bordered={true}
                    title={
                        <>
                            <span>菜单列表</span>
                            <div style={{ float: 'right', paddingRight: '10px' }}>
                                <Space>
                                    <Button
                                        size="small"
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        onClick={() => {
                                            const privileges = { menus: userPerms, roleId: params.id };
                                            onMenuSave(privileges);
                                        }}
                                    >
                                        保存
                                    </Button>
                                </Space>
                            </div>
                        </>
                    }
                    bodyStyle={{ height: clientHeight - 130, overflow: 'scroll' }}
                >
                    <Tree
                        showIcon
                        treeData={loop(treeData)}
                        checkable
                        checkedKeys={userPerms}
                        onCheck={(checked) => setUserPerms(checked)}
                        onSelect={(keys, { selected, node }) => {
                            if (selected && node.isLeaf) {
                                onClickMenu([keys[0], current.roleId]);
                                // loadPermButtons(keys[0]);
                                setMenuId(keys[0]);
                                setMenuName(node.title);
                            }
                        }}
                    />
                </Card>

                <Card
                    size="small"
                    bordered={true}
                    bodyStyle={{ height: clientHeight - 130, overflow: 'scroll' }}
                    title={
                        <>
                            <span>功能按钮列表</span>
                            <div style={{ float: 'right', paddingRight: '10px' }}>
                                <Space>
                                    <Button
                                        size="small"
                                        icon={<CheckSquareOutlined />}
                                        onClick={() => {
                                            const v = {};
                                            mapObjIndexed(function (_, key, obj) {
                                                v[key] = [];
                                                const arr = obj[key];
                                                forEach(function (item) {
                                                    v[key].push(item.value);
                                                }, arr);
                                            }, groupButtons);
                                            setPermButtons(v);
                                        }}
                                    >
                                        全选
                                    </Button>
                                    <Button
                                        size="small"
                                        icon={<CloseSquareOutlined />}
                                        onClick={() => {
                                            setPermButtons({});
                                        }}
                                    >
                                        反选
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="small"
                                        icon={<SaveOutlined />}
                                        onClick={() => {
                                            const permButtonIds = [];
                                            mapObjIndexed(function (_, key, obj) {
                                                permButtonIds.push(...obj[key]);
                                            }, permButtons);
                                            // console.log(permButtonIds)
                                            const privileges = {
                                                buttons: permButtonIds,
                                                menuId,
                                                roleId: current.roleId,
                                            };
                                            onButtonSave(privileges);
                                        }}
                                    >
                                        保存
                                    </Button>
                                </Space>
                            </div>
                        </>
                    }
                >
                    <IFor
                        in={groupButtons}
                        as={(item, { key }) => (
                            <IFieldset title={key}>
                                <Checkbox.Group
                                    options={item}
                                    value={permButtons[key]}
                                    onChange={(checkedValue) => {
                                        const values = produce(permButtons, (draft) => {
                                            if (!draft[key]) {
                                                draft[key] = [];
                                            }
                                            draft[key] = checkedValue;
                                        });
                                        // console.log(checkedValue);
                                        // console.log(values);
                                        setPermButtons(values);
                                    }}
                                />
                            </IFieldset>
                        )}
                    />
                </Card>
            </ILayout>
        </IWindow>
    )
}