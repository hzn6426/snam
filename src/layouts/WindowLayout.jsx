import { ConfigProvider, theme  } from 'antd';
import {useEffect, useState} from 'react'
import zhCN from 'antd/locale/zh_CN';
import { ApplicationStateProvider } from "@/store/state";
import { Outlet } from '@umijs/max';
import './WindowLayout.less'; // 引入样式文件
export default (props) => {
    // const [viewSetting] = useApplicationState(s => [s.view]);
    // const [setNavTheme] = useApplicationState(s => [s.actions.view.setNavTheme]);

    const [settings, setSettings] = useState({});
    const changeTheme = () => {
        if (localStorage.getItem("settings")) {
            const localSettings = JSON.parse(localStorage.getItem("settings"));
            setSettings(localSettings);
            document.documentElement.setAttribute("data-theme", localSettings?.navTheme);
            
            const viewSetting = localSettings;
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
              style.setProperty('--ant-tree-node-hover-bg', `${viewSetting.colorPrimary}20`); // 12.5%透明度，更稳定
              
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
        }
    }
    useEffect(() => {
       changeTheme();
    }, []);

     //监控LocalStorage更改
    window.addEventListener('storage', () => {
        changeTheme();
    })
    
    return (
        <ApplicationStateProvider>
        <ConfigProvider space={{ size: 'small' }} 
        locale={zhCN}
        theme={{
            algorithm: settings.navTheme === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
            token: {
                colorPrimary: settings.colorPrimary || '#F5222D'
            }
        }}
        >
                <Outlet />
        </ConfigProvider>
        </ApplicationStateProvider>
    )
}