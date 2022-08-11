import React, { useState, useEffect } from 'react';
// import { connect } from 'umi';
import Avatar from './AvatarDropdown';
import styles from './index.less';
// import NoticeIconView from './NoticeIconView';
import Department from './Department';
import { api, PubSub } from '@/common/utils';

const GlobalHeaderRight = (props) => {
  const { theme, layout, change } = props;

  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const [currentUser, setCurrentUser] = useState({});

  const getCurrentUser = () => {
    api.user.getCurrentUser().subscribe({
      next: (data) => {
        setCurrentUser(data[0]);
      },
    });
  };
  const doSub = () => {
    // PubSub.subscribe(SUBJECT.SUBJECT_SYSTEM_REFRESH, () => {
    //   setChange(!change);
    // });
  };
  const doUnSub = () => {
    // PubSub.unsubscribe(SUBJECT.SUBJECT_SYSTEM_REFRESH);
  };
  useEffect(() => {
    doSub();
    getCurrentUser();
    return () => {
      doUnSub();
    };
  }, [change]);
  return (
    <div className={className}>
      {/* <NoticeIconView /> */}
      <Department groupName={currentUser?.groupName} />
      <Avatar currentUser={currentUser} />
    </div>
  );
};
export default GlobalHeaderRight;
// export default connect(({ settings }) => ({
//   theme: settings.navTheme,
//   layout: settings.layout,
// }))(GlobalHeaderRight);
