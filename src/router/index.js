import { createRouter, createWebHistory } from 'vue-router';
import { constant } from '@/common/utils';

const routes = [
  {
    path: '/user',
    component: () => import('@/layouts/UserLayout.vue'),
    children: [
      {
        path: 'login',
        name: '登录',
        component: () => import('@/pages/login/index.vue'),
      },
    ],
  },
  {
    path: '/new',
    component: () => import('@/layouts/WindowLayout.vue'),
    children: [
      {
        path: 'tfunction/:id',
        name: '租户接口',
        component: () => import('@/pages/tfunction/save/index.vue'),
      },
      {
        path: 'tmenu/save',
        name: '编辑租户菜单',
        component: () => import('@/pages/tmenu/save/index.vue'),
      },
      {
        path: 'tmenu/button',
        name: '编辑租户按钮',
        component: () => import('@/pages/tmenu/button/index.vue'),
      },
      {
        path: 'tenant/:id',
        name: '租户新增',
        component: () => import('@/pages/tenant/save/index.vue'),
      },
      {
        path: 'tenant/bill/:id',
        name: '账单管理',
        component: () => import('@/pages/tenant/bill/index.vue'),
      },
      {
        path: 'tenant/charge/:id',
        name: '充值管理',
        component: () => import('@/pages/tenant/charge/index.vue'),
      },
      {
        path: 'tenant/function/:id',
        name: '功能管理',
        component: () => import('@/pages/tenant/function/index.vue'),
      },
      {
        path: 'tenant/resource/:id',
        name: '授权管理',
        component: () => import('@/pages/tenant/resource/index.vue'),
      },
      {
        path: 'role/resource/:id',
        name: '角色授权',
        component: () => import('@/pages/role/resource/index.vue'),
      },
      {
        path: 'user/resource/:id',
        name: '用户授权',
        component: () => import('@/pages/user/resource/index.vue'),
      },
      {
        path: 'user/privilege/:id',
        name: '用户权限',
        component: () => import('@/pages/user/privilege/index.vue'),
      },
      {
        path: 'role/assignUser/:id',
        name: '角色分配用户',
        component: () => import('@/pages/role/user/index.vue'),
      },
      {
        path: 'role/:id',
        name: '角色新增',
        component: () => import('@/pages/role/save/index.vue'),
      },
      {
        path: 'user/:id',
        name: '用户新增',
        component: () => import('@/pages/user/save/index.vue'),
      },
      {
        path: 'dict/:id',
        name: '字典新增',
        component: () => import('@/pages/dict/save/index.vue'),
      },
      {
        path: 'dictChild/:id',
        name: '子字典新增',
        component: () => import('@/pages/dict/child/index.vue'),
      },
      {
        path: 'group/save',
        name: '组织编辑',
        component: () => import('@/pages/group/save/index.vue'),
      },
      {
        path: 'group/user',
        name: '组织用户编辑',
        component: () => import('@/pages/group/user/index.vue'),
      },
      {
        path: 'group/move',
        name: '组织用户移动',
        component: () => import('@/pages/group/move/index.vue'),
      },
      {
        path: 'group/copy',
        name: '组织用户复制权限',
        component: () => import('@/pages/group/copy/index.vue'),
      },
      {
        path: 'group/company',
        name: '公司编辑',
        component: () => import('@/pages/group/company/index.vue'),
      },
      {
        path: 'group/role',
        name: '组织用户角色',
        component: () => import('@/pages/group/role/index.vue'),
      },
      {
        path: 'uset/role/:id',
        name: '用户组分配角色',
        component: () => import('@/pages/uset/role/index.vue'),
      },
      {
        path: 'uset/user/:id',
        name: '用户组分配用户',
        component: () => import('@/pages/uset/user/index.vue'),
      },
      {
        path: 'uset/:id',
        name: '用户组编辑',
        component: () => import('@/pages/uset/save/index.vue'),
      },
      {
        path: 'position/role',
        name: '职位分配角色',
        component: () => import('@/pages/position/role/index.vue'),
      },
      {
        path: 'position/:id',
        name: '用户编辑职位',
        component: () => import('@/pages/position/save/index.vue'),
      },
      {
        path: 'menu/save',
        name: '编辑菜单',
        component: () => import('@/pages/menu/save/index.vue'),
      },
      {
        path: 'menu/button',
        name: '编辑按钮',
        component: () => import('@/pages/menu/button/index.vue'),
      },
      {
        path: 'param/save',
        name: '编辑参数',
        component: () => import('@/pages/param/save/index.vue'),
      },
      {
        path: 'hmac/:id',
        name: '外部用户',
        component: () => import('@/pages/hmac/save/index.vue'),
      },
      {
        path: 'logger/:id',
        name: '日志详情',
        component: () => import('@/pages/logger/detail/index.vue'),
      },
      {
        path: 'tlog/:id',
        name: '日志详情',
        component: () => import('@/pages/tlog/detail/index.vue'),
      },
      {
        path: 'mlogger/:id',
        name: '接入日志详情',
        component: () => import('@/pages/mlogger/detail/index.vue'),
      },
      {
        path: 'limit/:id',
        name: '限流器',
        component: () => import('@/pages/limit/save/index.vue'),
      },
      {
        path: 'order/:id',
        name: '编辑提单',
        component: () => import('@/pages/order/save/index.vue'),
      },
      {
        path: 'action/:id',
        name: '编辑Action',
        component: () => import('@/pages/action/save/index.vue'),
      },
      {
        path: 'tenant/perm/:id',
        name: '租户权限',
        component: () => import('@/pages/tenant/perm/index.vue'),
      },
      {
        path: 'tuser/:id',
        name: '租户用户新增',
        component: () => import('@/pages/tenant/user/save/index.vue'),
      },
      {
        path: 'trole/:id',
        name: '租户角色新增',
        component: () => import('@/pages/tenant/role/save/index.vue'),
      },
      {
        path: 'trole/resource/:id',
        name: '租户角色授权',
        component: () => import('@/pages/tenant/role/resource/index.vue'),
      },
      {
        path: 'trole/assignUser/:id',
        name: '租户角色分配用户',
        component: () => import('@/pages/tenant/role/user/index.vue'),
      },
      {
        path: 'tgroup/save',
        name: '租户组织编辑',
        component: () => import('@/pages/tenant/group/save/index.vue'),
      },
      {
        path: 'tgroup/user',
        name: '租户组织用户编辑',
        component: () => import('@/pages/tenant/group/user/index.vue'),
      },
      {
        path: 'tgroup/move',
        name: '租户组织用户移动',
        component: () => import('@/pages/tenant/group/move/index.vue'),
      },
      {
        path: 'tgroup/company',
        name: '租户公司编辑',
        component: () => import('@/pages/tenant/group/company/index.vue'),
      },
      {
        path: 'tgroup/role',
        name: '租户组织用户角色',
        component: () => import('@/pages/tenant/group/role/index.vue'),
      },
      {
        path: 'tuset/role/:id',
        name: '租户用户组分配角色',
        component: () => import('@/pages/tenant/uset/role/index.vue'),
      },
      {
        path: 'tuset/user/:id',
        name: '租户用户组分配用户',
        component: () => import('@/pages/tenant/uset/user/index.vue'),
      },
      {
        path: 'tuset/:id',
        name: '租户用户组编辑',
        component: () => import('@/pages/tenant/uset/save/index.vue'),
      },
      {
        path: 'tposition/role',
        name: '职位分配角色',
        component: () => import('@/pages/tenant/position/role/index.vue'),
      },
      {
        path: 'tposition/:id',
        name: '用户编辑职位',
        component: () => import('@/pages/tenant/position/save/index.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/dashboard/blog',
      },
      {
        path: 'dashboard/blog',
        name: '更新日志',
        component: () => import('@/pages/dashboard/blog/index.vue'),
      },
      {
        path: 'system',
        name: '系统管理',
        redirect: '/system/user',
        children: [
          {
            path: 'flow',
            name: '流程演示',
            component: () => import('@/pages/flow/index.vue'),
          },
          {
            path: 'order',
            name: '提单演示',
            component: () => import('@/pages/order/index.vue'),
          },
          {
            path: 'user',
            name: '用户管理',
            component: () => import('@/pages/user/index.vue'),
          },
          {
            path: 'role',
            name: '角色管理',
            component: () => import('@/pages/role/index.vue'),
          },
          {
            path: 'menu',
            name: '菜单管理',
            component: () => import('@/pages/menu/index.vue'),
          },
          {
            path: 'group',
            name: '组织架构',
            component: () => import('@/pages/group/index.vue'),
          },
          {
            path: 'uset',
            name: '用户组',
            component: () => import('@/pages/uset/index.vue'),
          },
          {
            path: 'position',
            name: '职位管理',
            component: () => import('@/pages/position/index.vue'),
          },
          {
            path: 'resource',
            name: '授权管理',
            component: () => import('@/pages/resource/index.vue'),
          },
          {
            path: 'logger',
            name: '日志管理',
            component: () => import('@/pages/logger/index.vue'),
          },
          {
            path: 'dictionary',
            name: '字典管理',
            component: () => import('@/pages/dict/index.vue'),
          },
          {
            path: 'param',
            name: '参数管理',
            component: () => import('@/pages/param/index.vue'),
          },
          {
            path: 'pcolumn',
            name: '数据列',
            component: () => import('@/pages/column/index.vue'),
          },
          {
            path: 'hmac',
            name: '接入用户',
            component: () => import('@/pages/hmac/index.vue'),
          },
          {
            path: 'mlog',
            name: '接入日志',
            component: () => import('@/pages/mlogger/index.vue'),
          },
          {
            path: 'limit',
            name: '限流管理',
            component: () => import('@/pages/limit/index.vue'),
          },
          {
            path: 'tenant',
            name: '租户管理',
            component: () => import('@/pages/tenant/index.vue'),
          },
          {
            path: 'tmenu',
            name: '租户菜单',
            component: () => import('@/pages/tmenu/index.vue'),
          },
          {
            path: 'tlog',
            name: '租户日志',
            component: () => import('@/pages/tlog/index.vue'),
          },
          {
            path: 'tfunction',
            name: '租户接口',
            component: () => import('@/pages/tfunction/index.vue'),
          },
          {
            path: 'action',
            name: '权限动作',
            component: () => import('@/pages/action/index.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/pages/404.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem(constant.KEY_USER_TOKEN);
  
  if (!token && to.path !== '/user/login') {
    next('/user/login');
  } else if (token && to.path === '/user/login') {
    next('/');
  } else {
    next();
  }
});

export default router;

