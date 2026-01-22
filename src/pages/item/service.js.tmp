import { constant, getCache, hasCache, idelete, iget, ipost, iput, isearch, rmap, setCache } from '@/common/utils';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
//条件查询
export function searchItem(conditions) {
    return isearch(constant.API_ITEM_SEARCH, conditions);
}

//保存或更新
export function saveOrUpdateItem(item) {
    return item && item.id ? iput(constant.API_ITEM, item) : ipost(constant.API_ITEM, item);
}

//获取明细
export function getItem(id) {
    return iget(`${constant.API_ITEM}/${id}`);
}

//删除供应商
export function deleteItem(ids) {
    return idelete(constant.API_ITEM, ids);
}

// 模糊匹配
export function listByKeyword(keyword) {
    let cacheKey;
    if (!keyword) {
        cacheKey = constant.KEY_ITEM;
        if (hasCache(cacheKey)) {
            return of(getCache(cacheKey));
        }
    }
    return iget(`${constant.API_ITEM_LIST_BY_KEY_WORD}?keyWord=${keyword}`).pipe(
        map((data) => {
            const theData = data || [];
            return rmap(
                (item) => ({
                    label: `${item.name}`,
                    value: `${item.id}`,
                }),
                theData,
            );
        }),
        tap((v) => cacheKey && setCache(cacheKey, v)),
    );
}