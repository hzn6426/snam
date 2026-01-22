import { constant, iget, isearch } from '@/common/utils';
// 根据条件查询日志
export function searchLogger(conditions) {
    return isearch(constant.API_LOGGER_SEARCH, conditions);
}
//日志详情
export function getLogger(id) {
    return iget(`${constant.API_LOGGER}/${id}`);
}

