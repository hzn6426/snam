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
        path: '/new',
        routes: [
          {
            path: '/new',
            component: '../layouts/WindowLayout',
            routes: [
              {
                name: '角色授权',
                path: '/new/role/resource/:id',
                component: './role/resource',
              },
              {
                name: '角色分配用户',
                path: '/new/role/assignUser/:id',
                component: './role/user',
              },
              {
                name: '角色新增',
                path: '/new/role/:id',
                component: './role/save',
              },
              {
                name: '用户新增',
                path: '/new/user/:id',
                component: './user/save',
              },
              {
                name: '字典新增',
                path: '/new/dict/:id',
                component: './dict/save',
              },
              {
                name: '子字典新增',
                path: '/new/dictChild/:id',
                component: './dict/child',
              },
              {
                name: '组织编辑',
                path: '/new/group/save',
                component: './group/save',
              },
              {
                name: '组织用户编辑',
                path: '/new/group/user',
                component: './group/user',
              },
              {
                name: '组织用户移动',
                path: '/new/group/move',
                component: './group/move',
              },
              {
                name: '公司编辑',
                path: '/new/group/company',
                component: './group/company',
              },
              {
                name: '组织用户角色',
                path: '/new/group/role',
                component: './group/role',
              },
              {
                name: '用户组分配角色',
                path: '/new/uset/role/:id',
                component: './uset/role',
              },
              {
                name: '用户组分配用户',
                path: '/new/uset/user/:id',
                component: './uset/user',
              },
              {
                name: '用户组编辑',
                path: '/new/uset/:id',
                component: './uset/save',
              },
              {
                name: '职位分配角色',
                path: '/new/position/role',
                component: './position/role',
              },
              {
                name: '用户编辑职位',
                path: '/new/position/:id',
                component: './position/save',
              },
              {
                name: '编辑菜单',
                path: '/new/menu/save',
                component: './menu/save',
              },
              {
                name: '编辑按钮',
                path: '/new/menu/button',
                component: './menu/button',
              },
              {
                name: '编辑参数',
                path: '/new/param/save',
                component: './param/save',
              },

              // {
              //   name: '公司充值',
              //   path: '/new/company/recharge/:id',
              //   component: './company/recharge',
              // },
              // {
              //   name: '公司管理',
              //   path: '/new/company/:id',
              //   component: './company/save',
              // },
            ]
          }
        ]
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
              //   name: '舱单日志',
              //   icon: 'smile',
              //   path: '/system/cabininlog',
              //   component: './cabininlog'
              // },
              // {
              //   name: '发送日志',
              //   icon: 'smile',
              //   path: '/system/sendlog',
              //   component: './sendlog',

              // },
              // {
              //   name: '授权用户',
              //   icon: 'smile',
              //   path: '/system/syshmacuser',
              //   component: './syshmacuser',
              // },
              {
                name: '角色管理',
                icon: 'smile',
                path: '/system/role',
                component: './role',
              },
              {
                name: '菜单管理',
                icon: 'smile',
                path: '/system/menu',
                component: './menu',
              },
              {
                name: '组织架构',
                icon: 'smile',
                path: '/system/group',
                component: './group',
              },
              {
                name: '用户组',
                icon: 'smile',
                path: '/system/uset',
                component: './uset',
              },
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
              {
                name: '职位管理',
                icon: 'smile',
                path: '/system/position',
                component: './position',
              },
              // {
              //   name: 'resource',
              //   icon: 'smile',
              //   path: '/system/resource',
              //   component: './resource',
              // },
              {
                name: '日志管理',
                icon: 'smile',
                path: '/system/logger',
                component: './logger',
              },
              // {
              //   name: 'file',
              //   icon: 'smile',
              //   path: '/system/file',
              //   component: './file',
              // },
              {
                name: '字典管理',
                icon: 'smile',
                path: '/system/dictionary',
                component: './dict',
              },
              {
                name: '参数管理',
                icon: 'smile',
                path: '/system/param',
                component: './param',
              },
              {
                name: '数据列',
                icon: 'smile',
                path: '/system/pcolumn',
                component: './column',
              },
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
          // {
          //   path: '/business',
          //   icon: 'operate',
          //   name: '业务管理',
          //   routes: [
          //     {
          //       path: '/',
          //       redirect: '/business/cabin',
          //     },
          //     {
          //       name: '舱单管理',
          //       icon: 'smile',
          //       path: '/business/cabin',
          //       component: './cabin',
          //     },
          //     {
          //       name: '业务详情',
          //       icon: 'smile',
          //       path: '/business/cabin/detail/:id',
          //       component: './cabin/detail',
          //     },
          //     {
          //       name: '公司管理',
          //       icon: 'smile',
          //       path: '/business/company',
          //       component: './company',
          //     },
          //     {
          //       name: '充值记录',
          //       icon: 'smile',
          //       path: '/business/recharge',
          //       component: './recharge',
          //     },
          //   ],
          // },
        ],
      },
    ],
  },
];
