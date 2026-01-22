import { iget, constant, getCache, setCache, hasCache } from '@/common/utils';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

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
