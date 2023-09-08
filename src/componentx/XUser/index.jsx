import React, { useState,useEffect } from 'react';
import { TreeSelect } from 'antd';
import {api, forEach, copyObject, isEmpty} from '@/common/utils';
import {
    ApartmentOutlined,
    UserOutlined,
} from '@ant-design/icons';
const XUser = (props) => {
  const [treeData, setTreeData] = useState([]);

  // 将组织设置为不可选
  const loop = (data) => {
    forEach((v) => {
        if (v.tag === 'GROUP') {
            copyObject(v, {
                selectable: false,
                //disableCheckbox: true,
                icon: <ApartmentOutlined  />,
            });
        } else {
            // 节点是组织不允许修改
            copyObject(v, { icon: <UserOutlined style={{ color: '#52c41a' }} />} );
        }
        if (v.children && !isEmpty(v.children)) {
            loop(v.children);
        }
    }, data);
};
  //查询
  const loadGroup = () => {
    api.user.treeAllGroupsAndUsersByTag(props.tag || '').subscribe({
        next: (data) => {
          loop(data)
            setTreeData(data);
        },
    });
};
  useEffect(() => {
    loadGroup();
  }, []);

  return (
    <TreeSelect
      showSearch
      allowClear
    //   multiple
      // treeDefaultExpandAll      
      value={props.value}
      dropdownMatchSelectWidth={false}       
      onChange={props.onChange}
      treeData={treeData}
      treeNodeFilterProp='title'
      fieldNames={{ label: 'title', value: 'key', children: 'children' }}
      placeholder="请选择用户"
      style={{width: '100%'}}
      dropdownStyle={{ width: 'auto',maxHeight: 480,overflow: 'auto'}}      
    />
  );
};

export default XUser;
