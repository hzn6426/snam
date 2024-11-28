import { ConfigProvider, theme  } from 'antd';
import {useEffect, useState} from 'react'
export default (props) => {

    const [settings, setSettings] = useState({});
    useEffect(() => {
        if (localStorage.getItem("settings")) {
            setSettings(JSON.parse(localStorage.getItem("settings")));
        }
    }, []);
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
