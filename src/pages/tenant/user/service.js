import { constant, getCache, hasCache, idelete, iget, ilogin, ipost, iput, isearch, iupload, rmap, setCache } from '@/common/utils';
import { from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

//获取用户权限按钮
export function loadUserMenus(tid) {
  return iget(`${constant.EAPI_USER_MENUS}?tid=${tid}`);
}
//条件查询用户
export function searchUser(conditions) {
  return isearch(constant.EAPI_USER_SEARCH, conditions);
}
//ID获取用户
export function getUser(id) {
  return iget(`${constant.EAPI_USER}/${id}`);
}
//保存或更新用户
export function saveOrUpdateUser(user) {
  return user && user.id ? iput(constant.EAPI_USER, user) : ipost(constant.EAPI_USER, user);
}
//删除用户
export function deleteUser(params) {
  return idelete(constant.EAPI_USER, params);
}
//激活用户
export function activeUser(ids) {
  return ipost(constant.EAPI_USER_ACTIVE, ids);
}
//重置密码
export function resetUserPasswd(ids) {
  return ipost(constant.EAPI_USER_RESET_PASSWD, ids);
}
//停用用户
export function stopUser(ids) {
  return ipost(constant.EAPI_USER_STOP, ids);
}
//启用用户 --
export function unstopUser(ids) {
  return ipost(constant.EAPI_USER_UNSTOP, ids);
}
//保存用户角色 -- 
export function saveUserRole(userRole) {
  return ipost(constant.EAPI_USER_SAVE_ROLE, userRole);
}
//角色获取用户 --
export function listGroupUsersByRole(rid, tid) {
  return iget(`${constant.EAPI_USER_LIST_GROUP_USER_BY_ROLE}?rid=${rid}&tid=${tid}`);
}
//用户组获取用户
export function listGroupUsersByUset(usetId) {
  return iget(`${constant.EAPI_USER_LIST_GROUP_USER_BY_USET}?usetId=${usetId}`);
}
//根据TAG获取组织和用户
export function treeAllGroupsAndUsersByTag(tag) {
  return iget(`${constant.EAPI_USER_TREE_ALL_GROUPS_AND_USERS_BY_TAG}?utag=${tag}`);
}
//保存菜单权限
export function saveMenuPerm(perm) {
  return ipost(constant.EAPI_USER_SAVE_PERM_MENU, perm);
}
//保存按钮权限
export function saveButtonPerm(perm) {
  return ipost(constant.EAPI_USER_SAVE_PERM_BUTTON, perm);
}
// 获取菜单权限
export function listPermMenus(userId, groupId) {
  return iget(`${constant.EAPI_USER_LIST_PERM_MENUS}?uid=${userId}&gid=${groupId}`);
}
// 获取按钮权限
export function listPermButtons(userId, groupId, menuId) {
  return iget(`${constant.EAPI_USER_LIST_PERM_BUTTONS}?uid=${userId}&gid=${groupId}&mid=${menuId}`);
}
// 获取权限菜单按钮
export function listPermMenusAndButtons(userId, groupId, roleId, beFilterPerm, beFilterUnAuthPerm) {
  let rid = roleId == 'all' ? '' : roleId;
  return iget(`${constant.EAPI_USER_LIST_PERM_MENUS_AND_BUTTONS}?uid=${userId}&gid=${groupId}&rid=${rid}&fp=${!!beFilterPerm}&np=${!!beFilterUnAuthPerm}`);
}
// 获取角色列表
export function listRoles(userId, groupId) {
  return iget(`${constant.EAPI_USER_LIST_ROLES}?uid=${userId}&gid=${groupId}`);
}
// 获取用户组列表
export function listUsets(userId, groupId) {
  return iget(`${constant.EAPI_USER_LIST_USETS}?uid=${userId}&gid=${groupId}`);
}
// 获取用户职位列表
export function listPositions(userId, groupId) {
  return iget(`${constant.EAPI_USER_LIST_POSITIONS}?uid=${userId}&gid=${groupId}`);
}
// 获取业务权限对应的菜单和按钮
export function listActionMenusAndButtons(userId, groupId) {
  return iget(`${constant.EAPI_USER_LIST_ACTION_PERM_MENUS_AND_BUTTONS}?uid=${userId}&gid=${groupId}`);
}


