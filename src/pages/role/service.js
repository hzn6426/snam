import { ipost, iput, iget, isearch, idelete, constant } from '@/common/utils';
//获取所有角色----需要权限
export function listAll() {
  return iget(constant.API_ROLE_LIST_ALL);
}
//条件查询角色
export function searchRole(conditions) {
  return isearch(constant.API_ROLE_SEARCH, conditions);
}
//ID获取角色
export function getRole(id) {
  return iget(`${constant.API_ROLE}/${id}`);
}
//保存或更新角色
export function saveOrUpdateRole(role) {
  return role && role.id ? iput(constant.API_ROLE, role) : ipost(constant.API_ROLE, role);
}
//删除角色
export function deleteRole(ids) {
  return idelete(constant.API_ROLE, ids);
}
//激活角色
export function activeRole(ids) {
  return ipost(constant.API_ROLE_USE, ids);
}
//停用角色
export function stopRole(ids) {
  return ipost(constant.API_ROLE_STOP, ids);
}
// 根据职位获取角色列表
export function listByPosition(pid) {
  return iget(`${constant.API_ROLE_BY_POSITION}?pid=${pid}`);
}
// 用户设置角色
export function saveFromRole(id) {
  return ipost(constant.API_ROLE_SAVE_USER, id);
}
// 获取系统所有的资源信息,以树的方式展示
export function treeAllMenus() {
  return iget(constant.API_ROLE_TREE_ALL_MENUS);
}
// 获取菜单对应的按钮列表
export function listAllButtonsByMenu(mid) {
  return iget(`${constant.API_ROLE_LIST_ALL_BUTTONS_BY_MENU}?menuId=${mid}`);
}
// 获取角色拥有权限的菜单ID列表
export function listPermMenus(roleId) {
  return iget(`${constant.API_ROLE_PERM_MENU_LIST}?rid=${roleId}`);
}
// 获取角色拥有权限的按钮ID列表
export function listPermButtons(roleId, menuId) {
  return iget(`${constant.API_ROLE_PERM_BUTTON_LIST}?rid=${roleId}&menuId=${menuId}`);
}
// 角色菜单权限保存
export function saveMenuPerm(ids) {
  return ipost(constant.API_ROLE_PERM_MENU_SAVE, ids);
}
// 角色按钮权限保存
export function saveButtonPerm(ids) {
  return ipost(constant.API_ROLE_PERM_BUTTON_SAVE, ids);
}
// 保存用户角色关系
export function saveUserRole(userRole) {
  return ipost(constant.API_ROLE_SAVE_USER, userRole);
}
//刷新所有角色权限
export function refreshPrivileges() {
  return ipost(constant.API_ROLE_REFRESH_PRIVILEGES);
}
