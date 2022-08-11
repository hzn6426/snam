import { history } from 'umi';
import { constant } from '@/common/utils';

const token = sessionStorage.getItem(constant.KEY_USER_TOKEN);

if (token) {
  history.push(history.location.pathname);
} else {
  history.push(constant.SYSTEM_ROUTE_LOGIN);
}

// 搜索栏布局
const closeStyle = {
  width: '100%',
  backgroundColor: '#FFFFFF',
  paddingTop: '10px',
  marginBottom: '10px',
  height: '44px',
  overflow: 'hidden',
};
const openStyle = {
  width: '100%',
  backgroundColor: '#FFFFFF',
  paddingTop: '10px',
  marginBottom: '10px',
};
