import React, { useState, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import ProLayout, { PageContainer } from '@ant-design/pro-layout';
import {
  DashboardOutlined,
  ClockCircleOutlined,
  BarsOutlined,
  SettingOutlined,
  BlockOutlined,
  TableOutlined,
  GiftOutlined,
  CarryOutOutlined,
  FormOutlined,
  TeamOutlined,
  AimOutlined,
  ForkOutlined,
} from '@ant-design/icons';
import defaultSettings from '../../config/defaultSettings';
import AvatarDropdown from '@/components/Layout/AvatarDropdown';
// import Language from '@/components/Layout/Language';
import SettingDrawer from '@/components/Layout/SettingDrawer';
import { Link, useIntl, history } from 'umi';
import { KeepAlive, AliveScope, useAliveController } from 'react-activation';
// import enUS from 'antd/lib/locale/en_US';
// import zhCN from 'antd/lib/locale/zh_CN';
// import viVN from 'antd/lib/locale/vi_VN';
import api from '@/common/service';
// const intlMap = [
//   { value: zhCN.locale, lang: zhCN },
//   { value: enUS.locale, lang: enUS },
//   { value: viVN.locale, lang: viVN },
// ];

const tabListInit = [{ key: '/home', tab: '工作台', closable: false }];

export default (props) => {
  // const { formatMessage } = useIntl();
  // const [lang, setLang] = useState(
  //   intlMap.filter((item) => {
  //     return item.value == (localStorage.getItem('umi-locale') || 'zh-CN').toLowerCase();
  //   })[0].lang,
  // );
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem('settings')) || defaultSettings,
  );
  const [pathname, setPathname] = useState(props.location.pathname);
  const [isVisible, setIsVisible] = useState(false);
  const [tabList, setTabList] = useState(tabListInit);
  const { dropScope, refresh } = useAliveController();
  const [loading, setLoading] = useState(false);
  const [menuData, setMenuData] = useState([]);

  const loadMenu = () => {
    setLoading(true);
    api.user
      .loadUserMenus()
      .subscribe({
        next: (data) => {
          setMenuData(data);
        },
      })
      .add(() => setLoading(false));
  };

  useEffect(() => {
    loadMenu();
    // console.log(props.location)
    setPathname(props.location.pathname);
    ConfigProvider.config({
      theme: { primaryColor: settings.primaryColor },
    });
  }, [props.location.pathname]);

  const iconEnum = {
    workplace: <DashboardOutlined />,
    material: <BarsOutlined />,
    recipe: <TableOutlined />,
    produce: <ClockCircleOutlined />,
    goods: <GiftOutlined />,
    approval: <CarryOutOutlined />,
    supplier: <TeamOutlined />,
    apply: <FormOutlined />,
    baseData: <BlockOutlined />,
    system: <SettingOutlined />,
    travel: <AimOutlined />,
    fork: <ForkOutlined />,
  };

  //添加标签
  const onClickMenu = (menuItem) => {
    // 切换 路由
    setPathname(menuItem.path);
    // 缓存页面
    let index = tabList.findIndex((item) => {
      return item.key == menuItem.path;
    });
    if (index < 0) {
      let newTabs = tabList.concat({ key: menuItem.path, tab: menuItem.name });
      setTabList(newTabs);
    }
  };

  //关闭标签
  const editTabs = (v, action) => {
    if (action == 'remove') {
      let newPath =
        tabList[
          tabList.findIndex((item) => {
            return item.key == v;
          }) - 1
        ].key;
      if (pathname == v) {
        setPathname(newPath);
        history.replace(newPath);
      }
      let newTabs = tabList.filter((item) => {
        return item.key != v;
      });
      setTabList(newTabs);
      dropScope(v);
    }
  };
  //页面刷新
  const refreshTab = (key) => {
    refresh(pathname);
  };

  const menuDataRender = (menuList) => {
    return menuList.map((item) => {
      const localItem = {
        ...item,
        name: item.name,
        locale: true,
        icon: iconEnum[item.icon],
        routes: item.routes ? menuDataRender(item.routes) : undefined,
      };
      return localItem;
    });
  };

  return (
    <AliveScope>
      <ConfigProvider space={{ size: 'small' }}>
        <ProLayout
          {...settings}
          title="客户管理系统"
          location={{ pathname }}
          menu={loading}
          rightContentRender={() => (
            <div style={{ width: '110px', display: 'flex' }}>
              <AvatarDropdown
                bgColor={settings.primaryColor}
                onSetting={() => {
                  setIsVisible(true);
                }}
              />
            </div>
          )}
          menuItemRender={(item, dom) =>
            location.pathname === item.path ? (
              dom
            ) : (
              <Link to={item.path} onClick={() => onClickMenu(item)}>
                {dom}
              </Link>
            )
          }
          menuDataRender={() => menuDataRender(menuData || [])}
          // menuFooterRender={(props) => { return (<AvatarDropdown collapsed={props.collapsed} bgColor={settings.primaryColor} />) }}
          loading={false}
        >
          <PageContainer
            ghost
            header={settings.isTabs ? { title: '', breadcrumb: {} } : { title: '' }}
            //waterMarkProps={{ content: 'PTAH-EIMS' }}
            tabList={settings.isTabs ? tabList : []}
            tabProps={{
              type: 'editable-card',
              size: 'small',
              hideAdd: true,
              tabBarGutter: -1,
              tabBarStyle: { userSelect: 'none' },
              activeKey: pathname,
              onEdit: (v, action) => {
                editTabs(v, action);
              },
              onChange: (v) => {
                history.replace(v);
              },
              renderTabBar: (props, DefaultTabBar) => (
                <DefaultTabBar {...props}>
                  {(node) => <span onDoubleClick={refreshTab}>{node}</span>}
                </DefaultTabBar>
              ),
            }}
            style={
              settings.isTabs
                ? { marginTop: '-42px', height: 'calc(100vh - 50px)' }
                : { height: 'calc(100vh - 65px)' }
            }
          >
            {settings.isTabs ? (
              <KeepAlive name={pathname} id={pathname}>
                {props.children}
              </KeepAlive>
            ) : (
              props.children
            )}
          </PageContainer>
          <SettingDrawer
            visible={isVisible}
            settings={settings}
            onSettingChange={(v) => {
              setSettings(v);
              ConfigProvider.config({
                theme: { primaryColor: v.primaryColor },
              });
            }}
            closeDrawer={() => setIsVisible(false)}
            enableDarkTheme={true}
          />
        </ProLayout>
      </ConfigProvider>
    </AliveScope>
  );
};
