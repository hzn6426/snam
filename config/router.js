export default [
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
        path: '/tree',
        component: '../layouts/BlankLayout',
        routes: [
          // {
          //   name: '条件',
          //   path: '/condition',
          //   component: './rule',
          // },
          {
            name: '条件',
            path: '/tree/rule',
            component: './tree',
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
                name: '租户接口',
                path: '/new/tfunction/:id',
                component: './tfunction/save',
              },
              {
                name: '编辑租户菜单',
                path: '/new/tmenu/save',
                component: './tmenu/save',
              },
              {
                name: '编辑租户按钮',
                path: '/new/tmenu/button',
                component: './tmenu/button',
              },
              {
                name: '租户新增',
                path: '/new/tenant/:id',
                component: './tenant/save',
              },
              {
                name: '账单管理',
                path: '/new/tenant/bill/:id',
                component: './tenant/bill',
              },
              {
                name: '充值管理',
                path: '/new/tenant/charge/:id',
                component: './tenant/charge',
              },
              {
                name: '功能管理',
                path: '/new/tenant/function/:id',
                component: './tenant/function',
              },
              {
                name: '授权管理',
                path: '/new/tenant/resource/:id',
                component: './tenant/resource',
              },
              {
                name: '角色授权',
                path: '/new/role/resource/:id',
                component: './role/resource',
              },
              {
                name: '用户授权',
                path: '/new/user/resource/:id',
                component: './user/resource',
              },
              {
                name: '用户权限',
                path: '/new/user/privilege/:id',
                component: './user/privilege',
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
              {
                name: '外部用户',
                path: '/new/hmac/:id',
                component: './hmac/save',
              },
              {
                name: '日志详情',
                path: '/new/logger/:id',
                component: './logger/detail',
              },
              {
                name: '日志详情',
                path: '/new/tlog/:id',
                component: './tlog/detail',
              },
              {
                name: '接入日志详情',
                path: '/new/mlogger/:id',
                component: './mlogger/detail',
              },
              {
                name: '限流器',
                path: '/new/limit/:id',
                component: './limit/save',
              },
              {
                name: '编辑提单',
                path: '/new/order/:id',
                component: './order/save',
              },

              {
                name: '编辑变量',
                path: '/new/rule/variable/:id',
                component: './tree/Variable',
              },
              {
                name: '对象赋值',
                path: '/new/rule/assign/:id',
                component: './tree/Assign',
              },
              {
                name: '对象转换',
                path: '/new/rule/objectConvert/:id',
                component: './tree/ObjectConvert',
              },
              {
                name: 'Json转换成对象',
                path: '/new/rule/jsonToObject/:id',
                component: './tree/JsonToObject',
              },
              {
                name: '转换为Json文本',
                path: '/new/rule/objectToJson/:id',
                component: './tree/ObjectToJson',
              },
              {
                name: 'IF条件',
                path: '/new/rule/ifCondition/:id',
                component: './tree/IFCondition',
              },
              {
                name: 'ELSE IF条件',
                path: '/new/rule/elseIfCondition/:id',
                component: './tree/ElseIFCondition',
              },
              {
                name: 'Groovy代码段',
                path: '/new/rule/groovyCode/:id',
                component: './tree/GroovyCode',
              },
              {
                name: 'While循环',
                path: '/new/rule/whileLoop/:id',
                component: './tree/WhileLoop',
              },
              {
                name: 'For次数循环',
                path: '/new/rule/forNumberLoop/:id',
                component: './tree/ForNumberLoop',
              },
              {
                name: 'For列表循环',
                path: '/new/rule/forItemLoop/:id',
                component: './tree/ForItemLoop',
              },
              {
                name: '返回数据',
                path: '/new/rule/returnData/:id',
                component: './tree/ReturnData',
              },
              {
                name: 'Catch异常',
                path: '/new/rule/catchException/:id',
                component: './tree/CatchException',
              },
              {
                name: 'Throw异常',
                path: '/new/rule/throwException/:id',
                component: './tree/ThrowException',
              },
              {
                name: 'Select查询',
                path: '/new/rule/selectSqlCode/:id',
                component: './tree/SelectSqlCode',
              },
              {
                name: '代码预览',
                path: '/new/rule/previewCode',
                component: './tree/PreviewCode',
              },
              {
                name: '全局变量',
                path: '/new/rule/globalVariable/:id',
                component: './tree/GlobalVariable',
              },
            ]
          }
        ]
      },
      {
        path: '/',
        component: '../layouts/MainLayout',
        routes: [
          {
            path: '/',
            name: '首页',
            redirect: '/dashboard/blog',
          },
          // {
          //   // path: '/dashboard',
          //   // name: '工作台',
          //   // icon: 'dashboard',
          //   // routes: [

          //   name: '工作台',
          //   icon: 'smile',
          //   path: '/dashboard/workspace',
          //   component: './dashboard/workspace',
          // },
              {
                name: '更新日志',
                icon: 'smile',
                path: '/dashboard/blog',
                component: './dashboard/blog',
                //   },
                // ],
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
                name: '提单演示',
                icon: 'smile',
                path: '/system/order',
                component: './order',
              },
              {
                name: '用户管理',
                icon: 'smile',
                path: '/system/user',
                component: './user',
              },
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
              {
                name: '职位管理',
                icon: 'smile',
                path: '/system/position',
                component: './position',
              },
              {
                name: '授权管理',
                icon: 'smile',
                path: '/system/resource',
                component: './resource',
              },
              {
                name: '日志管理',
                icon: 'smile',
                path: '/system/logger',
                component: './logger',
              },
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
              {
                name: '接入用户',
                icon: 'smile',
                path: '/system/hmac',
                component: './hmac',
              },
              {
                name: '接入日志',
                icon: 'smile',
                path: '/system/mlog',
                component: './mlogger',
              },
              {
                name: '限流管理',
                icon: 'smile',
                path: '/system/limit',
                component: './limit',
              },
              {
                name: '租户管理',
                icon: 'smile',
                path: '/system/tenant',
                component: './tenant',
              },
              {
                name: '租户菜单',
                icon: 'smile',
                path: '/system/tmenu',
                component: './tmenu',
              },
              {
                name: '租户日志',
                icon: 'smile',
                path: '/system/tlog',
                component: './tlog',
              },
              {
                name: '租户接口',
                icon: 'smile',
                path: '/system/tfunction',
                component: './tfunction',
              },
            ],
          },
        ],
      },
      
];
