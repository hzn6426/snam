import { constant, iget, ipost } from '@/common/utils';

// 根据用户ID获取业务资源权限及权限范围
export function listBPermResourcesByUser(orgId, uid) {
    return iget(`${constant.API_RESOURCE_BPERM_BY_USER}?orgId=${orgId}&uid=${uid}`);
}
// 根据用户ID获取系统业务资源权限及权限范围
export function listBusinessBPermResourcesByUser(orgId, uid, resourceType) {
    return iget(`${constant.API_RESOURCE_BUSINESS_BPERM_BY_USER}?orgId=${orgId}&uid=${uid}&resourceType=${resourceType}`);
}
// 根据用户组ID获取业务资源权限及权限范围
export function listBPermResourcesByUset(usetId) {
    return iget(`${constant.API_RESOURCE_BPERM_BY_USET}?usetId=${usetId}`);
}
// 根据用户组ID获取系统业务资源权限及权限范围
export function listBusinessBPermResourcesByUset(usetId, resourceType) {
    return iget(`${constant.API_RESOURCE_BUSINESS_BPERM_BY_USET}?usetId=${usetId}&&resourceType=${resourceType}`);
}
// 根据职位ID获取业务资源权限及权限范围
export function listBPermResourcesByPosition(positionId) {
    return iget(`${constant.API_RESOURCE_BPERM_BY_POSITION}?positionId=${positionId}`);
}
// 根据职位ID获取系统业务资源权限及权限范围
export function listBusinessBPermResourcesByPosition(positionId, resourceType) {
    return iget(`${constant.API_RESOURCE_BUSINESS_BPERM_BY_POSITION}?positionId=${positionId}&resourceType=${resourceType}`);
}
// 根据用户和权限获取用户业务权限
export function listPermEntrustsByUser(orgId, uid, pid) {
    return iget(`${constant.API_RESOURCE_PERM_ENTRUST_BY_USER}?orgId=${orgId}&uid=${uid}&permId=${pid}`);
}
// 根据用户和权限获取用户额外的业务权限
export function listPermAdditionalEntrustsByUser(orgId, uid, pid) {
    return iget(`${constant.API_RESOURCE_PERM_ADDITIONAL_ENTRUST_BY_USER}?orgId=${orgId}&uid=${uid}&permId=${pid}`);
}
// 根据用户和权限获取用户排除的业务权限
export function listPermExceptEntrustsByUser(orgId, uid, pid) {
    return iget(`${constant.API_RESOURCE_PERM_EXCEPT_ENTRUST_BY_USER}?orgId=${orgId}&uid=${uid}&permId=${pid}`);
}
// 保存用户业务权限
export function saveUserBusinessPerm(perm) {
    return ipost(constant.API_RESOURCE_SAVE_USER_PERM, perm);
}

// 根据用户组和权限获取用户业务权限
export function listPermEntrustsByUset(usetId, pid) {
    return iget(`${constant.API_RESOURCE_PERM_ENTRUST_BY_USET}?usetId=${usetId}&permId=${pid}`);
}

// 根据用户组和权限获取用户额外的业务权限
export function listPermAdditionalEntrustsByUset(usetId, pid) {
    return iget(`${constant.API_RESOURCE_PERM_ADDITIONAL_ENTRUST_BY_USET}?usetId=${usetId}&permId=${pid}`);
}
// 根据职位和权限获取用户业务权限
export function listPermEntrustsByPosition(positionId, pid) {
    return iget(`${constant.API_RESOURCE_PERM_ENTRUST_BY_POSITION}?positionId=${positionId}&permId=${pid}`);
}
// 根据职位和权限获取用户额外的业务权限
export function listPermAdditionalEntrustsByPosition(positionId, pid) {
    return iget(`${constant.API_RESOURCE_PERM_ADDITIONAL_ENTRUST_BY_POSITION}?positionId=${positionId}&permId=${pid}`);
}
// 根据用户组和权限获取排除用户业务权限
export function listPermExceptEntrustsByUset(usetId, pid) {
    return iget(`${constant.API_RESOURCE_PERM_EXCEPT_ENTRUST_BY_USET}?usetId=${usetId}&permId=${pid}`);
}
// 根据职位和权限获取排除用户业务权限
export function listPermExceptEntrustsByPosition(positionId, pid) {
    return iget(`${constant.API_RESOURCE_PERM_EXCEPT_ENTRUST_BY_POSITION}?positionId=${positionId}&permId=${pid}`);
}
// 保存用户组业务权限
export function saveUsetBusinessPerm(perm) {
    return ipost(constant.API_RESOURCE_SAVE_USET_PERM, perm);
}
// 保存职位业务权限
export function savePositionBusinessPerm(perm) {
    return ipost(constant.API_RESOURCE_SAVE_POSITION_PERM, perm);
}
// 根据权限获取对应的业务表信息
export function fetchActionMapperByPerm(perm) {
    return iget(`${constant.API_RESOURCE_PERM_TABLE}?permId=${perm}`);
}
// 根据权限获取对应的列权限业务表信息
export function fetchColumnActionMapperByPerm(perm) {
    return iget(`${constant.API_RESOURCE_PERM_COLUMN_TABLE}?permId=${perm}`);
}
// 根据业务表信息获取对应的列信息
export function fetchColumnByTable(tables, refresh) {
    return iget(`${constant.API_RESOURCE_TABLE_COLUMN}?tables=${tables}&refresh=${refresh}`);
}
// 保存用户数据权限
export function saveUserDataPerm(perm) {
    return ipost(constant.API_RESOURCE_SAVE_USER_DATA_PERM, perm);
}
// 获取用户的数据权限
export function loadUserDataPerm(userId, orgId, permId) {
    return iget(`${constant.API_RESOURCE_LOAD_USER_DATA_PERM}?uid=${userId}&orgId=${orgId}&permId=${permId}`)
}
// 获取用户组的数据权限
export function loadUsetDataPerm(usetId, permId) {
    return iget(`${constant.API_RESOURCE_LOAD_USET_DATA_PERM}?usetId=${usetId}&permId=${permId}`)
}
// 获取用户组的数据权限
export function loadPositionDataPerm(positionId, permId) {
    return iget(`${constant.API_RESOURCE_LOAD_POSITION_DATA_PERM}?positionId=${positionId}&permId=${permId}`)
}
// 保存用户组数据权限
export function saveUsetDataPerm(perm) {
    return ipost(constant.API_RESOURCE_SAVE_USET_DATA_PERM, perm);
}
// 保存职位数据权限
export function savePositionDataPerm(perm) {
    return ipost(constant.API_RESOURCE_SAVE_POSITION_DATA_PERM, perm);
}
// 获取用户的列数据权限
export function loadUserColumnPerm(userId, orgId, permId) {
    return iget(`${constant.API_RESOURCE_LOAD_USER_COLUMN_PERM}?uid=${userId}&orgId=${orgId}&permId=${permId}`);
}
// 获取用户组的列数据权限
export function loadUsetColumnPerm(usetId, permId) {
    return iget(`${constant.API_RESOURCE_LOAD_USET_COLUMN_PERM}?usetId=${usetId}&permId=${permId}`)
}
// 获取用户组的列数据权限
export function loadPositionColumnPerm(positionId, permId) {
    return iget(`${constant.API_RESOURCE_LOAD_POSITION_COLUMN_PERM}?positionId=${positionId}&permId=${permId}`)
}
// 保存用户列权限
export function saveUserColumnPerm(perm) {
    return ipost(constant.API_RESOURCE_SAVE_USER_COLUMN_PERM, perm);
}
// 保存用户组列权限
export function saveUsetColumnPerm(perm) {
    return ipost(constant.API_RESOURCE_SAVE_USET_COLUMN_PERM, perm);
}
// 保存职位列权限
export function savePositionColumnPerm(perm) {
    return ipost(constant.API_RESOURCE_SAVE_POSITION_COLUMN_PERM, perm);
}
// 获取用户按钮数据权限
export function getUserFunctionDataPerm(viewType, permId, userId, orgId, positionId, usetId) {
    return iget(`${constant.API_RESOURCE_USER_FUNCTION_DATA_PERM}?viewType=${viewType}&permId=${permId}&userId=${userId}&orgId=${orgId}&positionId=${positionId}&usetId=${usetId}`)
}
// 获取用户业务数据权限
export function getUserBusinessDataPerm(viewType, permId, userId, orgId, positionId, usetId) {
    return iget(`${constant.API_RESOURCE_USER_BUSINESS_DATA_PERM}?viewType=${viewType}&permId=${permId}&userId=${userId}&orgId=${orgId}&positionId=${positionId}&usetId=${usetId}`)
}
// 获取用户列数据权限
export function getUserColumnDataPerm(viewType, permId, userId, orgId, positionId, usetId) {
    return iget(`${constant.API_RESOURCE_USER_COLUMN_DATA_PERM}?viewType=${viewType}&permId=${permId}&userId=${userId}&orgId=${orgId}&positionId=${positionId}&usetId=${usetId}`)
}