import React from 'react';
import { theme,Tooltip } from 'antd';
import defaultTheme from '@/assets/images/defaultIcon.jpg';
import springTheme from '@/assets/images/springIcon.jpg';
import summerTheme from '@/assets/images/summerIcon.jpg';
import autumnTheme from '@/assets/images/autumnIcon.jpg';
import winterTheme from '@/assets/images/winterIcon.jpg';

import './index.less';

export default (props) => {
    const { token: { colorPrimary } } = theme.useToken();// 主题切换

    let themes = [
        {
            value: '',
            title: '默认主题',
            icon: defaultTheme,
        },
        {
            value: 'springTheme',
            title: '春季主题',
            icon: springTheme,
        },
        {
            value: 'summerTheme',
            title: '夏季主题',
            icon: summerTheme,
        },
        {
            value: 'autumnTheme',
            title: '秋季主题',
            icon: autumnTheme,
        },
        {
            value: 'winterTheme',
            title: '冬季主题',
            icon: winterTheme,
        }
    ]

    return (<div className='theme-box'>
        {
            themes.map((item, index) => <Tooltip title={item.title} color={colorPrimary} key={"item"  + index}>
            <div
                className="theme-sub"
                key={"div"+index}
                style={item.value == props.value ? { border: '2px solid ' + colorPrimary } : {}}
                onClick={() => props.onChange(item.value)}
            >
                <img className='theme-icon' src={item.icon} />
            </div>
            </Tooltip>)
        }
    </div>)
}