import React from 'react';
import { CheckOutlined } from '@ant-design/icons';
import './index.less';

export default (props) => {

    let colors = [
        {
            value: '#1890FF',
            title: '晓蓝',
        },
        {
            value: '#F5222D',
            title: '幕红',
        },
        {
            value: '#FA541C',
            title: '火橙',
        },
        {
            value: '#FAAD14',
            title: '日黄',
        },
        {
            value: '#13C2C2',
            title: '天青',
        },
        {
            value: '#52C41A',
            title: '草绿',
        },
        {
            value: '#2F54EB',
            title: '极蓝',
        },
        {
            value: '#722ED1',
            title: '薇紫',
        }
    ]

    return (<div className='color-box'>
        {
            colors.map((item, index) => <div
                className="color-sub"
                key={index}
                onClick={() => props.onChange(item.value)}
            >
                <div className='color-icon' style={{ backgroundColor: item.value }}>
                    {item.value==props.value?<CheckOutlined />:''}
                </div>
            </div>)
        }
    </div>)
}

