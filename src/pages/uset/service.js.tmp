import { ipost, iput, iget, isearch, idelete, constant } from '@/common/utils';
// 查询用户组
export function searchUset(conditions) {
  return isearch(constant.API_USET_SEARCH, conditions);
}
// 用户组明细
export function getUset(id) {
  return iget(`${constant.API_USET}/${id}`);
}
// 保存或更新用户组
export function saveOrUpdateUset(role) {
  return role && role.id ? iput(constant.API_USET, role) : ipost(constant.API_USET, role);
}
// 删除用户组
export function deleteUset(ids) {
  return idelete(constant.API_USET, ids);
}
// 启用用户组
export function useUset(ids) {
  return ipost(constant.API_USET_USE, ids);
}
// 停用用户组
export function stopUset(ids) {
  return ipost(constant.API_USET_STOP, ids);
}

// 保存用户用户组关系
export function saveUserUset(userRole) {
  return ipost(constant.API_USET_SAVE_USER, userRole);
}

export function listRolesByUset(usetId) {
  return iget(`${constant.API_USET_LIST_ROLES}?usetId=${usetId}`);
}

export function saveUsetRole(usetRole) {
  return ipost(constant.API_USET_SAVE_USET_ROLES, usetRole);
}

export function treeAllUset() {
  return iget(constant.API_USET_TREE_ALL);
}
