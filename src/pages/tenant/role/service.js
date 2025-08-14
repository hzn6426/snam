import { ipost, iput, iget, isearch, idelete, constant } from '@/common/utils';
//获取所有角色----需要权限 -
export function listAll(tid) {
  return iget(`${constant.EAPI_ROLE_LIST_ALL}?tid=${tid}`);
}
//条件查询角色-
export function searchRole(conditions) {
  return isearch(constant.EAPI_ROLE_SEARCH, conditions);
}
//ID获取角色 - 
export function getRole(id) {
  return iget(`${constant.EAPI_ROLE}/${id}`);
}
//保存或更新角色 -
export function saveOrUpdateRole(role) {
  return role && role.id ? iput(constant.EAPI_ROLE, role) : ipost(constant.EAPI_ROLE, role);
}
//删除角色 -
export function deleteRole(param) {
  return idelete(constant.EAPI_ROLE, param);
}
//激活角色 -
export function activeRole(ids) {
  return ipost(constant.EAPI_ROLE_USE, ids);
}
//停用角色 -
export function stopRole(ids) {
  return ipost(constant.EAPI_ROLE_STOP, ids);
}
// 根据职位获取角色列表
export function listByPosition(pid) {
  return iget(`${constant.EAPI_ROLE_BY_POSITION}?pid=${pid}`);
}
// 用户设置角色
export function saveFromRole(id) {
  return ipost(constant.EAPI_ROLE_SAVE_USER, id);
}
// 获取系统所有的资源信息,以树的方式展示 -
export function treeAllMenus(tid) {
  return iget(`${constant.EAPI_ROLE_TREE_ALL_MENUS}?tid=${tid}`);
}
// 获取菜单对应的按钮列表 - 
export function listAllButtonsByMenu(mid, tid) {
  return iget(`${constant.EAPI_ROLE_LIST_ALL_BUTTONS_BY_MENU}?menuId=${mid}&tid=${tid}`);
}
// 获取角色拥有权限的菜单ID列表 -
export function listPermMenus(roleId, tid) {
  return iget(`${constant.EAPI_ROLE_PERM_MENU_LIST}?rid=${roleId}&tid=${tid}`);
}
// 获取角色拥有权限的按钮ID列表 -
export function listPermButtons(roleId, menuId, tid) {
  return iget(`${constant.EAPI_ROLE_PERM_BUTTON_LIST}?rid=${roleId}&menuId=${menuId}&tid=${tid}`);
}
// 角色菜单权限保存 - 
export function saveMenuPerm(param) {
  return ipost(constant.EAPI_ROLE_PERM_MENU_SAVE, param);
}
// 角色按钮权限保存 -
export function saveButtonPerm(param) {
  return ipost(constant.EAPI_ROLE_PERM_BUTTON_SAVE, param);
}
// 保存用户角色关系 -
export function saveUserRole(userRole) {
  return ipost(constant.EAPI_ROLE_SAVE_USER, userRole);
}

