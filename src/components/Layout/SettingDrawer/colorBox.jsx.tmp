import React, { useState } from 'react';
import { CheckOutlined, BgColorsOutlined } from '@ant-design/icons';
import { ColorPicker, Tooltip } from 'antd';
import './index.less';

export default (props) => {
    const [customColorOpen, setCustomColorOpen] = useState(false);

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

    // 检查当前颜色是否为预设颜色
    const isPresetColor = colors.some(color => color.value === props.value);

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
        
        {/* 自定义颜色选择器 */}
        <div className="color-sub">
            <Tooltip title="自定义颜色 - 点击选择任意颜色">
                <div 
                    className='color-icon custom-color-icon'
                    onClick={() => setCustomColorOpen(true)}
                    style={{ 
                        backgroundColor: isPresetColor ? undefined : props.value,
                        border: isPresetColor ? 'none' : '2px solid #fff',
                        boxShadow: isPresetColor ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                >
                    {!isPresetColor && props.value ? <CheckOutlined /> : <BgColorsOutlined />}
                </div>
            </Tooltip>
            
            <ColorPicker
                open={customColorOpen}
                onOpenChange={setCustomColorOpen}
                value={props.value}
                onChange={(color) => {
                    const hexColor = color.toHexString();
                    props.onChange(hexColor);
                }}
                showText={(color) => (
                    <span style={{ color: color.toHexString() }}>
                        {color.toHexString()}
                    </span>
                )}
                presets={[
                    {
                        label: '推荐颜色',
                        colors: colors.map(c => c.value),
                    },
                ]}
            />
        </div>
    </div>)
}

