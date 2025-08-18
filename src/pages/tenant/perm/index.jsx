import { Space, Splitter, Tabs } from "antd"
import { IAGrid, ISearchTree, IStatus, Permit } from '@/common/components';
import defaultSettings from '../../../../config/defaultSettings';
import { iconEnum } from '@/common/icons';
import KeepAlive, { useAliveController } from 'react-activation';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { ConfigProvider, Dropdown, Input, Spin,Avatar } from 'antd';
import { use, useEffect, useState } from 'react';
import { Link, history } from 'umi';
import { api, constant,forEach } from '@/common/utils';
import { calc } from "antd/es/theme/internal";
import objectAssign from "object-assign";
import User from '../user';
import Role from '../role';
import Group from '../group';
import USet from '../uset';
import Position from '../position';
import TabPane from "antd/es/tabs/TabPane";
import { set } from "lscache";
import { useParams } from 'umi';
export default () => {
    const params = useParams();
    const [settings, setSettings] = useState(localStorage.getItem("settings") == null ? defaultSettings : JSON.parse(localStorage.getItem("settings")));
    const [tabList, setTabList] = useState([]);
    const [actionTab, setActionTab] = useState({});
    const { dropScope, refresh, clear } = useAliveController();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [menuData, setMenuData] = useState([]);
    const [pathname, setPathname] = useState('');

    const [treeData, setTreeData] = useState([]);
    // 选中的组织ID
    const [selectedMenuId, setSelectedMenuId] = useState();
    // 选中的组织名称
    const [selectedMenuName, setSelectedMenuName] = useState();

    //设置图标
    const loop = (data) => {
        forEach((v) => {
            if (v.icon) {
                objectAssign(v, {
                    icon: iconEnum(v.icon),
                });
            }
            if (v.children && !isEmpty(v.children)) {
                loop(v.children);
            } else {
                objectAssign(v, {
                    isLeaf: true,
                });
            }
        }, data);
    };
    // 添加标签
    const addTab = (addItem) => {
    //     setPathname(addItem.pathname);
    // // 缓存页面
        let items = tabList.filter((item) => { return item.key == addItem.key });
        if (items.length == 0) {
            const tab = { key: addItem.key, tab: addItem.name }
            if (tab.key === 'user') {
                tab.component = <User tenantId={params.id}/>
            } else if (tab.key === 'role') {
                tab.component = <Role tenantId={params.id}/>
            } else if (tab.key === 'group') {
                tab.component = <Group tenantId={params.id}/>
            } else if (tab.key === 'uset') {
                tab.component = <USet tenantId={params.id}/>
            } else if (tab.key === 'position') {
                tab.component = <Position tenantId={params.id}/>
            }
            setActionTab(tab);
            let newTabs = tabList.concat(tab);
            setTabList(newTabs);
        } else {
            setActionTab(items[0]);
        }
    }

    const removeTab = (key) => {
        let items = tabList.filter((item) => { return item.key !== key });
        if (items.length > 0) {
            setActionTab(items[items.length - 1]);
        }
        setTabList(items);
    }

    const loadMenu = (tenantId) => {
        setLoading(true);
        api.tuser
            .loadUserMenus(tenantId)
            .subscribe({
                next: (data) => {
                    const menus = data[0]?.children;
                    forEach((m) => {
                        m.title = m.name;
                        m.key = m.id;
                    },menus)
                    setTreeData(menus);
                },
            })
            .add(() => setLoading(false));
    };
    
    const onEdit = (targetKey, action) => {
        if (action !== 'add') {
            removeTab(targetKey);
        }
    };

    useEffect(() => {
        loadMenu(params.id);
        return () => {
            setTabList([]);
        };
    }, [params.id]);

     // 菜单重构
    // const menuDataRender = (menuList) => {
    //     return menuList.map((item) => {
    //         const localItem = {
    //             ...item,
    //             name: item.name,
    //             locale: true,
    //             icon: iconEnum(item.icon),
    //             routes: item.routes ? menuDataRender(item.routes) : undefined,
    //         };
    //         return localItem;
    //     });
    // };

    
    return (
        <Splitter style={{ height: '100vh', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            <Splitter.Panel defaultSize="15%" collapsible>
                <ISearchTree
                        iconRender={loop}
                        blockNode={true}
                        treeData={treeData}
                        bodyStyle={{ height: 'calc(100vh - 40px)', overflow: 'scroll',padding:'0px',margin:'0px' }}
                        titleRender={(node) => (
                            <div style={{ width: '100%',height:'40px',lineHeight:'40px',verticalAlign: 'middle'}}>
                                    <Space>{node.icon}{node.title}</Space>
                            </div>
                        )}
                        onSelect={(keys, { selected, node }) => {
                            if (selected) {
                                setSelectedMenuId(node.key);
                                setSelectedMenuName(node.title);
                                addTab(node)
                            }
                        }}
                    />
            </Splitter.Panel>
            <Splitter.Panel>
                <Tabs
                    hideAdd
                    activeKey={actionTab.key}
                    size="small"
                    type="editable-card"
                    onEdit={onEdit}
                    tabPosition={'top'}
                    className={'cala-body tabPage'}
                    onChange={(activeKey) => {
                        const tabs = tabList.filter((item) => item.key == activeKey);
                        setActionTab(tabs[0]);
                    }}>
                    {tabList.map((item, index) => (
                        <TabPane  tab={item.tab} key={item.key} style={{ padding:'0px 0px 0px 5px' }}>
                            <div style={{ height:  'calc(100vh - 64px)', overflow: 'scroll' }}>
                                {item.component}
                            </div>
                        </TabPane>
                    ))}
                </Tabs>
                {/* <PageContainer
                    style={{padding: '0px',margin: '0px'}}
                    // ghost
                    header={false}
                    // waterMarkProps={{ content: '' }}
                    tabList={tabList}
                    tabProps={{
                        type: 'editable-card',
                        size: 'small',
                        hideAdd: true,
                        tabBarGutter: 1,
                        tabBarStyle: { userSelect: 'none' },
                        activeKey: actionTab.key,
                    }}
                    className={'cala-body tabPage'}
                >
                    <div style={{ height:  'calc(100vh - 64px)', overflow: 'scroll' }}>
                        {<KeepAlive name={actionTab.key} key={actionTab.key} id={actionTab.key}>{actionTab.component}</KeepAlive> }
                    </div>
                </PageContainer> */}
                 {/* <Tabs
                    style={{ marginTop: 20 }}
                    activeKey={actionTab}
                    size="small"
                    type="card"
                    onChange={(activeKey) => {
                        setActionTab(activeKey);

                    }}>
                        <
                    </Tabs> */}
            </Splitter.Panel>
        </Splitter>
        // <ProLayout
        //         title = {false}
        //         menu={{
        //             request: async () => {
        //                 return menuData;
        //             },
        //         }}
        //         logo={false}
        //         menuItemRender={(item, dom) => (
        //             dom
        //             // location.pathname === item.path ? dom : <Link to={item.path} >{dom}</Link>
        //         )}
        //         menuHeaderRender={(logo,title) =><></>}
        //         menuDataRender={() => menuDataRender(menuData || [])}
        //         loading={false}
        //         // 自定义折叠 样式
        //         collapsed={isCollapsed}
        //         onCollapse={() => setIsCollapsed(!isCollapsed)}
        //         token={settings.navTheme == "light" && {
        //             header: {
        //                 colorBgHeader: 'rgba(250,250,250,0.6)',
        //             },
        //             sider: {
        //                 colorMenuBackground: 'rgba(255,255,255,0.8)',
        //             },
        //             pageContainer: {
        //                 colorBgPageContainer: 'rgba(255,255,255,0.8)'
        //             }
        //         }}
        //     >
        //         <PageContainer
        //             ghost
        //             header={{ title: '', breadcrumb: {} }}
        //             waterMarkProps={{ content: '' }}
        //             tabList={tabList}
        //             tabProps={{
        //                 type: 'editable-card',
        //                 size: 'small',
        //                 hideAdd: true,
        //                 tabBarGutter: 1,
        //                 tabBarStyle: { userSelect: 'none' },
        //                 activeKey: pathname,
        //             }}
        //             className={'cala-body tabPage'}
        //         >
        //             <div style={{ height:  'calc(100vh - 64px)', overflow: 'hidden' }}>
        //                 {<KeepAlive name={pathname} key={pathname} id={pathname}></KeepAlive> }
        //             </div>
        //         </PageContainer>
        //     </ProLayout>
    )
}