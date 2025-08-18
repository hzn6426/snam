import { constant, iget, ipost } from '@/common/utils';

// 根据用户ID获取业务资源权限及权限范围 -
export function listBPermResourcesByUser(orgId, uid, tid) {
    return iget(`${constant.EAPI_RESOURCE_BPERM_BY_USER}?orgId=${orgId}&uid=${uid}&tid=${tid}`);
}
// 根据用户组ID获取业务资源权限及权限范围 -
export function listBPermResourcesByUset(usetId, tid) {
    return iget(`${constant.EAPI_RESOURCE_BPERM_BY_USET}?usetId=${usetId}&tid=${tid}`);
}
// 根据用户和权限获取用户业务权限 -
export function listPermEntrustsByUser(orgId, uid, pid, tid) {
    return iget(`${constant.EAPI_RESOURCE_PERM_ENTRUST_BY_USER}?orgId=${orgId}&uid=${uid}&permId=${pid}&tid=${tid}`);
}
// 根据用户和权限获取用户排除的业务权限 -
export function listPermExceptEntrustsByUser(orgId, uid, pid, tid) {
    return iget(`${constant.EAPI_RESOURCE_PERM_EXCEPT_ENTRUST_BY_USER}?orgId=${orgId}&uid=${uid}&permId=${pid}&tid=${tid}`);
}
// 保存用户业务权限 -
export function saveUserBusinessPerm(perm) {
    return ipost(constant.EAPI_RESOURCE_SAVE_USER_PERM, perm);
}

// 根据用户组和权限获取用户业务权限 -
export function listPermEntrustsByUset(usetId, pid, tid) {
    return iget(`${constant.EAPI_RESOURCE_PERM_ENTRUST_BY_USET}?usetId=${usetId}&permId=${pid}&tid=${tid}`);
}
// 根据用户组和权限获取排除用户业务权限 -
export function listPermExceptEntrustsByUset(usetId, pid, tid) {
    return iget(`${constant.EAPI_RESOURCE_PERM_EXCEPT_ENTRUST_BY_USET}?usetId=${usetId}&permId=${pid}&tid=${tid}`);
}
// 保存用户组业务权限 -
export function saveUsetBusinessPerm(perm) {
    return ipost(constant.EAPI_RESOURCE_SAVE_USET_PERM, perm);
}
// 根据权限获取对应的业务表信息 -
export function fetchActionMapperByPerm(perm) {
    return iget(`${constant.EAPI_RESOURCE_PERM_TABLE}?permId=${perm}`);
}
// 根据权限获取对应的列权限业务表信息 -
export function fetchColumnActionMapperByPerm(perm) {
    return iget(`${constant.EAPI_RESOURCE_PERM_COLUMN_TABLE}?permId=${perm}`);
}
// 根据业务表信息获取对应的列信息
export function fetchColumnByTable(tables, refresh) {
    return iget(`${constant.EAPI_RESOURCE_TABLE_COLUMN}?tables=${tables}&refresh=${refresh}`);
}
// 保存用户数据权限 -
export function saveUserDataPerm(perm) {
    return ipost(constant.EAPI_RESOURCE_SAVE_USER_DATA_PERM, perm);
}
// 获取用户的数据权限 -
export function loadUserDataPerm(userId, orgId, permId, tid) {
    return iget(`${constant.EAPI_RESOURCE_LOAD_USER_DATA_PERM}?uid=${userId}&orgId=${orgId}&permId=${permId}&tid=${tid}`)
}
// 获取用户组的数据权限 -
export function loadUsetDataPerm(usetId, permId, tid) {
    return iget(`${constant.EAPI_RESOURCE_LOAD_USET_DATA_PERM}?usetId=${usetId}&permId=${permId}&tid=${tid}`)
}
// 保存用户组数据权限 -
export function saveUsetDataPerm(perm) {
    return ipost(constant.EAPI_RESOURCE_SAVE_USET_DATA_PERM, perm);
}
// 获取用户的列数据权限 -
export function loadUserColumnPerm(userId, orgId, permId, tid) {
    return iget(`${constant.EAPI_RESOURCE_LOAD_USER_COLUMN_PERM}?uid=${userId}&orgId=${orgId}&permId=${permId}&tid=${tid}`);
}
// 获取用户组的列数据权限 -
export function loadUsetColumnPerm(usetId, permId, tid) {
    return iget(`${constant.EAPI_RESOURCE_LOAD_USET_COLUMN_PERM}?usetId=${usetId}&permId=${permId}&tid=${tid}`)
}
// 保存用户列权限 -
export function saveUserColumnPerm(perm) {
    return ipost(constant.EAPI_RESOURCE_SAVE_USER_COLUMN_PERM, perm);
}
// 保存用户组列权限 -
export function saveUsetColumnPerm(perm) {
    return ipost(constant.EAPI_RESOURCE_SAVE_USET_COLUMN_PERM, perm);
}
