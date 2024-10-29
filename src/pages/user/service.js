import { constant, getCache, hasCache, idelete, iget, ilogin, ipost, iput, isearch, iupload, rmap, setCache } from '@/common/utils';
import { from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

//登录
export function login(params, tag) {
  return ilogin(constant.API_LOGIN, params, { HEADER_USER_SYSTEM_TAG: tag });
}
//登出
export function logout() {
  return ipost(constant.API_LOGOUT);
}
// 组织列表
export function userDepartments() {
  return iget(constant.API_USER_DEPARTMENTS);
}
// 切换组织
export function changeDepartment(gid) {
  return iget(`${constant.API_USER_CHANGE_DEPARTMENT}?gid=${gid}`);
}

//获取用户权限按钮
export function loadUserMenus() {
  return iget(constant.API_USER_MENUS);
}
//获取用户权限按钮列表
export function loadUserButtons() {
  return iget(constant.API_USER_BUTTONS);
}
//获取当前用户
export function getCurrentUser() {
  return iget(constant.API_USER_CURRENT);
}
//更新当前用户信息
export function updateSelfUser(user) {
  return iput(constant.API_USER_UPDATE_SELF, user);
}
// 头像上传
export function uploadAvatar(formData) {
  return iupload(constant.API_FILE, formData);
}
//条件查询用户
export function searchUser(conditions) {
  return isearch(constant.API_USER_SEARCH, conditions);
}
//ID获取用户
export function getUser(id) {
  return iget(`${constant.API_USER}/${id}`);
}
//保存或更新用户
export function saveOrUpdateUser(user) {
  return user && user.id ? iput(constant.API_USER, user) : ipost(constant.API_USER, user);
}
//删除用户
export function deleteUser(ids) {
  return idelete(constant.API_USER, ids);
}
//激活用户
export function activeUser(ids) {
  return ipost(constant.API_USER_ACTIVE, ids);
}
//重置密码
export function resetUserPasswd(ids) {
  return ipost(constant.API_USER_RESET_PASSWD, ids);
}
//停用用户
export function stopUser(ids) {
  return ipost(constant.API_USER_STOP, ids);
}
//启用用户
export function unstopUser(ids) {
  return ipost(constant.API_USER_UNSTOP, ids);
}
//保存用户角色
export function saveUserRole(userRole) {
  return ipost(constant.API_USER_SAVE_ROLE, userRole);
}
//角色获取用户
export function listGroupUsersByRole(rid) {
  return iget(`${constant.API_USER_LIST_GROUP_USER_BY_ROLE}?rid=${rid}`);
}
//用户组获取用户
export function listGroupUsersByUset(usetId) {
  return iget(`${constant.API_USER_LIST_GROUP_USER_BY_USET}?usetId=${usetId}`);
}
//根据TAG获取组织和用户
export function treeAllGroupsAndUsersByTag(tag) {
  return iget(`${constant.API_USER_TREE_ALL_GROUPS_AND_USERS_BY_TAG}?utag=${tag}`);
}
//保存菜单权限
export function saveMenuPerm(perm) {
  return ipost(constant.API_USER_SAVE_PERM_MENU, perm);
}
//保存按钮权限
export function saveButtonPerm(perm) {
  return ipost(constant.API_USER_SAVE_PERM_BUTTON, perm);
}
// 获取菜单权限
export function listPermMenus(userId, groupId) {
  return iget(`${constant.API_USER_LIST_PERM_MENUS}?uid=${userId}&gid=${groupId}`);
}
// 获取按钮权限
export function listPermButtons(userId, groupId, menuId) {
  return iget(`${constant.API_USER_LIST_PERM_BUTTONS}?uid=${userId}&gid=${groupId}&mid=${menuId}`);
}
// 获取权限菜单按钮
export function listPermMenusAndButtons(userId, groupId) {
  return iget(`${constant.API_USER_LIST_PERM_MENUS_AND_BUTTONS}?uid=${userId}&gid=${groupId}`);
}
// 获取角色列表
export function listRoles(userId, groupId) {
  return iget(`${constant.API_USER_LIST_ROLES}?uid=${userId}&gid=${groupId}`);
}
// 获取用户组列表
export function listUsets(userId, groupId) {
  return iget(`${constant.API_USER_LIST_USETS}?uid=${userId}&gid=${groupId}`);
}
// 获取用户职位列表
export function listPositions(userId, groupId) {
  return iget(`${constant.API_USER_LIST_POSITIONS}?uid=${userId}&gid=${groupId}`);
}
// 获取业务权限对应的菜单和按钮
export function listActionMenusAndButtons(userId, groupId) {
  return iget(`${constant.API_USER_LIST_ACTION_PERM_MENUS_AND_BUTTONS}?uid=${userId}&gid=${groupId}`);
}
// 用户模糊匹配
export function listByKeyword(tag, keyword) {
  let cacheKey;
  if (!keyword) {
    cacheKey = constant.KEY_USER + tag;
    if (hasCache(cacheKey)) {
      return from(getCache(cacheKey));
    }
  }
  return iget(`${constant.API_USER_LIST_BY_KEYWORD}?userTag=${tag}&keyWord=${keyword}`).pipe(
    map((data) => {
      const theData = data || [];
      return rmap(
        (item) => ({
          label: `${item.userRealCnName}`,
          value: `${item.id}`,
        }),
        theData,
      );
    }),
    tap((v) => cacheKey && setCache(cacheKey, v)),
  );
}

