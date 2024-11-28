import { ipost, iput, iget, isearch, idelete, constant, rmap, getCache, hasCache, setCache } from '@/common/utils';
import { map, tap } from 'rxjs/operators';
import { from } from 'rxjs';
//查询
export function searchFunction(conditions) {
    return isearch(constant.API_FUNCTION_SEARCH, conditions);
}
//明细
export function getFunction(id) {
    return iget(`${constant.API_FUNCTION}/${id}`);
}
//保存或更新功能
export function saveOrUpdateFunction(f) {
    return f && f.id ? iput(constant.API_FUNCTION, f) : ipost(constant.API_FUNCTION, f);
}
//删除功能
export function deleteFunction(ids) {
    return idelete(constant.API_FUNCTION, ids);
}
//上线
export function online(ids) {
    return ipost(constant.API_FUNCTION_ONLINE, ids);
}
//下线
export function offline(ids) {
    return ipost(constant.API_FUNCTION_OFFLINE, ids);
}
//开通
export function open(fun) {
    return ipost(constant.API_FUNCTION_OPEN, fun);
}
//关闭
export function close(fun) {
    return ipost(constant.API_FUNCTION_CLOSE, fun);
}
//查询所有上线的功能
export function listAllOnline() {
    return iget(constant.API_FUNCTION_LIST_ALL_ONLINE_FUNCTION);
}

export function listByTenant(tid) {
    return iget(`${constant.API_FUNCTION_LIST_BY_TENANT}?tid=${tid}`);
}



