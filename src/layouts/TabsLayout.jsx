import { PubSub, api, constant, getQueryString, produce } from '@/common/utils';
import RightContent from '@/components/GlobalHeader/RightContent';
import Blog from '@/pages/dashboard/blog';
import {
  AppstoreOutlined,
  CarryOutOutlined,
  DashboardOutlined,
  FileDoneOutlined,
  FileSearchOutlined,
  LineChartOutlined,
  MessageOutlined,
  MoneyCollectOutlined,
  RedoOutlined,
  SettingOutlined,
  ShopOutlined,
  TeamOutlined,
  TransactionOutlined,
} from '@ant-design/icons';
import ProLayout from '@ant-design/pro-layout';
import { Tabs } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link, history, useIntl } from 'umi';
import defaultSettings from '../../config/defaultSettings';
import routeCache from '../../config/routerCache.js';
import logo from '../assets/auth.svg';

const iconEnum = {
  dashboard: <DashboardOutlined />,
  freight: <MoneyCollectOutlined />,
  sales: <ShopOutlined />,
  booking: <CarryOutOutlined />,
  operate: <AppstoreOutlined />,
  finance: <TransactionOutlined />,
  approve: <FileDoneOutlined />,
  crm: <TeamOutlined />,
  base: <SettingOutlined />,
  message: <MessageOutlined />,
  fileSearch: <FileSearchOutlined />,
  statistics: <LineChartOutlined />,
};

const menuDataRender = (menuList) => {
  return menuList.map((item) => {
    const localItem = {
      ...item,
      locale: false,
      icon: iconEnum[item.icon],
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return localItem;
  });
};

// const defaultFooterDom = (
//   <div style={{ textAlign: 'center', marginBottom: '10px' }}>
//     {' '}
//     &copy;2020-2021 snam 软件技术部出品
//   </div>
// );

const BasicLayout = (props) => {
  const { TabPane } = Tabs;
  const [settings, setSetting] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const menuDataRef = useRef([]);
  const [collapsed, setCollapsed] = useState(settings.collapsed || false);
  const [change, setChange] = useState(false);
  const [activeTab, setActiveTab] = useState('blog');
  const [tabList, setTabList] = useState([]);
  const [route, setRoute] = useState({});
  // const [cachePath, setCachePath] = useState({});
  const [refresh, setRefresh] = useState(false);

  const [tabIndex, setTabIndex] = useState(-1);

  const loadMenus = () => {
    setLoading(true);
    api.user.loadUserMenus().subscribe({
      next: (data) => {
        setMenuData(data);
        setLoading(false);
      },
    });
  };
  const doSub = () => {
    PubSub.subscribe(constant.SUBJECT_SYSTEM_REFRESH, () => {
      setChange(!change);
    });
  };
  const doUnSub = () => {
    PubSub.unsubscribe(constant.SUBJECT_SYSTEM_REFRESH);
  };
  const renderTab = () => {
    const beHaveTabTitle = !!getQueryString('tabTitle');
    let orderNo = getQueryString('tabTitle');
    let tabTitle = orderNo || props.location.pathname;
    if (tabTitle && tabTitle != '/dashboard/blog' && (routeCache[tabTitle] || orderNo)) {
      tabTitle = decodeURI(tabTitle);

      const tabExist = tabList.filter((item) => item.key === tabTitle);
      if (tabExist.length === 0) {
        // store.pushTab({ title: tabTitle, path: props.location.pathname });
        const d = produce(tabList, (draft) => {
          if (tabIndex === -1) {
            draft.push({
              key: tabTitle,
              title: orderNo ? decodeURI(orderNo) : routeCache[tabTitle],
              path: beHaveTabTitle
                ? `${props.location.pathname}?tabTitle=${tabTitle}`
                : props.location.pathname,
              content: produce(props.children, () => { }),
            });
          } else {
            setTabIndex(-1);
            draft.splice(tabIndex, 0, {
              key: tabTitle,
              title: orderNo ? decodeURI(orderNo) : routeCache[tabTitle],
              path: beHaveTabTitle
                ? `${props.location.pathname}?tabTitle=${tabTitle}`
                : props.location.pathname,
              content: produce(props.children, () => { }),
            });
          }
        });
        setTabList(d);
        setActiveTab(tabTitle);
        // const m = produce(dom, (draft) => {
        //   draft[props.location.pathname] = produce(props.children, () => {});
        // });
        // setDom(m);
        if (!route[tabTitle]) {
          const r = produce(route, (draft) => {
            draft[tabTitle] = beHaveTabTitle
              ? `${props.location.pathname}?tabTitle=${tabTitle}`
              : props.location.pathname;
          });
          setRoute(r);
        }
      } else {
        setActiveTab(tabTitle);
      }
      // setActiveTab(tabTitle);
    } else {
      setActiveTab('blog');
    }
  };

  useEffect(() => {
    loadMenus();
    renderTab();
    doSub();
    return () => {
      doUnSub();
    };
  }, [change]);

  useEffect(() => {
    renderTab();
  }, [props.location.pathname, refresh]);

  const findIndex = (key) => {
    for (let i = 0; i < tabList.length; i++) {
      if (tabList[i].key === key) {
        return i;
      }
    }
    return -1;
  };

  const refreshTabList = (key) => {
    const index = findIndex(key);
    setTabIndex(index);
    const w = tabList.filter((item) => item.key !== key);
    setTabList(w);
    setRefresh(!refresh);
  };

  // 删除Tabs标签
  const delTablist = (key) => {
    let tabTitle = getQueryString('tabTitle') || props.location.pathname;
    tabTitle = decodeURI(tabTitle);
    const w = tabList.filter((item) => item.key !== key);
    if (w.length > 0) {
      if (tabTitle === key) {
        const index = findIndex(key);
        if (index > 0) {
          const k = w[index - 1];
          setActiveTab(k.key);
          history.replace(k.path);
        } else if (w.length > index) {
          const k = w[index];
          setActiveTab(k.key);
          history.replace(k.path);
        } else {
          history.replace('/dashboard/blog');
          setActiveTab('blog');
        }
      }
    } else {
      history.replace('/dashboard/blog');
      setActiveTab('blog');
    }
    setTabList(w);
  };

  const { formatMessage } = useIntl();
  return (
    <ProLayout
      logo={logo}
      formatMessage={formatMessage}
      {...settings}
      collapsed={collapsed}
      onCollapse={setCollapsed}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }
        return (
          <div
            onClick={() => {
              history.replace(menuItemProps.path);
            }}
          >
            {defaultDom}
          </div>
        );
      }}
      // headerRender={false}
      footerRender={false}
      menuProps={{ mode: 'inline' }}
      menu={loading}
      menuDataRender={() => menuDataRender(menuData || [])}
      rightContentRender={() => (
        <RightContent theme={settings.navTheme} layout={settings.layout} change={change} />
      )}
    >
      <Tabs
        // tabBarExtraContent={
        //   <RightContent theme={settings.navTheme} layout={settings.layout} change={change} />
        // }
        className="snam-tabs"
        tabBarGutter={5}
        activeKey={activeTab}
        type="editable-card"
        hideAdd
        size="small"
        onTabClick={(key) => {
          history.replace(route[key]);
        }}
      >
        <TabPane
          key="blog"
          closable={false}
          tab={
            <Link to="/dashboard/blog" onClick={() => setActiveTab('blog')}>
              工作台
            </Link>
          }
        >
          <Blog />
        </TabPane>
        {tabList.map((panel) => (
          <TabPane
            key={panel.key}
            closable={true}
            tab={
              <a>
                <span className="snam-tabs-title">{panel.title}</span>
                <RedoOutlined
                  className="snam-tabs-refresh"
                  onClick={() => {
                    refreshTabList(panel.key);
                  }}
                />
              </a>
            }
            closeIcon={
              <span
                onClick={() => {
                  delTablist(panel.key);
                }}
              >
                ×
              </span>
            }
          >
            {panel.content}
          </TabPane>
        ))}
      </Tabs>
    </ProLayout>
  );
};
export default BasicLayout;
