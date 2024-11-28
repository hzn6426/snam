import { ipost, iput, iget, isearch, idelete, constant, rmap, getCache, hasCache, setCache } from '@/common/utils';
import { map, tap } from 'rxjs/operators';
import { from } from 'rxjs';
export function searchTenant(conditions) {
    return isearch(constant.API_TENANT_SEARCH, conditions);
}

//锁定租户
export function lock(ids) {
    return ipost(constant.API_TENANT_LOCK, ids);
}

//ID获取租户
export function getTenant(id) {
    return iget(`${constant.API_TENANT}/${id}`);
}

//解锁租户
export function unlock(ids) {
    return ipost(constant.API_TENANT_UNLOCK, ids);
}

//初始化超级用户
export function doInitSUser(tenant) {
    return ipost(constant.API_TENANT_DO_INIT_SUSER, tenant);
}
//保存或更新租户
export function saveOrUpdateTenant(tenant) {
    return tenant && tenant.id ? iput(constant.API_TENANT, tenant) : ipost(constant.API_TENANT, tenant);
}

//分配菜单
export function assignMenus(tenant) {
    return ipost(constant.API_TENANT_ASSIGN_MENUS, tenant);
}
//分配按钮
export function assignButtons(tenant) {
    return ipost(constant.API_TENANT_ASSIGN_BUTTONS, tenant);
}
//获取租户对应的所有菜单
export function listAllMenus(tid) {
    return iget(`${constant.API_TENANT_LIST_ALL_MENUS}?tid=${tid}`);
}
//获取租户对应的所有按钮
export function listAllButtonsByMenu(tid, mid) {
    return iget(`${constant.API_TENANT_LIST_ALL_BUTTONS_BY_MENU}?tid=${tid}&menuId=${mid}`);
}

//充值
export function charge(tenant) {
    return ipost(constant.API_TENANT_CHARGE, tenant);
}
//查询费用
export function searchFeeByTenant(condition) {
    return isearch(constant.API_TENANT_SEARCH_FEE_BY_TENANT, condition);
}

export function listByKeyword(keyword) {
    let cacheKey;
    if (!keyword) {
        cacheKey = constant.KEY_TENANT;
        if (hasCache(cacheKey)) {
            return from(getCache(cacheKey));
        }
    }
    return iget(`${constant.API_TENANT_LIST_BY_KEYWORD}?keyWord=${keyword}`).pipe(
        map((data) => {
            const theData = data || [];
            return rmap(
                (item) => ({
                    label: `${item.simpleName}`,
                    value: `${item.id}`,
                }),
                theData,
            );
        }),
        tap((v) => cacheKey && setCache(cacheKey, v)),
    );
}