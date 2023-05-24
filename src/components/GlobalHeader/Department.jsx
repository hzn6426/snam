import React, { useEffect, useState } from 'react';
import { ApartmentOutlined } from '@ant-design/icons';
import { Dropdown, Menu } from 'antd';
import styles from './index.less';
import { api, PubSub, constant } from '@/common/utils';

export default (props) => {
  const [groups, setGroups] = useState([]);
  const { groupName } = props;

  const loadUserDepartment = () => {
    api.user.userDepartments().subscribe({
      next: (datas) => setGroups(datas),
    });
  };
  const changeDepartment = (id) => {
    api.user.changeDepartment(id).subscribe({
      next: () => {
        PubSub.publish(constant.SUBJECT_SYSTEM_REFRESH);
      },
    });
  };
  //changeDepartment(_item.key)
  const menu = (
    <>
      {groups.length > 0 && (
        <Menu>
          {groups.map((item) => (
            <Menu.Item key={item.groupId} onClick={(_item) => {}}>
              <ApartmentOutlined />
              {item.companyName ? `${item.companyName}-` : ''} {item.groupName}
            </Menu.Item>
          ))}
        </Menu>
      )}
    </>
  );

  useEffect(() => {
    //loadUserDepartment();
  }, [groupName]);

  return (
    <Dropdown overlay={menu} placement="bottomRight">
      <span className={`${styles.action}`}>
        <ApartmentOutlined />
        <span className={`${styles.department}`}> {groupName} </span>
      </span>
    </Dropdown>
  );
};
