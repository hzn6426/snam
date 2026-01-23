import { constant } from '@/common/utils';
import '@/assets/theme.css';
import '@/assets/index.less';
import { autoFixContext } from 'react-activation'

autoFixContext(
  [require('react/jsx-runtime'), 'jsx', 'jsxs', 'jsxDEV'],
  [require('react/jsx-dev-runtime'), 'jsx', 'jsxs', 'jsxDEV']
)
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
export async function getInitialState() {
  const token = sessionStorage.getItem(constant.KEY_USER_TOKEN);
  
  return {
    name: 'User',
    avatar: '',
  };
}

// 运行时配置
export const runtime = {
  // 在初始加载和路由切换时做一些事情
  onRouteChange({ location, clientRoutes, routes, action }) {
    const token = sessionStorage.getItem(constant.KEY_USER_TOKEN);
    
    // 如果没有 token 且不在登录页，跳转到登录页
    if (!token && location.pathname !== constant.SYSTEM_ROUTE_LOGIN) {
      if (typeof window !== 'undefined') {
        window.location.href = constant.SYSTEM_ROUTE_LOGIN;
      }
    }
  },
  
  // 修改路由
  patchRoutes({ routes }) {
    // 可以在这里动态修改路由
  },
  
  // 修改客户端渲染
  rootContainer(container) {
    return container;
  },
};

// 导出配置
export default {
  // 其他运行时配置
};

