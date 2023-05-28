import { constant, isearch } from '@/common/utils';
// 根据条件查询日志
export function searchLogger(conditions) {
    return isearch(constant.API_LOGGER_SEARCH, conditions);
}

