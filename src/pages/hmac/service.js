import { constant, idelete, iget, ipost, iput, isearch } from '@/common/utils';
//条件查询角色
export function searchHmacUser(conditions) {
    return isearch(constant.API_HMAC_SEARCH, conditions);
}
//ID获取角色
export function getHmacUser(id) {
    return iget(`${constant.API_HMAC}/${id}`);
}
//保存或更新角色
export function saveOrUpdateHmacUser(user) {
    return user && user.id ? iput(constant.API_HMAC, user) : ipost(constant.API_HMAC, user);
}
//删除角色
export function deleteHmacUser(ids) {
    return idelete(constant.API_HMAC, ids);
}
//刷新缓存
export function refreshCache(ids) {
    return ipost(constant.API_HMAC_REFRESH_CACHE, ids);
}
