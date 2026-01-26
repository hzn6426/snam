import { iget, constant, getCache, setCache, hasCache, isArray, rmap } from '@/common/utils';
import { map, tap } from 'rxjs/operators';
import { from } from 'rxjs';

// 包装模糊匹配
export function listByKeyword(tag, keyword) {
  let cacheKey;
  if (!keyword) {
    cacheKey = constant.KEY_USER + tag;
    if (hasCache(cacheKey)) {
      return from(getCache(cacheKey));
    }
  }
  return iget(`${constant.API_USER_LIST_BY_KEYWORD}?userTag=${tag}&keyWord=${keyword}`).pipe(
    map((data) => {
      const theData = data || [];
      return rmap(
        (item) => ({
          label: `${item.userRealCnName}`,
          value: `${item.id}`,
        }),
        theData,
      );
    }),
    tap((v) => cacheKey && setCache(cacheKey, v)),
  );
}
