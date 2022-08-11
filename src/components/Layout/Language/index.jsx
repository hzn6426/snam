import { Menu, Dropdown, Typography } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { getLocale, setLocale } from 'umi';
const { Text } = Typography;

export default (props) => {
    const intlMap = [
        { label: '中文', value: 'zh-CN' },
        { label: 'ENGLISH', value: 'en' },
        { label: 'Tiếng', value: 'vi' }
    ];

    const doChange = (value) => {
        setLocale(value.key, false);
        localStorage.setItem("umi-locale", value.key);
        props?.onChange(value.key);
    }

    const langDropdown = (
        <Menu onClick={doChange}>            
           {intlMap.map((item) =>  <Menu.Item key={item.value}>                
                <span style={{ margin: '0 10px' }}>{item.label}</span>
            </Menu.Item>
           )}
        </Menu>
    );

    return (
        <div style={{ width:'100px', padding: '8px 0', display: 'flex'}}>
            <Dropdown overlay={langDropdown}>
                <GlobalOutlined style={{ fontSize: '20px',marginTop:'2px', color: '#ccc' }} />
            </Dropdown>
            <Text style={{ padding: '0 10px', lineHeight: '24px', color: '#999' }}>{intlMap.filter((item) => { return item.value == (localStorage.getItem("umi-locale") || "zh-CN"); })[0]?.label}</Text>
        </div>
    );
}

