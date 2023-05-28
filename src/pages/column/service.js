import { constant, idelete, iget, ipost, isearch } from '@/common/utils';

// 获取表格列表
export function fetchTables(conditions) {
    return isearch(`${constant.API_PERM_FETCH_TABLE}`, conditions);
}

// 获取表列信息
export function fetchTableColumns(conditions) {
    return isearch(`${constant.API_PERM_FETCH_TABLE_COLUMN}`, conditions);
}

// 获取数据权限列
export function listPermColumns(table) {
    return iget(`${constant.API_PERM_TABLE_PERM_COLUMN}?table=${table}`);
}

// 获取数据权限列
export function listPermColumnsByTables(table) {
    return iget(`${constant.API_PERM_TABLE_PERM_COLUMN_BY_TABLES}?table=${table}`);
}

// 保存权限列
export function savePermColumns(perms) {
    return ipost(constant.API_PERM, perms);
}

// 删除权限列
export function deletePermColumns(ids) {
    return idelete(constant.API_PERM, ids);
}