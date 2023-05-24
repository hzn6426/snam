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
  //国家数据缓存
  KEY_COUNTRY: '_COUNTRY',
  //箱型数据缓存
  KEY_CONTAINER: '_CONTAINER',
  //船公司
  KEY_SHIP_COMPANY: '_SHIP_COMPANY',
  //船代
  KEY_ENTRUST_SHIP_COMPANY: '_ENTRUST_SHIP_COMPANY',
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

  // 海外代理
  OVERSEAS_AGENT: 'OVERSEAS_AGENT',
  // 场站
  DEPOT: 'DEPOT',
  // 订舱代理
  BOOKING_AGENT: 'BOOKING_AGENT',
  // 船代
  SHIPPING_AGENT: 'SHIPPING_AGENT',
  // 海外代理
  // OVERSEAS_AGENT: 'OVERSEAS_AGENT',
  //船公司
  SHIP_COMPANY: 'SHIP_COMPANY',
  //委托单位
  CLIENT: 'CLIENT',
  //车队
  TRUCKING_COMPANY: 'TRUCKING_COMPANY',
  //报关行
  SHIP_CUSTOM: 'SHIP_CUSTOM',
  //仓库
  WAREHOUSE: 'WAREHOUSE',

  // 用户属性
  DICT_USER_BUSINEESS_TAG: 'USER_BUSINESS_TAG',
  // 职位权限范围
  DICT_POSITION_PERM_SCOPE_TAG: 'POSITION_PERM_SCOPE_TAG',
  // 业务权限范围
  DICT_BUSINESS_PERM_SCOPE_TAG: 'BUSINESS_PERM_SCOPE_TAG',

  // 箱型类型
  DICT_BOX_TYPE_TAG: 'BOX_TYPE_TAG',
  // 船舶类型
  DICT_SHIP_TYPE_TAG: 'SHIP_TYPE_TAG',
  // 银行类型
  DICT_BANK_TYPE_TAG: 'BANK_TYPE_TAG',
  // 币别
  DICT_CURRENCY_TAG: 'CURRENCY_TAG',
  // 计费标准
  DICT_CHARGE_TYPE_TAG: 'CHARGE_TYPE_TAG',
  // 客户类型
  DICT_CUSTOMER_TYPE_TAG: 'CUSTOMER_TYPE_TAG',
  // 结算方式
  DICT_FEE_TYPE_TAG: 'FEE_TYPE_TAG',
  // 结算模式
  DICT_SETTLE_MODE_TAG: 'SETTLE_MODE_TAG',
  // 付费习惯
  DICT_PAY_HABIT_TAG: 'PAY_HABIT_TAG',
  // 计量单位
  DICT_MEASURE_UNIT_TAG: 'MEASURE_UNIT_TAG',
  // 发票类型
  DICT_INVOCE_TYPE_TAG: 'INVOICE_TYPE_TAG',
  // 业务类型
  DICT_BUSINESS_TYPE_TAG: 'BUSINESS_TYPE_TAG',
  // 签单方式
  DICT_SIGNWAY_TYPE_TAG: 'SIGNWAY_TYPE_TAG',
  // 装运方式
  DICT_TRANSPORT_TYPE_TAG: 'TRANSPORT_TYPE_TAG',
  // 运输条款
  DICT_SHIP_CLAUSE_TAG: 'SHIP_CLAUSE_TAG',
  // 提单业务来源
  DICT_ORDER_SOURCE_FROM_TAG: 'ORDER_SOURCE_FROM_TAG',
  // 货物标识
  DICT_GOODS_TYPE_TAG: 'GOODS_TYPE_TAG',
  // 危险品等级
  DICT_CARGOD_ANGER_LEVEL_TAG: 'CARGOD_DANGER_LEVEL_TAG',
  // 付费方式
  DICT_PAY_METHOD_TAG: 'PAY_METHOD_TAG',
  // 贸易方式
  DICT_TRADE_TYPE_TAG: 'TRADE_TYPE_TAG',
  // 贸易条款
  DICT_TRADE_CLAUSE_TAG: 'TRADE_CLAUSE_TAG',
  //危险品标签
  DICT_DANGER_TAG: 'DANGEROUS_GOODS',
  //危险品标签
  REEFER_GOODS: 'REEFER_GOODS',
  //提单份数
  DICT_BL_COPIES_TAG: 'BL_COPIES_TAG',
  //提单份数
  DICT_WEIGHT_METHOD_TAG: 'WEIGHT_METHOD_TAG',

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
  // 用户设置角色
  API_USER_SAVE_ROLE: '/authority/userRole/saveFromUser',
  // 根据组织获取用户列表
  API_USER_BY_GROUP: '/authority/user/listByGroup',
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
  // 根据角色获取组织用户列表
  API_USER_LIST_GROUP_USER_BY_ROLE: '/authority/user/listGroupUsersByRole',
  // 根据用户组获取组织用户列表
  API_USER_LIST_GROUP_USER_BY_USET: '/authority/user/listGroupUsersByUset',

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
  // 字典
  //==============================================================
  // 字典查询
  API_DICT_SEARCH: '/authority/dictionary/search',
  //字典增删改查
  API_DICT: '/authority/dictionary',
  // 字典启用
  API_DICT_USE: '/authority/dictionary/use',
  // 字典停用
  API_DICT_STOP: '/authority/dictionary/stop',
  // 字典子项搜索
  API_DICT_CHILD_SEARCH: '/authority/dictionaryChild/search',
  // 字典子项增删改查
  API_DICT_CHILD: '/authority/dictionaryChild',
  // 字典子项启用
  API_DICT_CHILD_USE: '/authority/dictionaryChild/use',
  // 字典子项停用
  API_DICT_CHILD_STOP: '/authority/dictionaryChild/stop',

  //==============================================================
  // 基础数据
  //==============================================================
  // 港口模糊补全
  API_PORT_LIST_BY_KEYWORD: '/booker/port/listByKeyword',
  // 船公司模糊补全
  API_SHIP_COMPANY_LIST_BY_KEYWORD: '/booker/shipCompany/listByKeyword',
  //包装模糊补全
  API_PACK_LIST_BY_KEYWORD: '/booker/pack/listByKeyword',
  //国家模糊补全
  API_COUNTRY_LIST_BY_KEYWORD: '/booker/country/listByKeyword',
  //箱型模糊补全
  API_CONTAINER_LIST_BY_KEYWORD: '/booker/container/listByKeyword',
  //船代模糊补全
  API_ENTRUST_SHIP_COMPANY_LIST_BY_KEYWORD: '/booker/entrustShipCompany/listByKeyword',
  //船模糊匹配
  API_SHIP_LIST_BY_KEYWORD: '/booker/ship/listByKeyword',

  //舱单日志查询
  API_CABIN_IN_LOG_SEARCH: '/booker/cabininlog/search',
  //舱单日志详情
  API_CABIN_IN_LOG: '/booker/cabininlog',

  //==============================================================//
  // 发送日志                                                      //
  //==============================================================//
  // 查询
  API_SENDLOG_SEARCH: '/booker/send/search',
  // 根据id查询日志详情
  API_GET_BOOKOUTLOG_BY_ID: '/booker/send',

  //==============================================================//
  // 授权用户                                                      //
  //==============================================================//
  // 查询
  API_SYSHMACUSER_SEARCH: '/authority/hmacUser/search',
  // 保存 更新
  API_SYSHMACUSER: '/authority/hmacUser',
  // 删除
  API_SYSHMACUSER_DELETE: '/authority/hmacUser',
  // id
  API_SYSHMACUSER_GETHMACUSER: '/authority/hmacUser',
  // 启用
  API_SYSHMACUSER_USESTATE: '/authority/hmacUser/use',
  // 停用
  API_SYSHMACUSER_STOPSTATE: '/authority/hmacUser/stop',

  //==============================================================//
  // 菜单管理                                                      //
  //==============================================================//
  // 查询
  API_MENU_TREE_ALL: '/authority/menu/treeAllMenus',
  // 新增 更新
  API_MENU_SAVE_OR_UPDATE: '/authority/menu/saveOrUpdateMenu',
  // 删除
  API_MENU_DELETE: '/authority/menu',

  // 按钮查询
  API_SEARCH_BUTTON_AND_API_BY_MENU: '/authority/button/searchButtonsAndApiByMenu',
  // 按钮 新增 更新
  API_BUTTON_SAVE_OR_UPDATE: '/authority/button/saveOrUpdateButton',
  // 按钮 删除
  API_BUTTON_DELETE: '/authority/button',
  // ID
  API_BUTTON_GETBUTTON: '/authority/button',

  //= ==============================================//
  //                      用户组管理                  //
  //= ==============================================//
  API_USET_SEARCH: '/authority/uset/search',
  // 用户组增删改查
  API_USET: '/authority/uset',
  // 用户组激活
  API_USET_USE: '/authority/uset/use',
  // 用户组停用
  API_USET_STOP: '/authority/uset/stop',
  // 用户设置用户组
  API_USET_SAVE_USER: '/authority/userUset/saveFromUset',
  // 用户组获取角色
  API_USET_LIST_ROLES: '/authority/usetRole/listRolesByUset',
  // 用户组保存角色列表
  API_USET_SAVE_USET_ROLES: '/authority/usetRole/saveFromUset',
  // 树方式获取所有用户组列表
  API_USET_TREE_ALL: '/authority/uset/treeAllUset',

  //==============================================================//
  // 组织架构                                                      //
  //==============================================================//

  // 组织的顶层节点
  ROOT_OF_GROUP: 'R',
  //以树的方式获取所有组织和用户
  API_GROUP_TREE_ALL_GROUPS_AND_USERS: '/authority/group/treeAllGroupsAndUsers',
  // 获取所有组织和职位列表
  API_GROUP_TREE_ALL_GROUPS_AND_POSITIONS: '/authority/group/treeAllGroupsAndPositions',
  // 更新 保存
  API_GROUP_SAVE_OR_UPDATE: '/authority/group',
  // 删除
  API_GROUP_DELETE: '/authority/group',
  // 增加子组织
  API_GROUP_ADD_DEPARTMENT: '/authority/group/addDepartment',
  // 根据分组查询用户
  API_SEARCH_USER_BY_GROUP: '/authority/group/searchUser',
  // 查询未分配的用户信息
  API_SEARCH_UNASSIGNED_USER: '/authority/group/searchNotAssignUser',
  // 添加分公司
  API_SAVE_COMPANY: '/authority/group/addCompany',
  // 添加组织成员
  API_GROUP_ADD_USER: '/authority/group/addUsers',
  // 分配职位
  API_GROUP_ASSIGN_POSITION: '/authority/group/assignPosition',
  // 移动组织成员
  API_GROUP_MOVE_USERS: '/authority/group/moveUsers',
  // 删除组织成员
  API_GROUP_DELETE_USERS: '/authority/group/removeUsers',
  // 分配角色 给用户赋予角色
  API_SAVE_USER_AND_ROLE: '/authority/userRole/saveUserAndRole',
  // 获取所有组织列表
  API_GROUP_TREE_ALL_GROUPS: '/authority/group/treeAllGroups',

  //= ==============================================//
  //                   职位管理                      //
  //= ==============================================//
  // 根据条件查询职位
  API_POSITION_SEARCH: '/authority/position/search',
  // 职位增删改查
  API_POSITION: '/authority/position',
  // 职位启用
  API_POSITION_USE: '/authority/position/use',
  // 职位停用
  API_POSITION_STOP: '/authority/position/stop',
  // 组织ID获取可用的职位列表
  API_POSITION_LIST_ACTIVED_BY_GROUP: '/authority/position/listActiveByGroup',
  // 组织ID获取对应的委托列表
  API_POSITION_LIST_ENTRUSTS: '/authority/position/listEntrusIdsByPosition',
  // 保存职位角色
  API_POSITION_SAVE_POSITION_ROLES: '/authority/position/savePositionRole',

});
