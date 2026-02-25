import AvatarDropdown from '@/components/Layout/AvatarDropdown';
import SettingDrawer from '@/components/Layout/SettingDrawer';
import { useApplicationState } from "@/store/state";
import { PicCenterOutlined, PicLeftOutlined, PicRightOutlined, SyncOutlined, UngroupOutlined,HomeOutlined ,GithubFilled } from '@ant-design/icons';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { ConfigProvider, Dropdown, Input, Spin,Avatar } from 'antd';
import { useEffect, useState } from 'react';
import defaultSettings from '../../config/defaultSettings';
// import { wrapObservable, wrapSObservable } from '@/utils/RxjsUtil';
import { iconEnum } from '@/common/icons';
import KeepAlive, { useAliveController } from 'react-activation';
import { Link, history } from '@umijs/max';
import routeCache from '../../config/routerCache.js';
// import Logo from '../assets/logo.png';
import Logo from '../assets/antd.svg';
import Header from '@/assets/images/header.jpg';
import { api, constant } from '@/common/utils';
import './index.less';
import zhCN from 'antd/locale/zh_CN';
import { Outlet, useLocation } from '@umijs/max';
const tabListInit = [{ key: '/dashboard/blog', tab: '更新日志', closable: false }];
export default (props) => {
    const location = useLocation();
    const [settings, setSettings] = useState(localStorage.getItem("settings") == null ? defaultSettings : JSON.parse(localStorage.getItem("settings")));
    const [pathname, setPathname] = useState(location.pathname);
    const [tabList, setTabList] = useState(tabListInit);
    const [actionTab, setActionTab] = useState('');
    const { dropScope, refresh,refreshScope, clear,getCachingNodes,refreshById } = useAliveController();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [menuData, setMenuData] = useState([]);
    const [currentUser, setCurrentUser] = useState({});
    const [settingDrawerVisible, setSettingDrawerVisible] = useState(false);

    const [viewSetting, setViewSetting] = useApplicationState(s => [s.view, s.actions.view.setViewSetting]);
    
    // 获取主题相关的CSS类名
    const getThemeClassName = () => {
      return viewSetting.navTheme === "light" ? viewSetting.navTheme : "";
    };
    
    // 初始化主题设置
    useEffect(() => {
        // 从localStorage读取保存的主题设置
        const savedSettings = localStorage.getItem("settings");
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings);
                if (parsedSettings.navTheme) {
                    setViewSetting(parsedSettings);
                }
            } catch (error) {
                console.warn("Failed to parse saved settings:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (viewSetting.navTheme) {
            const theme = viewSetting.navTheme == 'realDark' ? 'dark' : viewSetting.navTheme;
            document.documentElement.setAttribute("data-theme", theme);
        }
    }, [viewSetting]);
    
    // 添加一个useEffect来处理主题颜色变化
    useEffect(() => {
        // 当主题颜色改变时，更新CSS变量
        if (viewSetting.colorPrimary) {
            document.documentElement.style.setProperty('--ant-primary-color', viewSetting.colorPrimary);
            
            // 更新ProLayout的token配置
            const style = document.documentElement.style;
            
            // 为左侧菜单添加颜色适配（所有模式）
            // 设置菜单项选中时的背景色（使用纯主题色，不淡化）
            style.setProperty('--ant-menu-item-selected-bg', viewSetting.colorPrimary); // 使用纯主题色
            // 设置菜单项选中时的字体颜色为白色（确保在所有模式下都清晰可见）
            style.setProperty('--ant-menu-item-selected-color', '#ffffff');
            // 设置菜单项悬停时的背景色（使用更稳定的颜色，避免闪烁）
            style.setProperty('--ant-menu-item-hover-bg', `${viewSetting.colorPrimary}0f`); // 6%透明度，更稳定
            // 设置菜单项默认字体颜色
            style.setProperty('--ant-menu-item-color', 'rgba(0, 0, 0, 0.85)');
            // 设置菜单高亮颜色
            style.setProperty('--ant-menu-highlight-color', viewSetting.colorPrimary);
            // 设置菜单暗色模式下选中项背景色
            style.setProperty('--ant-menu-dark-item-selected-bg', viewSetting.colorPrimary); // 使用纯主题色
            // 设置菜单暗色模式下激活项背景色
            style.setProperty('--ant-menu-dark-item-active-bg', viewSetting.colorPrimary); // 使用纯主题色
            
            // 为分页栏当前页面设置颜色
            style.setProperty('--ant-pagination-item-active-bg', viewSetting.colorPrimary);
            style.setProperty('--ant-pagination-item-active-border', viewSetting.colorPrimary);
            // 确保分页工具栏中的当前页号也使用主题色
            style.setProperty('--ant-pagination-item-active-color', '#ffffff');
            
            // 为IAGrid右上角按钮设置主题色
            style.setProperty('--ant-btn-primary-bg', viewSetting.colorPrimary);
            style.setProperty('--ant-btn-primary-border', viewSetting.colorPrimary);
            
            // 确保按钮在不同状态下的颜色也正确设置（使用更稳定的颜色）
            style.setProperty('--ant-btn-primary-hover-bg', `${viewSetting.colorPrimary}dd`); // 87%透明度
            style.setProperty('--ant-btn-primary-hover-border', `${viewSetting.colorPrimary}dd`); // 87%透明度
            style.setProperty('--ant-btn-primary-active-bg', `${viewSetting.colorPrimary}bb`); // 73%透明度
            style.setProperty('--ant-btn-primary-active-border', `${viewSetting.colorPrimary}bb`); // 73%透明度
            
            // 为ProLayout侧边栏背景设置主题色
            style.setProperty('--ant-pro-layout-sider-background', viewSetting.colorPrimary);
            
            // 为Tree组件设置主题色
            style.setProperty('--ant-tree-node-selected-bg', viewSetting.colorPrimary);
            style.setProperty('--ant-tree-node-selected-color', '#ffffff');
            // 为Tree组件设置悬停色（使用更稳定的颜色）
            style.setProperty('--ant-tree-node-hover-bg', `${viewSetting.colorPrimary}0f`); // 6%透明度，更稳定
            
            // 为Select组件设置主题色
            style.setProperty('--ant-select-item-selected-bg', viewSetting.colorPrimary);
            style.setProperty('--ant-select-item-selected-color', '#ffffff');
            // 为Select组件设置悬停色（使用更稳定的颜色）
            style.setProperty('--ant-select-item-hover-bg', `${viewSetting.colorPrimary}20`); // 12.5%透明度，更稳定
            
            // 为Form组件设置主题色
            style.setProperty('--ant-form-item-label-color', viewSetting.colorPrimary);
            
            // 为IAGrid选中行设置主题色（使用纯主题色，不淡化）
            style.setProperty('--ant-aggrid-row-selected-bg', viewSetting.colorPrimary); // 使用纯主题色
            style.setProperty('--ant-aggrid-row-selected-color', '#ffffff');
            // 为IAGrid设置悬停色（使用更稳定的颜色）
            style.setProperty('--ant-aggrid-row-hover-bg', `${viewSetting.colorPrimary}20`); // 12.5%透明度，更稳定
            
            // 为Input组件设置悬停和焦点颜色
            style.setProperty('--ant-input-hover-border-color', viewSetting.colorPrimary);
            style.setProperty('--ant-input-focus-border-color', viewSetting.colorPrimary);
            
            // 为Button组件设置悬停颜色（使用更稳定的颜色）
            style.setProperty('--ant-btn-default-hover-bg', `${viewSetting.colorPrimary}20`); // 12.5%透明度，更稳定
            style.setProperty('--ant-btn-default-hover-border', viewSetting.colorPrimary);
        }
    }, [viewSetting.colorPrimary]);
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
                    setMenuData(data[0]?.children);
                },
            })
            .add(() => setLoading(false));
    };

    useEffect(() => {
        getCurrentUser();
        loadMenu();
        return () => {
            setTabList([]);
        };
    }, []);



    useEffect(() => {
        setPathname(location.pathname);
        // 按钮新建
        addTab(location);
    }, [location.pathname]);

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
        // setPathname(addItem.pathname);
        // 缓存页面
        let index = tabList.findIndex((item) => { return item.key == addItem.pathname });
        if (index < 0) {
            let newTabs = tabList.concat({ key: addItem.pathname, tab: routeCache[addItem.pathname].name });
            setTabList(newTabs);
            // 移除这里的 refreshTab 调用，避免新标签页立即刷新
            // refreshTab(addItem.pathname);
        }
    }

    // 关闭标签
    const editTabs = (key, action) => {
        if (action == 'remove') {
            // 先清除缓存
            dropScope(key).then(() => {
                let currentIndex = tabList.findIndex((item) => { return item.key == key });
                let newPath = tabList[currentIndex - 1].key;
                if (pathname == key) {
                    setPathname(newPath);
                    history.replace(newPath);
                }
                let newTabs = tabList.filter((item) => { return item.key != key });
                setTabList(newTabs);
            });
        }
    }

    // 右键事件
    const refreshTab = (key) => {
        refreshById(key).then(() => {console.log(getCachingNodes())});
    }
    const closeAllTabs = () => {
        // 先清除所有缓存
        clear().then(() => {
            let newTabs = [].concat(tabList[0]);
            setPathname(newTabs[0].key);
            history.replace(newTabs[0].key);
            setTabList(newTabs);
        });
    }
    const closeOtherTabs = (key) => {
        let index = tabList.findIndex((item) => { return item.key == key });
        let newTabs = [].concat(tabList[0]);
        newTabs = newTabs.concat(tabList[index]);
        
        // 清除其他标签的缓存
        tabList.forEach((item, itemIndex) => {
            if (itemIndex !== 0 && itemIndex !== index) {
                dropScope(item.key);
            }
        });
        
        setPathname(key);
        history.replace(key);
        setTabList(newTabs);
    }
    const closeLeftTabs = (key) => {
        let index = tabList.findIndex((item) => { return item.key == key });
        
        // 清除左边标签的缓存
        tabList.forEach((item, itemIndex) => {
            if (itemIndex > 0 && itemIndex < index) {
                dropScope(item.key);
            }
        });
        
        let newTabs = tabList.filter((_, itemIndex) => { return itemIndex >= index || itemIndex == 0 });
        setPathname(key);
        history.replace(key);
        setTabList(newTabs);
    }
    const closeRightTabs = (key) => {
        let index = tabList.findIndex((item) => { return item.key == key });
        
        // 清除右边标签的缓存
        tabList.forEach((item, itemIndex) => {
            if (itemIndex > index) {
                dropScope(item.key);
            }
        });
        
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
    return (<ConfigProvider 
        locale={zhCN}
        space={{ size: 'small' }}
        theme={{
            components: {
              Splitter: { splitBarSize: 1, splitTriggerSize: 16 },
            },
          }}
      >
      <Spin spinning={loading}>
        <ProLayout
                {...viewSetting}
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
                    // style: {marginRight:-50},
                    render: (_, dom) => {
                        return (
                            <AvatarDropdown onSetting={() => setSettingDrawerVisible(true)}>
                                <div style={{marginRight:'-25px',marginTop:'-3px', fontWeight:'bold'}}>
                                    {dom}
                                </div>
                            </AvatarDropdown>
                        )
                    }
                }}
                actionsRender={(props) => {
                    if (props.isMobile) return [];
                    if (typeof window === 'undefined') return [];
                    return [
                        // props.layout !== 'side' && document.body.clientWidth > 1400 ? (
                        //     <SearchInput />
                        // ) : undefined,
                        <Avatar shape="square" onClick={() => window.open('https://baomibing.com')} size={28} icon={<HomeOutlined />} style={{backgroundColor: '#c85a5b', verticalAlign: 'middle', marginLeft: 0, marginRight: 4, }} />,
                        <Avatar shape="square" onClick={() => window.open('https://gitee.com/ifrog/snapper-standalone')} size={28} icon={<GithubFilled />} style={{backgroundColor: '#c85a5b', verticalAlign: 'middle', marginLeft: 0, marginRight: -20 }} />
                    ];
                }}

                menuItemRender={(item, dom) => (
                    location.pathname === item.path ? dom : <Link to={item.path} >{dom}</Link>
                )}
                menuDataRender={() => menuDataRender(menuData || [])}
                loading={false}
                // 自定义折叠 样式
                collapsed={isCollapsed}
                onCollapse={() => setIsCollapsed(!isCollapsed)}
                token={viewSetting.navTheme == "light" && {
                    header: {
                        colorBgHeader: 'rgba(250,250,250,0.6)',
                    },
                    sider: {
                        colorMenuBackground: 'rgba(255,255,255,0.8)',
                    },
                    pageContainer: {
                        colorBgPageContainer: 'rgba(255,255,255,0.8)'
                    }
                }}
                className={getThemeClassName()}
            >
                <PageContainer
                    ghost
                    header={viewSetting.isTabs ? { title: '', breadcrumb: {} } : { title: '' }}
                    waterMarkProps={{ content: '' }}
                    tabList={viewSetting.isTabs ? tabList : []}
                    tabProps={{
                        type: 'editable-card',
                        size: 'small',
                        hideAdd: true,
                        tabBarGutter: 1,
                        tabBarStyle: { userSelect: 'none' },
                        activeKey: pathname,
                        onEdit: (v, action) => { editTabs(v, action) },
                        onChange: (v) => { 
                            history.replace(v) 
                        },
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
                    className={viewSetting.isTabs ? 'cala-body tabPage' : 'cala-body breadcrumb'}
                >
                    <div style={{ height: viewSetting.layout == "side" ? 'calc(100vh - 64px)' : 'calc(100vh - 120px)', overflow: 'hidden' }}>
                        {viewSetting.isTabs ? (
                            <KeepAlive cacheKey={location.pathname} autoFreeze={false} saveScrollPosition="screen">
                            <Outlet/>
                            </KeepAlive>
                        ) : (
                            <Outlet />
                        )}
                    </div>
                </PageContainer>
            </ProLayout>
            <SettingDrawer
                visible={settingDrawerVisible}
                closeDrawer={() => setSettingDrawerVisible(false)}
                settings={viewSetting}
            />
            </Spin></ConfigProvider>
    )
}