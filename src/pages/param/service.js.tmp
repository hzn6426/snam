import { constant, idelete, iget, iput, ipost, isearch } from '@/common/utils';
// 查询参数
export function searchParam(conditions) {
    return isearch(constant.API_PARAM_SEARCH, conditions);
}
// 保存或更新参数
export function saveOrUpdateParam(param) {
    return param && param.id ? iput(constant.API_PARAM, param) : ipost(constant.API_PARAM, param);
}
// 删除参数
export function deleteParam(ids) {
    return idelete(constant.API_PARAM, ids);
}
