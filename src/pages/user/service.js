import { ipost, iput, iget, iupload, isearch, constant } from '@/common/utils';
//登录
export function login(params) {
  return ipost(constant.API_LOGIN, params);
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
