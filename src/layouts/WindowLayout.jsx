import { ConfigProvider, theme  } from 'antd';
import {useEffect, useState} from 'react'
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
    return (
        <>
        <ConfigProvider space={{ size: 'small' }} 
        theme={{
            algorithm: settings.navTheme === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
            token: {
                colorPrimary: settings.colorPrimary || '#F5222D'
            }
        }}
        >
            {props.children}
        </ConfigProvider>
        </>
    )
}
