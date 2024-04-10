import { ConfigProvider, theme  } from 'antd';
import {useEffect, useState} from 'react'
export default (props) => {

    const [settings, setSettings] = useState(JSON.parse(localStorage.getItem("settings") || {}));
    useEffect(() => {
        console.log('settings is :' + localStorage.getItem("settings"));
    },[]);
    
    return (
        <>
        <ConfigProvider space={{ size: 'small' }} 
        theme={{
            algorithm: settings.navTheme === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
            token: {
                colorPrimary: settings.colorPrimary
            }
        }}
        >
            {props.children}
        </ConfigProvider>
        </>
    )
}
