export default [
  {
    path: '/user',
    component: '@/layouts/UserLayout',
    routes: [
      {
        name: '登录',
        path: '/user/login',
        component: '@/pages/login',
      },
      {
        path: '/user/*',
        component: '@/pages/404',
      },
    ],
  },
  {
    path: '/new',
    component: '@/layouts/WindowLayout',
    routes: [
      {
        name: '租户接口',
        path: '/new/tfunction/:id',
        component: '@/pages/tfunction/save',
      },
      {
        name: '编辑租户菜单',
        path: '/new/tmenu/save',
        component: '@/pages/tmenu/save',
      },
      {
        name: '编辑租户按钮',
        path: '/new/tmenu/button',
        component: '@/pages/tmenu/button',
      },
      {
        name: '租户新增',
        path: '/new/tenant/:id',
        component: '@/pages/tenant/save',
      },
      {
        name: '账单管理',
        path: '/new/tenant/bill/:id',
        component: '@/pages/tenant/bill',
      },
      {
        name: '充值管理',
        path: '/new/tenant/charge/:id',
        component: '@/pages/tenant/charge',
      },
      {
        name: '功能管理',
        path: '/new/tenant/function/:id',
        component: '@/pages/tenant/function',
      },
      {
        name: '授权管理',
        path: '/new/tenant/resource/:id',
        component: '@/pages/tenant/resource',
      },
      {
        name: '角色授权',
        path: '/new/role/resource/:id',
        component: '@/pages/role/resource',
      },
      {
        name: '角色资源授权',
        path: '/new/role/bresource/:id',
        component: '@/pages/role/bresource',
      },
      {
        name: '用户授权',
        path: '/new/user/resource/:id',
        component: '@/pages/user/resource',
      },
      {
        name: '用户权限',
        path: '/new/user/privilege/:id',
        component: '@/pages/user/privilege',
      },
      {
        name: '角色分配用户',
        path: '/new/role/assignUser/:id',
        component: '@/pages/role/user',
      },
      {
        name: '角色新增',
        path: '/new/role/:id',
        component: '@/pages/role/save',
      },
      {
        name: '用户新增',
        path: '/new/user/:id',
        component: '@/pages/user/save',
      },
      {
        name: '字典新增',
        path: '/new/dict/:id',
        component: '@/pages/dict/save',
      },
      {
        name: '子字典新增',
        path: '/new/dictChild/:id',
        component: '@/pages/dict/child',
      },
      {
        name: '组织编辑',
        path: '/new/group/save',
        component: '@/pages/group/save',
      },
      {
        name: '组织用户编辑',
        path: '/new/group/user',
        component: '@/pages/group/user',
      },
      {
        name: '组织用户移动',
        path: '/new/group/move',
        component: '@/pages/group/move',
      },
      {
        name: '组织用户复制权限',
        path: '/new/group/copy',
        component: '@/pages/group/copy',
      },
      {
        name: '公司编辑',
        path: '/new/group/company',
        component: '@/pages/group/company',
      },
      {
        name: '组织用户角色',
        path: '/new/group/role',
        component: '@/pages/group/role',
      },
      {
        name: '用户组分配角色',
        path: '/new/uset/role/:id',
        component: '@/pages/uset/role',
      },
      {
        name: '用户组分配用户',
        path: '/new/uset/user/:id',
        component: '@/pages/uset/user',
      },
      {
        name: '用户组编辑',
        path: '/new/uset/:id',
        component: '@/pages/uset/save',
      },
      {
        name: '职位分配角色',
        path: '/new/position/role',
        component: '@/pages/position/role',
      },
      {
        name: '用户编辑职位',
        path: '/new/position/:id',
        component: '@/pages/position/save',
      },
      {
        name: '编辑菜单',
        path: '/new/menu/save',
        component: '@/pages/menu/save',
      },
      {
        name: '编辑菜单',
        path: '/new/bresource/save',
        component: '@/pages/bresource/save',
      },
      {
        name: '编辑按钮',
        path: '/new/menu/button',
        component: '@/pages/menu/button',
      },
      {
        name: '编辑按钮',
        path: '/new/bresource/button',
        component: '@/pages/bresource/button',
      },
      {
        name: '编辑参数',
        path: '/new/param/save',
        component: '@/pages/param/save',
      },
      {
        name: '外部用户',
        path: '/new/hmac/:id',
        component: '@/pages/hmac/save',
      },
      {
        name: '日志详情',
        path: '/new/logger/:id',
        component: '@/pages/logger/detail',
      },
      {
        name: '日志详情',
        path: '/new/tlog/:id',
        component: '@/pages/tlog/detail',
      },
      {
        name: '接入日志详情',
        path: '/new/mlogger/:id',
        component: '@/pages/mlogger/detail',
      },
      {
        name: '限流器',
        path: '/new/limit/:id',
        component: '@/pages/limit/save',
      },
      {
        name: '编辑提单',
        path: '/new/order/:id',
        component: '@/pages/order/save',
      },
      {
        name: '编辑Action',
        path: '/new/action/:id',
        component: '@/pages/action/save',
      },
      {
        name: '租户权限',
        path: '/new/tenant/perm/:id',
        component: '@/pages/tenant/perm',
      },
      {
        name: '租户用户新增',
        path: '/new/tuser/:id',
        component: '@/pages/tenant/user/save',
      },
      {
        name: '租户角色新增',
        path: '/new/trole/:id',
        component: '@/pages/tenant/role/save',
      },
      {
        name: '租户角色授权',
        path: '/new/trole/resource/:id',
        component: '@/pages/tenant/role/resource',
      },
      {
        name: '租户角色分配用户',
        path: '/new/trole/assignUser/:id',
        component: '@/pages/tenant/role/user',
      },
      {
        name: '租户组织编辑',
        path: '/new/tgroup/save',
        component: '@/pages/tenant/group/save',
      },
      {
        name: '租户组织用户编辑',
        path: '/new/tgroup/user',
        component: '@/pages/tenant/group/user',
      },
      {
        name: '租户组织用户移动',
        path: '/new/tgroup/move',
        component: '@/pages/tenant/group/move',
      },
      {
        name: '租户公司编辑',
        path: '/new/tgroup/company',
        component: '@/pages/tenant/group/company',
      },
      {
        name: '租户组织用户角色',
        path: '/new/tgroup/role',
        component: '@/pages/tenant/group/role',
      },
      {
        name: '租户用户组分配角色',
        path: '/new/tuset/role/:id',
        component: '@/pages/tenant/uset/role',
      },
      {
        name: '租户用户组分配用户',
        path: '/new/tuset/user/:id',
        component: '@/pages/tenant/uset/user',
      },
      {
        name: '租户用户组编辑',
        path: '/new/tuset/:id',
        component: '@/pages/tenant/uset/save',
      },
      {
        name: '职位分配角色',
        path: '/new/tposition/role',
        component: '@/pages/tenant/position/role',
      },
      {
        name: '用户编辑职位',
        path: '/new/tposition/:id',
        component: '@/pages/tenant/position/save',
      },
    ],
  },
  {
    path: '/',
    component: '@/layouts/MainLayout',
    routes: [
      {
        path: '/',
        name: '首页',
        redirect: '/dashboard/blog',
      },
      {
        name: '更新日志',
        icon: 'smile',
        path: '/dashboard/blog',
        component: '@/pages/dashboard/blog',
      },
      // 系统管理
      {
        path: '/system',
        icon: 'dashboard',
        name: '系统管理',
        routes: [
          {
            path: '/system',
            redirect: '/system/user',
          },
          {
            name: '流程演示',
            icon: 'smile',
            path: '/system/flow',
            component: '@/pages/flow',
          },
          {
            name: '提单演示',
            icon: 'smile',
            path: '/system/order',
            component: '@/pages/order',
          },
          {
            name: '用户管理',
            icon: 'smile',
            path: '/system/user',
            component: '@/pages/user',
          },
          {
            name: '角色管理',
            icon: 'smile',
            path: '/system/role',
            component: '@/pages/role',
          },
          {
            name: '菜单管理',
            icon: 'smile',
            path: '/system/menu',
            component: '@/pages/menu',
          },
          {
            name: '组织架构',
            icon: 'smile',
            path: '/system/group',
            component: '@/pages/group',
          },
          {
            name: '用户组',
            icon: 'smile',
            path: '/system/uset',
            component: '@/pages/uset',
          },
          {
            name: '职位管理',
            icon: 'smile',
            path: '/system/position',
            component: '@/pages/position',
          },
          {
            name: '授权管理',
            icon: 'smile',
            path: '/system/resource',
            component: '@/pages/resource',
          },
          {
            name: '日志管理',
            icon: 'smile',
            path: '/system/logger',
            component: '@/pages/logger',
          },
          {
            name: '字典管理',
            icon: 'smile',
            path: '/system/dictionary',
            component: '@/pages/dict',
          },
          {
            name: '参数管理',
            icon: 'smile',
            path: '/system/param',
            component: '@/pages/param',
          },
          {
            name: '数据列',
            icon: 'smile',
            path: '/system/pcolumn',
            component: '@/pages/column',
          },
          {
            name: '接入用户',
            icon: 'smile',
            path: '/system/hmac',
            component: '@/pages/hmac',
          },
          {
            name: '接入日志',
            icon: 'smile',
            path: '/system/mlog',
            component: '@/pages/mlogger',
          },
          {
            name: '限流管理',
            icon: 'smile',
            path: '/system/limit',
            component: '@/pages/limit',
          },
          {
            name: '租户管理',
            icon: 'smile',
            path: '/system/tenant',
            component: '@/pages/tenant',
          },
          {
            name: '租户菜单',
            icon: 'smile',
            path: '/system/tmenu',
            component: '@/pages/tmenu',
          },
          {
            name: '租户日志',
            icon: 'smile',
            path: '/system/tlog',
            component: '@/pages/tlog',
          },
          {
            name: '租户接口',
            icon: 'smile',
            path: '/system/tfunction',
            component: '@/pages/tfunction',
          },
          {
            name: '权限动作',
            icon: 'smile',
            path: '/system/action',
            component: '@/pages/action',
          },
          {
            name: '业务资源',
            icon: 'smile',
            path: '/system/bresource',
            component: '@/pages/bresource',
          },
          {
            name: '资源授权',
            icon: 'smile',
            path: '/system/presource',
            component: '@/pages/presource',
          },
          {
            name: '资源演示',
            icon: 'smile',
            path: '/system/file',
            component: '@/pages/file',
          },
        ],
      },
      {
        path: '/*',
        component: '@/pages/404',
      },
    ],
  },
];
