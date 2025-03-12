import { constant, idelete, iget, ipost, iput, isearch } from '@/common/utils';

//条件查询
export function searchOrder(conditions) {
    return isearch(constant.API_ORDER_SEARCH, conditions);
}

//保存或更新
export function saveOrUpdateOrder(order) {
    return order && order.id ? iput(constant.API_ORDER, order) : ipost(constant.API_ORDER, order);
}

//获取明细
export function getOrder(id) {
    return iget(`${constant.API_ORDER}/${id}`);
}

//删除供应商
export function deleteOrder(ids) {
    return idelete(constant.API_ORDER, ids);
}