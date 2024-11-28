import React, { useState, useEffect } from 'react';
import { ConfigProvider, Dropdown, Spin, Input, Button, Space, Avatar } from 'antd';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { SyncOutlined, PicCenterOutlined, UngroupOutlined, PicLeftOutlined, PicRightOutlined, SearchOutlined, PlusCircleFilled, GithubFilled } from '@ant-design/icons';
import defaultSettings from '../../config/defaultSettings';
import AvatarDropdown from '@/components/Layout/AvatarDropdown';
import SettingDrawer from '@/components/Layout/SettingDrawer';
// import { wrapObservable, wrapSObservable } from '@/utils/RxjsUtil';
import { Link, history } from 'umi';
import KeepAlive, { useAliveController } from 'react-activation';
import routeCache from '../../config/routerCache.js';
import { iconEnum } from '@/common/icons';
// import Logo from '../assets/auth.svg';
import Logo from '../assets/antd.svg';
import Header from '@/assets/images/header.jpg';
import './index.less';
import { api, constant } from '@/common/utils';
const tabListInit = [{ key: '/dashboard/blog', tab: '更新日志', closable: false }];
const { Search } = Input;
export default (props) => {
    const [settings, setSettings] = useState(localStorage.getItem("settings") == null ? defaultSettings : JSON.parse(localStorage.getItem("settings")));
    const [pathname, setPathname] = useState(props.location.pathname);
    const [isVisible, setIsVisible] = useState(false);
    const [tabList, setTabList] = useState(tabListInit);
    const [actionTab, setActionTab] = useState('');
    const { dropScope, refresh, clear } = useAliveController();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [menuData, setMenuData] = useState([]);
    const [currentUser, setCurrentUser] = useState({});

    const getCurrentUser = () => {
        api.user.getCurrentUser().subscribe({
            next: (data) => {
                setCurrentUser(data[0]);
                sessionStorage.setItem(constant.KEY_CURRENT_USER, JSON.stringify(data[0]));
            },
        });
    };

    const loadMenu = () => {
        setLoading(true);
        api.user
            .loadUserMenus()
            .subscribe({
                next: (data) => {
                    setMenuData(data[0].children);
                },
            })
            .add(() => setLoading(false));
    };

    useEffect(() => {
        getCurrentUser();
        loadMenu();
    }, []);



    useEffect(() => {
        setPathname(props.location.pathname);
        // 按钮新建
        addTab(props.location);
    }, [props.location.pathname]);

    // TAB右键菜单
    const menuItems = [
        { key: '1', label: <span onClick={() => { refreshTab(actionTab) }}>刷新本页</span>, icon: <SyncOutlined /> },
        { key: '2', label: <span onClick={() => { closeAllTabs() }}>关闭所有</span>, icon: <PicCenterOutlined /> },
        { key: '3', label: <span onClick={() => { closeOtherTabs(actionTab) }}>关闭其他</span>, icon: <UngroupOutlined /> },
        { key: '4', label: <span onClick={() => { closeLeftTabs(actionTab) }}>关闭左边</span>, icon: <PicLeftOutlined /> },
        { key: '5', label: <span onClick={() => { closeRightTabs(actionTab) }}>关闭右边</span>, icon: <PicRightOutlined /> }
    ];

    // 添加标签
    const addTab = (addItem) => {
        setPathname(addItem.pathname);
    // 缓存页面
        let index = tabList.findIndex((item) => { return item.key == addItem.pathname });
        console.log(index);
        if (index < 0) {
            let newTabs = tabList.concat({ key: addItem.pathname, tab: routeCache[addItem.pathname] });
            setTabList(newTabs);
        }
    }

    // 关闭标签
    const editTabs = (key, action) => {
        if (action == 'remove') {
            let newPath = tabList[tabList.findIndex((item) => { return item.key == key }) - 1].key;
            if (pathname == key) {
                setPathname(newPath);
                history.replace(newPath);
            }
            let newTabs = tabList.filter((item) => { return item.key != key });
            setTabList(newTabs);
            dropScope(key).then(() => { });
        }
    }

    // 右键事件
    const refreshTab = (key) => {
        refresh(key).then(() => { });
    }
    const closeAllTabs = () => {
        let newTabs = [].concat(tabList[0]);
        setPathname(newTabs[0].key);
        history.replace(newTabs[0].key);
        setTabList(newTabs);
        clear().then(() => { });
    }
    const closeOtherTabs = (key) => {
        let index = tabList.findIndex((item) => { return item.key == key });
        let newTabs = [].concat(tabList[0]);
        newTabs = newTabs.concat(tabList[index]);
        setPathname(key);
        history.replace(key);
        setTabList(newTabs);
    }
    const closeLeftTabs = (key) => {
        let index = tabList.findIndex((item) => { return item.key == key });
        let newTabs = tabList.filter((_, itemIndex) => { return itemIndex >= index || itemIndex == 0 });
        setPathname(key);
        history.replace(key);
        setTabList(newTabs);
    }
    const closeRightTabs = (key) => {
        let index = tabList.findIndex((item) => { return item.key == key });
        let newTabs = tabList.filter((_, itemIndex) => { return itemIndex <= index });
        setPathname(key);
        history.replace(key);
        setTabList(newTabs);
    }
    // 菜单重构
    const menuDataRender = (menuList) => {
        return menuList.map((item) => {
            const localItem = {
                ...item,
                name: item.name,
                locale: true,
                icon: iconEnum(item.icon),
                routes: item.routes ? menuDataRender(item.routes) : undefined,
            };
            return localItem;
        });
    };

    return <ConfigProvider space={{ size: 'small' }}>
        <Spin spinning={loading}>
            <ProLayout
                {...settings}
                logo={Logo}
                title={constant.SYSTEM_TITLE}
                location={{ pathname }}
                menu={{
                    request: async () => {
                        return menuData;
                    },
                }}
                avatarProps={{
                    shape: "square",
                    ////TODO 用户信息
                    src: currentUser.avatar || Header,
                    size: 'small',
                    title: currentUser.name,
                    render: (_, dom) => {
                        return (<AvatarDropdown onSetting={() => { setIsVisible(true) }}>{dom}</AvatarDropdown>)
                    }
                }}
                actionsRender={(props) => {
                    if (props.isMobile) return [];
                    if (typeof window === 'undefined') return [];
                    return [
                        // props.layout !== 'side' && document.body.clientWidth > 1400 ? (
                        //     <SearchInput />
                        // ) : undefined,
                        // <InfoCircleFilled key="InfoCircleFilled" />,
                        // <QuestionCircleFilled key="QuestionCircleFilled" />,
                        // <Avatar shape="square" size={28} icon={<GithubFilled />} style={{ marginLeft: 0, marginRight: -10 }} />
                        // <GithubFilled key="GithubFilled" shape="square" style={{ fontSize: 23, marginLeft: 0, marginRight: -10 }} />,
                    ];
                }}
                // actionsRender={(props) => {
                //     if (props.isMobile) return [];
                //     return [
                //         props.layout !== 'side' ? (
                //             <div
                //                 key="SearchOutlined"
                //                 aria-hidden
                //                 style={{
                //                     display: 'flex',
                //                     alignItems: 'center',
                //                     marginInlineEnd: -20,
                //                 }}
                //                 onMouseDown={(e) => {
                //                     e.stopPropagation();
                //                     e.preventDefault();
                //                 }}
                //             >
                //                 <Space.Compact style={{ width: '100%' }}>
                //                     <Input

                //                         style={{
                //                             borderRadius: 4,
                //                             //   marginInlineEnd: 12,
                //                             //   backgroundColor:'var(--ant-primary-color)',
                //                             //   backgroundColor: '#ffffff',
                //                         }}
                //                         placeholder="搜索方案"

                //                     />
                //                     <Button style={{ padding: 0, margin: 0 }} icon={<SearchOutlined />} />
                //                 </Space.Compact>
                //                 {/* <PlusCircleFilled
                //             style={{
                //               backgroundColor: 'var(--ant-primary-color)',
                //               fontSize: 24,
                //             }}
                //           /> */}
                //             </div>
                //         ) : undefined
                //     ];
                // }}

                menuItemRender={(item, dom) => (
                    location.pathname === item.path ? dom : <Link to={item.path} >{dom}</Link>
                )}
                menuDataRender={() => menuDataRender(menuData || [])}
                loading={false}
                // 自定义折叠 样式
                collapsed={isCollapsed}
                onCollapse={() => setIsCollapsed(!isCollapsed)}
                token={settings.navTheme == "light" && {
                    header: {
                        colorBgHeader: 'rgba(250,250,250,0.6)',
                    },
                    sider: {
                        colorMenuBackground: 'rgba(250,250,250,0.2)',
                    },
                    pageContainer: {
                        colorBgPageContainer: 'rgba(255,255,255,0.8)'
                    }
                }}
                className={settings.navTheme == "light" ? settings.theme : ""}
            >
                <PageContainer
                    ghost
                    header={settings.isTabs ? { title: '', breadcrumb: {} } : { title: '' }}
                    waterMarkProps={{ content: '' }}
                    tabList={settings.isTabs ? tabList : []}
                    tabProps={{
                        type: 'editable-card',
                        size: 'small',
                        hideAdd: true,
                        tabBarGutter: 1,
                        tabBarStyle: { userSelect: 'none' },
                        activeKey: pathname,
                        onEdit: (v, action) => { editTabs(v, action) },
                        onChange: (v) => { history.replace(v) },
                        renderTabBar: (props, DefaultTabBar) =>
                            <DefaultTabBar {...props}>
                                {node => (
                                    <Dropdown
                                        menu={{ items: menuItems }}
                                        trigger={['contextMenu']}
                                        onOpenChange={() => setActionTab(node.key)}
                                    >
                                        {node}
                                    </Dropdown>
                                )}
                            </DefaultTabBar>
                    }}
                    className={settings.isTabs ? 'cala-body tabPage' : 'cala-body breadcrumb'}
                >
                    <div style={{ height: settings.layout == "side" ? 'calc(100vh - 64px)' : 'calc(100vh - 120px)', overflow: 'hidden' }}>
                        {settings.isTabs ? <KeepAlive name={pathname} key={pathname} id={pathname}>{props.children}</KeepAlive> : props.children}
                    </div>
                </PageContainer>
                <SettingDrawer
                    visible={isVisible}
                    settings={settings}
                    onSettingChange={setSettings}
                    closeDrawer={() => setIsVisible(false)}
                />
            </ProLayout>
        </Spin>
    </ConfigProvider>
}