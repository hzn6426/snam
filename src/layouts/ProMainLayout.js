import AvatarDropdown from '@/components/Layout/AvatarDropdown';
import SettingDrawer from '@/components/Layout/SettingDrawer';
import { useApplicationState } from "@/store/state";
import { PicCenterOutlined, PicLeftOutlined, PicRightOutlined, SyncOutlined, UngroupOutlined,HomeOutlined ,GithubFilled } from '@ant-design/icons';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import { ConfigProvider, Dropdown, Input, Spin,Avatar } from 'antd';
import { use, useEffect, useState } from 'react';
import defaultSettings from '../../config/defaultSettings';
// import { wrapObservable, wrapSObservable } from '@/utils/RxjsUtil';
import { iconEnum } from '@/common/icons';
import KeepAlive, { useAliveController } from 'react-activation';
import { Link, history } from 'umi';
import routeCache from '../../config/routerCache.js';
// import Logo from '../assets/logo.png';
import Logo from '../assets/antd.svg';
import Header from '@/assets/images/header.jpg';
import { api, constant } from '@/common/utils';
import './index.less';
import zhCN from 'antd/locale/zh_CN';
const tabListInit = [{ key: '/dashboard/blog', tab: '更新日志', closable: false }];
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

    const [viewSetting, setViewSetting] = useApplicationState(s => [s.view, s.actions.view.setViewSetting]);
    
    // 根据主题模式设置毛玻璃效果
    const getGlassTheme = () => {
      if (viewSetting.navTheme === 'glass') {
        return {
          components: {
            Card: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            },
            ProLayout: {
              sider: {
                colorMenuBackground: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(3px)',
                WebkitBackdropFilter: 'blur(3px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              },
              header: {
                colorBgHeader: 'rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(3px)',
                WebkitBackdropFilter: 'blur(3px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              },
              pageContainer: {
                colorBgPageContainer: 'rgba(255,255,255,0.3)',
                backdropFilter: 'blur(3px)',
                WebkitBackdropFilter: 'blur(3px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }
            },
            // 添加Table组件的毛玻璃效果
            Table: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              border: '1px solid #f0f0f0'
            },
            // 添加Tabs组件的毛玻璃效果
            Tabs: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              colorBorder: '#f0f0f0'
            },
            // 添加Tree组件的毛玻璃效果
            Tree: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              colorBorder: '#f0f0f0'
            },
            // 添加Input组件的毛玻璃效果
            Input: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              colorBorder: '#f0f0f0'
            },
            // 添加Select组件的毛玻璃效果
            Select: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              colorBorder: '#f0f0f0'
            },
            // 添加Checkbox组件的毛玻璃效果
            Checkbox: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              colorBorder: 'rgba(255, 255, 255, 0.5)'
            },
            // 添加Radio组件的毛玻璃效果
            Radio: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              colorBorder: 'rgba(255, 255, 255, 0.5)'
            },
            // 添加Textarea组件的毛玻璃效果
            InputTextArea: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              colorBorder: '#f0f0f0'
            },
            // 添加FooterToolbar组件的毛玻璃效果
            FooterToolbar: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(3px)',
              WebkitBackdropFilter: 'blur(3px)',
              colorBorder: 'rgba(255, 255, 255, 0.3)'
            }
          }
        };
      }
      return {};
    };
    
    // 获取主题相关的CSS类名
    const getThemeClassName = () => {
      if (viewSetting.navTheme === 'glass') {
        return 'glass-theme';
      }
      return viewSetting.navTheme === "light" ? viewSetting.theme : "";
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
            
            // 确保玻璃主题类名添加到body上
            if (viewSetting.navTheme === 'glass') {
                document.body.classList.add('glass-theme');
                // 确保背景图显示
                document.body.style.backgroundImage = "url('../assets/back/bg-6.jpg')";
                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundPosition = "center";
                document.body.style.backgroundAttachment = "fixed";
            } else {
                document.body.classList.remove('glass-theme');
                // 清除背景图样式
                document.body.style.backgroundImage = "";
                document.body.style.backgroundSize = "";
                document.body.style.backgroundPosition = "";
                document.body.style.backgroundAttachment = "";
            }
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
        if (index < 0) {
            let newTabs = tabList.concat({ key: addItem.pathname, tab: routeCache[addItem.pathname] });
            setTabList(newTabs);
            refreshTab(addItem.pathname);
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
    return (<ConfigProvider 
        locale={zhCN}
        space={{ size: 'small' }}
        theme={getGlassTheme()}
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
                            <AvatarDropdown onSetting={() => { setIsVisible(true) }}>
                                <div style={{marginRight:'-25px',marginTop:'-3px', fontWeight:'bold', color: viewSetting.navTheme === 'glass' ? 'white' : 'inherit'}}>
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
                        // <Avatar shape="square" onClick={() => window.open('https://baomibing.com')} size={28} icon={<HomeOutlined />} style={{backgroundColor: '#c85a5b', verticalAlign: 'middle', marginLeft: 0, marginRight: 4, }} />,
                        // <Avatar shape="square" onClick={() => window.open('https://gitee.com/ifrog/snapper-standalone')} size={28} icon={<GithubFilled />} style={{backgroundColor: '#c85a5b', verticalAlign: 'middle', marginLeft: 0, marginRight: -20 }} />
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
                    className={viewSetting.isTabs ? 'cala-body tabPage' : 'cala-body breadcrumb'}
                >
                    <div style={{ height: viewSetting.layout == "side" ? 'calc(100vh - 64px)' : 'calc(100vh - 120px)', overflow: 'hidden' }}>
                        {viewSetting.isTabs ? <KeepAlive name={pathname} key={pathname} id={pathname}>{props.children}</KeepAlive> : props.children}
                    </div>
                </PageContainer>
                <SettingDrawer
                    visible={isVisible}
                    settings={viewSetting}
                    // onSettingChange={setViewSetting}
                    closeDrawer={() => setIsVisible(false)}
                />
            </ProLayout></Spin></ConfigProvider>
    )
}