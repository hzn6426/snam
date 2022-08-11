//= ==============================================//
//                 SYSTEM CONST                  //
//= ==============================================//
export default Object.freeze({
  // 用户按钮KEY-sessionStorage
  KEY_USER_BUTTON_PERMS: '_USER_BUTTON_PERMS',
  // 用户token存储KEY-sessionStorage
  KEY_USER_TOKEN: '_USER_TOKEN',
  // 客户基础数据缓存
  KEY_CUSTOMER: '_CUSTOMER',
  // 港口数据缓存
  KEY_PORT: '_PORT',
  //词典数据缓存
  KEY_DICT: '_DICT',
  //包装数据缓存
  KEY_PACK: '_PACK',
  //用户数据缓存
  KEY_USER: '_USER',
  //船名匹配
  KEY_VESSEL: '_VESSEL',
  //头像名称
  SYSTEM_AVATAR_NAME: 'SNM',
  // 登录路径
  SYSTEM_ROUTE_LOGIN: '/user/login',
  // 系统标题
  SYSTEM_TITLE: '权限管理系统',
  // basicLayout 刷新
  SUBJECT_SYSTEM_REFRESH: '_subject_system_refresh',
  // 用户属性
  DICT_USER_BUSINEESS_TAG: 'USER_BUSINESS_TAG',

  // 缓存超时时间
  TIME_OUT_FOR_CACHE: 30,
  // localstorage key前缀
  PREFIX_OF_CACHE: '_ctmcenter_',

  // 登录
  API_LOGIN: '/authority/oauth/token',
  // 登录
  API_GROUP: '/authority/group',
  // 登出
  API_LOGOUT: '/authority/oauth/logout',
  // 当前登录用户信息
  API_USER_CURRENT: '/authority/user/currentUser',
  // 用户权限菜单
  API_USER_MENUS: '/authority/user/listAdminMenus',
  // 用户查询
  API_USER_SEARCH: '/authority/user/search',
  // 用户权限按钮
  API_USER_BUTTONS: '/authority/user/listButtons',
  // 用户增删改查
  API_USER: '/authority/user',
  // 用户激活
  API_USER_ACTIVE: '/authority/user/active',
  // 用户重置密码
  API_USER_RESET_PASSWD: '/authority/user/resetPasswd',
  // 用户停用
  API_USER_STOP: '/authority/user/stop',
  // 用户启用
  API_USER_UNSTOP: '/authority/user/unstop',
  // 用户模糊补全
  API_USER_LIST_BY_KEYWORD: '/authority/user/listByTagAndKeyWord',
  // 根据code查用户
  API_USER_LIST_BY_CODE: '/authority/user/listByUserNoStr',
  // 用户更新自己的个人信息
  API_USER_UPDATE_SELF: '/authority/user/updateSelfUser',
  // 用户组织列表
  API_USER_DEPARTMENTS: '/authority/group/userDepartments',
  // 用户切换组织
  API_USER_CHANGE_DEPARTMENT: '/authority/group/change',
  // 头像上传
  API_AVATAR_UPLOAD: '/authority/user/saveAvatar',
  // 邮件验证
  API_USER_EMAIL_VALIDATE: '/authority/user/validateEmail',

  //= ==============================================//
  //                      上传文件                   //
  //= ==============================================//
  // 根据父节点以树方式加载子节点列表
  API_FILE_TREE_BY_PARENT: '/authority/fileManage/treeByParent',
  // 下载文件
  API_FILE_DOWNLOAD: '/authority/file/download',
  // 直接下载
  API_FILE_DIRECT_DOWNLOAD: '/authority/file/directDownload',
  // 新建文件夹
  API_FILE_SAVE_FOLDER: '/authority/fileManage/saveFolder',
  // 根据提单号加载文档
  API_FILE_LIST_BY_BLNO: '/authority/fileManage/listFilesByBlNo',
  // 上传文件
  API_FILE: '/authority/file/upload',

  //= ==============================================//
  //                   角色管理                      //
  //= ==============================================//
  // 角色查询
  API_ROLE_SEARCH: '/authority/role/search',
  // 角色增删改查
  API_ROLE: '/authority/role',
  // 角色激活
  API_ROLE_USE: '/authority/role/use',
  // 角色停用
  API_ROLE_STOP: '/authority/role/stop',
  // 根据用户获取ID列表
  API_ROLE_BY_USER: '/authority/role/listByUser',
  // 获取所有角色列表
  API_ROLE_LIST_ALL: '/authority/role/listAll',
  // 用户设置角色
  API_ROLE_SAVE_USER: '/authority/userRole/saveFromRole',
  // 获取系统所有的资源信息,以树的方式展示
  API_ROLE_TREE_ALL_MENUS: '/authority/resource/treeAllMenus',
  // 获取菜单对应的按钮列表
  API_ROLE_LIST_ALL_BUTTONS_BY_MENU: '/authority/resource/listAllButtonsByMenu',
  // 获取角色拥有权限的菜单ID列表
  API_ROLE_PERM_MENU_LIST: '/authority/resource/listPermMenus',
  // 获取角色拥有权限的按钮ID列表
  API_ROLE_PERM_BUTTON_LIST: '/authority/resource/listPermButtons',
  // 角色菜单权限保存
  API_ROLE_PERM_MENU_SAVE: '/authority/resource/saveMenuPerm',
  // 角色按钮权限保存
  API_ROLE_PERM_BUTTON_SAVE: '/authority/resource/saveButtonPerm',
  // 根据职位获取角色列表
  API_ROLE_BY_POSITION: '/authority/role/listByPosition',
  // 字典匹配
  API_DICT_CHILD_LIST: '/authority/dictionaryChild/listByParentCode',
  //==============================================================
  // order
  //==============================================================
  API_ORDER_SEARCH: '/core/order/search',
  // 客户模糊匹配
  API_CUSTOMER_LIST_BY_KEYWORD: '/core/customer/listByKeyWordAndType',
  // 港口模糊匹配
  API_PORT_LIST_BY_KEYWORD: '/core/port/listByKeyWord',

  //包装模糊匹配
  API_PACK_LIST_BY_KEYWORD: '/core/pack/listByKeyWord',
  //船名模糊匹配
  API_SHIP_LIST_BY_KEYWORD: '/core/ship/listByKeyWord',
  //用户模糊匹配
  API_USER_LIST_BY_KEYWORD: '/core/user/listByTagAndKeyWord',
});
