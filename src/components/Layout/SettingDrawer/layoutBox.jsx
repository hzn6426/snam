import React from 'react';
import { Tooltip } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import sideLayout from '@/assets/images/sideIcon.jpg';
import topLayout from '@/assets/images/topIcon.jpg';
import mixLayout from '@/assets/images/mixIcon.jpg';

import './index.less';

export default (props) => {

    let layouts = [
        {
            value: 'side',
            title: '侧边布局',
            icon: sideLayout,
        },
        {
            value: 'top',
            title: '顶部布局',
            icon: topLayout,
        },
        {
            value: 'mix',
            title: '混合布局',
            icon: mixLayout,
        }
    ]

    return (<div className='layout-box'>
        {
            layouts.map((item, index) => 
            <Tooltip title={item.title}>
            <div
                className="layout-sub"
                key={index}
                onClick={() => props.onChange(item.value)}                
            >
                {item.value==props.value?<CheckOutlined className='layout-action'/>:''}
                <img className='layout-icon' src={item.icon} />
            </div>
            </Tooltip>
            )
        }
    </div>)
}
