import { constant, idelete, iget, iput, ipost, isearch } from '@/common/utils';

// 查询限流
export function searchLimit(conditions) {
    return isearch(constant.API_LIMIT_SEARCH, conditions);
}
// 保存或更新限流
export function saveOrUpdateLimit(limit) {
    return limit && limit.id ? iput(constant.API_LIMIT, limit) : ipost(constant.API_LIMIT, limit);
}
// 删除限流器
export function deleteLimit(ids) {
    return idelete(constant.API_LIMIT, ids);
}
// 获取限流明细
export function getLimit(id) {
    return iget(`${constant.API_LIMIT}/${id}`);
}
//启用限流
export function useLimit(ids) {
    return ipost(constant.API_LIMIT_USE, ids);
}
//停用限流
export function stopLimit(ids) {
    return ipost(constant.API_LIMIT_STOP, ids);
}

//刷新缓存
export function refreshCache() {
    return ipost(constant.API_LIMIT_REFRESH_CACHE);
}