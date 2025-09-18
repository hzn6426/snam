import { IIF } from '@/common/components';
import {
    SearchOutlined
} from '@ant-design/icons';
import { Button, DatePicker, Form, Input, Select, Space } from "antd";
import { useState } from 'react';
import './index.less';
const { RangePicker } = DatePicker;
export default (props) => {
    const { options, defaultValue,defaultPlaceholder, placeholder, width, format, onSearch, onChange, hiddenField, selectWidth } = props;
    const [searchValue, setSearchValue] = useState('');
    const [searchName, setSearchName] = useState(defaultValue || '');
    const [xtype, setXtype] = useState(hiddenField == true ? 'hidden' : 'text');
    const [valueOptions, setValueOptions] = useState([]);
    
    // 添加样式类名
    const className = 'igrid-search';
    return (<>
        <Form className={className}>
            <Space.Compact block>
                
                <Select defaultValue={defaultValue} placeholder={defaultPlaceholder} size="small" style={{ width: selectWidth || 120 }} options={options} onChange={(v, option) => {
                    setSearchName(v);
                    setXtype(option.xtype || 'text');
                    setValueOptions(option.valueOptions);
                    onChange && onChange(v, option);
                }} />
                
                <IIF test={xtype === 'hidden'}>
                    <></>
                </IIF>
                <IIF test={xtype === 'text'}>

                    <Input.Search
                        style={{ width: width || 180, marginRight: '5px' }}
                        onSearch={(value) => {
                            setSearchValue(value);
                            const json = {};
                            json[searchName] = value;
                            onSearch && onSearch(json)
                        }}
                        size="small" key="columnSearch"
                        enterButton
                        placeholder={placeholder || '搜索'} allowClear />

                </IIF>
                <IIF test={xtype === 'select'}>
                    <Select size="small" style={{ width: width || 130 }} allowClear options={valueOptions} onChange={(v) => setSearchValue(v)} />
                    <Button type="primary" size="small" style={{ marginRight: '5px' }} icon={<SearchOutlined />} onClick={() => {
                        const json = {};
                        json[searchName] = searchValue;
                        onSearch && onSearch(json);
                    }}></Button>
                </IIF>
                <IIF test={xtype === 'date'}>
                    <DatePicker allowClear size="small"
                        style={{ width: width || 130 }}
                        format={format || 'YYYY-MM-DD'}
                        onChange={(date) => setSearchValue(date)}
                    />
                    <Button type="primary" size="small" style={{ marginRight: '5px' }} icon={<SearchOutlined />} onClick={() => {
                        const json = {};
                        json[searchName] = searchValue;
                        onSearch && onSearch(json);
                        onSearch && onSearch(json);
                    }}></Button>
                </IIF>
                <IIF test={xtype === 'datetime'}>
                    <DatePicker allowClear size="small"
                        style={{ width: width || 160 }}
                        format={format || 'YYYY-MM-DD HH:mm'}
                        onChange={(date) => setSearchValue(date)}
                    />
                    <Button type="primary" size="small" style={{ marginRight: '5px' }} icon={<SearchOutlined />} onClick={() => {
                        const json = {};
                        json[searchName] = searchValue;
                        onSearch && onSearch(json);
                        onSearch && onSearch(json);
                    }}></Button>
                </IIF>
                <IIF test={xtype === 'daterange'}>
                    <RangePicker style={{ width: width || 280 }} allowClear size="small"
                        format={format || 'YYYY-MM-DD'}
                        onChange={(date) => setSearchValue(date)} />
                    <Button type="primary" size="small" style={{ marginRight: '5px' }} icon={<SearchOutlined />} onClick={() => {
                        const json = {};
                        json[searchName] = searchValue;
                        onSearch && onSearch(json);
                        onSearch && onSearch(json);
                    }}></Button>
                </IIF>
                <IIF test={xtype === 'datetimerange'}>
                    <RangePicker style={{ width: width || 310 }} allowClear size="small"
                        format={format || 'YYYY-MM-DD HH:mm'} showTime
                        onChange={(date) => setSearchValue(date)} />
                    <Button type="primary" size="small" style={{ marginRight: '5px' }} icon={<SearchOutlined />} onClick={() => {
                        const json = {};
                        json[searchName] = searchValue;
                        onSearch && onSearch(json);
                        onSearch && onSearch(json);
                    }}></Button>
                </IIF>
            </Space.Compact>
        </Form>
    </>)

}