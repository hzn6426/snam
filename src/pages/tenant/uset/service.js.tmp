import { ipost, iput, iget, isearch, idelete, constant } from '@/common/utils';
// 查询用户组 -
export function searchUset(conditions) {
  return isearch(constant.EAPI_USET_SEARCH, conditions);
}
// 用户组明细 -
export function getUset(id) {
  return iget(`${constant.EAPI_USET}/${id}`);
}
// 保存或更新用户组 -
export function saveOrUpdateUset(uset) {
  return uset && uset.id ? iput(constant.EAPI_USET, uset) : ipost(constant.EAPI_USET, uset);
}
// 删除用户组 -
export function deleteUset(ids) {
  return idelete(constant.EAPI_USET, ids);
}
// 启用用户组 -
export function useUset(ids) {
  return ipost(constant.EAPI_USET_USE, ids);
}
// 停用用户组 -
export function stopUset(ids) {
  return ipost(constant.EAPI_USET_STOP, ids);
}

// 保存用户用户组关系 -
export function saveUserUset(userSet) {
  return ipost(constant.EAPI_USET_SAVE_USER, userSet);
}
//用户组角色列表 -
export function listRolesByUset(usetId, tid) {
  return iget(`${constant.EAPI_USET_LIST_ROLES}?usetId=${usetId}&tid=${tid}`);
}
//用户组关联角色 -
export function saveUsetRole(usetRole) {
  return ipost(constant.EAPI_USET_SAVE_USET_ROLES, usetRole);
}
//获取所有用户组 -
export function treeAllUset(tid) {
  return iget(`${constant.EAPI_USET_TREE_ALL}?tid=${tid}`);
}
