import { ipost, iput, iget, iupload, isearch, idelete, constant, getCache, setCache, hasCache } from '@/common/utils';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
//查询字典
export function searchDictionary(conditions) {
    return isearch(constant.API_DICT_SEARCH, conditions);
}

//保存字典
export function saveOrUpdateDictionary(dictionary) {
    return dictionary && dictionary.id ? iput(constant.API_DICT, dictionary) : ipost(constant.API_DICT, dictionary);
}

//删除字典
export function deleteDictionary(ids) {
    return idelete(constant.API_DICT, ids);
}

//获取字典
export function getDictionary(id) {
    return iget(`${constant.API_DICT}/${id}`);
}

//字典启用
export function useDictionary(ids) {
    return ipost(constant.API_DICT_USE, ids);
}

//字典停用
export function stopDictionary(ids) {
    return ipost(constant.API_DICT_STOP, ids);
}

//查询子字典
export function searchChildDictionary(conditions) {
    return isearch(constant.API_DICT_CHILD_SEARCH, conditions);
}

//子字典保存
export function saveOrUpdateChildDictionary(dictionary) {
    return dictionary && dictionary.id ? iput(constant.API_DICT_CHILD, dictionary) : ipost(constant.API_DICT_CHILD, dictionary);
}

//删除子字典
export function deleteChildDictionary(ids) {
    return idelete(constant.API_DICT_CHILD, ids);
}

//获取字典子项
export function getChildDictionary(id) {
    return iget(`${constant.API_DICT_CHILD}/${id}`);
}

//子字典启用
export function useChildDictionary(ids) {
    return ipost(constant.API_DICT_CHILD_USE, ids);
}

//子字典停用
export function stopChildDictionary(ids) {
    return ipost(constant.API_DICT_CHILD_STOP, ids);
}


/**
 * 根据字典父编码获取字典子项列表
 * @param {*} parentCode 字典父编码
 * @returns
 */
export function listChildByParentCode(parentCode) {
    let cacheKey;
    let pcode = parentCode || '';
    if (pcode) {
        cacheKey = constant.KEY_DICT + pcode;
        if (hasCache(cacheKey)) {
            const v = getCache(cacheKey);
            return of(v);
        }
    }

    return iget(`${constant.API_DICT_CHILD_LIST}?pcode=${pcode}`).pipe(
        tap((v) => cacheKey && setCache(cacheKey, v)),
    );
}

