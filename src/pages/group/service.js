import { ipost, iput, iget, iupload, isearch, idownload, getCache, setCache, constant, idelete, rmap, hasCache } from '@/common/utils';
import { map, tap } from 'rxjs/operators';
import { from } from 'rxjs';

//查询
export function treeAllGroupsAndUsers() {
  return iget(constant.API_GROUP_TREE_ALL_GROUPS_AND_USERS);
}

// 以树的方式获取组织职位列表
export function treeAllGroupsAndPositions() {
  return iget(constant.API_GROUP_TREE_ALL_GROUPS_AND_POSITIONS);
}

// 以树的方式获取所有组织列表
export function treeAllGroups() {
  return iget(constant.API_GROUP_TREE_ALL_GROUPS);
}

//保存 更新
export function saveOrUpdateGroup(group) {
  return group && group.id ? iput(constant.API_GROUP_SAVE_OR_UPDATE, group) : ipost(constant.API_GROUP_ADD_DEPARTMENT, group);
}

//刪除
export function deleteGroup(gid) {
  return idelete(`${constant.API_GROUP_DELETE}?gid=${gid}`);
}

// 用户查询
export function searchUserByGroup(conditions) {
  return isearch(constant.API_SEARCH_USER_BY_GROUP, conditions);
}


export function addOrUpdateUser(groupUser) {
  return groupUser && groupUser.id
    ? ipost(constant.API_GROUP_ASSIGN_POSITION, groupUser)
    : ipost(constant.API_GROUP_ADD_USER, groupUser);
}


// 查询未分配用户信息
export function searchNotAssignedUser(conditions) {
  return isearch(constant.API_SEARCH_UNASSIGNED_USER, conditions);
}


// 保存或更新分公司
export function saveOrUpdateCompany(company) {
  return company && company.id
    ? iput(constant.API_GROUP, company)
    : ipost(constant.API_SAVE_COMPANY, company);
}

// 移动组织成员
export function moveUsers(groupUser) {
  return ipost(constant.API_GROUP_MOVE_USERS, groupUser);
}
// 删除组织成员
export function deleteUsers(groupUser) {
  return ipost(constant.API_GROUP_DELETE_USERS, groupUser);
}

// 用户查询角色
export function listRoleByUser(uid, orgId) {
  return iget(`${constant.API_ROLE_BY_USER}?orgId=${orgId}&uid=${uid}`);
}

