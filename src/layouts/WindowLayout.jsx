import { ConfigProvider, theme  } from 'antd';
import {useEffect, useState} from 'react'
import zhCN from 'antd/locale/zh_CN';
import { ApplicationStateProvider } from "@/store/state";
import './WindowLayout.less'; // 引入样式文件
// import { useApplicationState } from "@/store/state";
export default (props) => {
    // const [setNavTheme] = useApplicationState(s => [s.actions.view.setNavTheme]);

    const [settings, setSettings] = useState({});
    const changeTheme = () => {
        if (localStorage.getItem("settings")) {
            const localSettings = JSON.parse(localStorage.getItem("settings"));
            setSettings(localSettings);
            // setNavTheme(localSettings.navTheme);
        }
    }
    useEffect(() => {
       changeTheme();
    }, []);

     //监控LocalStorage更改
    window.addEventListener('storage', () => {
        changeTheme();
    })
    
    // 根据主题模式设置毛玻璃效果
    const getGlassTheme = () => {
      if (settings.navTheme === 'glass') {
        return {
          components: {
            Card: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(0.5px)',
              WebkitBackdropFilter: 'blur(0.5px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 10
            },
            // 添加Table组件的毛玻璃效果
            Table: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(0.5px)',
              WebkitBackdropFilter: 'blur(0.5px)',
              border: '1px solid #f0f0f0'
            },
            // 添加Tabs组件的毛玻璃效果
            Tabs: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(0.5px)',
              WebkitBackdropFilter: 'blur(0.5px)',
              colorBorder: '#f0f0f0'
            },
            // 添加Tree组件的毛玻璃效果
            Tree: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(0.5px)',
              WebkitBackdropFilter: 'blur(0.5px)',
              colorBorder: '#f0f0f0'
            },
            // 添加Input组件的毛玻璃效果
            Input: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(0.5px)',
              WebkitBackdropFilter: 'blur(0.5px)',
              colorBorder: '#f0f0f0'
            },
            // 添加Select组件的毛玻璃效果
            Select: {
              colorBgContainer: 'rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(0.5px)',
              WebkitBackdropFilter: 'blur(0.5px)',
              colorBorder: '#f0f0f0'
            }
          }
        };
      }
      return {};
    };
    
    // 获取主题相关的CSS类名
    const getThemeClassName = () => {
      if (settings.navTheme === 'glass') {
        return 'glass-theme';
      }
      return settings.navTheme === "light" ? settings.theme : "";
    };
    
    return (
        <ApplicationStateProvider>
        <ConfigProvider space={{ size: 'small' }} 
        locale={zhCN}
        theme={{
            ...getGlassTheme(),
            algorithm: settings.navTheme === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
            token: {
                colorPrimary: settings.colorPrimary || '#F5222D'
            }
        }}
        >
            <div className={getThemeClassName()}>
                {props.children}
            </div>
        </ConfigProvider>
        </ApplicationStateProvider>
    )
}