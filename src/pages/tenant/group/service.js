import { constant, idelete, iget, ipost, iput, isearch } from '@/common/utils';

//查询 -
export function treeAllGroupsAndUsers(tid) {
  return iget(`${constant.EAPI_GROUP_TREE_ALL_GROUPS_AND_USERS}?tid=${tid}`);
}

// 以树的方式获取组织职位列表
export function treeAllGroupsAndPositions() {
  return iget(constant.EAPI_GROUP_TREE_ALL_GROUPS_AND_POSITIONS);
}

// 以树的方式获取所有组织列表
export function treeAllGroups(tid) {
  return iget(`${constant.EAPI_GROUP_TREE_ALL_GROUPS}?tid=${tid}`);
}

//保存 更新 -
export function saveOrUpdateGroup(group) {
  return group && group.id ? iput(constant.EAPI_GROUP_SAVE_OR_UPDATE, group) : ipost(constant.EAPI_GROUP_ADD_DEPARTMENT, group);
}

//刪除-
export function deleteGroup(gid,tid) {
  return idelete(`${constant.EAPI_GROUP_DELETE}?gid=${gid}&tid=${tid}`);
}

// 用户查询
export function searchUserByGroup(conditions) {
  return isearch(constant.EAPI_SEARCH_USER_BY_GROUP, conditions);
}

// 更新组织用户或添加用户到组织
export function addOrUpdateUser(groupUser) {
  return groupUser && groupUser.id
    ? ipost(constant.EAPI_GROUP_ASSIGN_POSITION, groupUser)
    : ipost(constant.EAPI_GROUP_ADD_USER, groupUser);
}


// 查询未分配用户信息 -
export function searchNotAssignedUser(conditions) {
  return isearch(constant.EAPI_SEARCH_UNASSIGNED_USER, conditions);
}


// 保存或更新分公司
export function saveOrUpdateCompany(company) {
  return company && company.id
    ? iput(constant.EAPI_GROUP, company)
    : ipost(constant.EAPI_SAVE_COMPANY, company);
}

// 移动组织成员
export function moveUsers(groupUser) {
  return ipost(constant.EAPI_GROUP_MOVE_USERS, groupUser);
}
// 删除组织成员 -
export function deleteUsers(groupUser) {
  return ipost(constant.EAPI_GROUP_DELETE_USERS, groupUser);
}

// 用户查询角色 -
export function listRoleByUser(uid, orgId, tid) {
  return iget(`${constant.EAPI_ROLE_BY_USER}?orgId=${orgId}&uid=${uid}&tid=${tid}`);
}

