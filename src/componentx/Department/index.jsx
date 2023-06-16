import { api } from '@/common/utils';
import { TreeSelect } from 'antd';
import { useEffect, useState } from 'react';

const Department = (props) => {
    const [treeData, setTreeData] = useState([]);

    useEffect(() => {
        api.group.treeAllGroups().subscribe({
            next: (data) => {
                setTreeData(data)
            },
        });
    }, []);

    return (
        <TreeSelect
            showSearch
            allowClear
            // treeDefaultExpandAll      
            value={props.value}
            dropdownMatchSelectWidth={false}
            onChange={props.onChange}
            treeData={treeData}
            treeNodeFilterProp='title'
            fieldNames={{ label: 'title', value: 'key', children: 'children' }}
            placeholder="请选择部门"
            style={{ width: '100%' }}
            dropdownStyle={{ width: 'auto', maxHeight: 480, overflow: 'auto' }}
        />
    );
};

export default Department;
