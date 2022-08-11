export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: '登录',
            path: '/user/login',
            component: './login',
          },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/TabsLayout',
        routes: [
          {
            path: '/',
            name: '首页',
            redirect: '/dashboard/blog',
          },
          {
            path: '/dashboard',
            name: '工作台',
            icon: 'dashboard',
            routes: [
              {
                name: '更新日志',
                icon: 'smile',
                path: '/dashboard/blog',
                component: './dashboard/blog',
              },
            ],
          },
          // 系统管理
          {
            path: '/system',
            icon: 'dashboard',
            name: '系统管理',
            routes: [
              {
                path: '/',
                redirect: '/system/user',
              },
              {
                name: '用户管理',
                icon: 'smile',
                path: '/system/user',
                component: './user',
              },
              // {
              //   name: 'uset',
              //   icon: 'smile',
              //   path: '/system/uset',
              //   component: './uset',
              // },
              // {
              //   name: 'role',
              //   icon: 'smile',
              //   path: '/system/role',
              //   component: './role',
              // },
              // {
              //   name: 'group',
              //   icon: 'smile',
              //   path: '/system/group',
              //   component: './group',
              // },
              // {
              //   name: 'position',
              //   icon: 'smile',
              //   path: '/system/position',
              //   component: './position',
              // },
              // {
              //   name: 'resource',
              //   icon: 'smile',
              //   path: '/system/resource',
              //   component: './resource',
              // },
              // {
              //   name: 'logger',
              //   icon: 'smile',
              //   path: '/system/logger',
              //   component: './logger',
              // },
              // {
              //   name: 'file',
              //   icon: 'smile',
              //   path: '/system/file',
              //   component: './file',
              // },
              // {
              //   name: 'dictionary',
              //   icon: 'smile',
              //   path: '/system/dictionary',
              //   component: './dict',
              // },
              // {
              //   name: 'param',
              //   icon: 'smile',
              //   path: '/system/param',
              //   component: './param',
              // },
              // {
              //   name: 'menu',
              //   icon: 'smile',
              //   path: '/system/menu',
              //   component: './menu',
              // },
              // {
              //   name: 'report',
              //   icon: 'smile',
              //   path: '/system/report',
              //   component: './report',
              // },
            ],
          },
        ],
      },
    ],
  },
];
