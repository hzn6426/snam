import { iget, constant, getCache, setCache, hasCache, isArray, rmap } from '@/common/utils';
import { map, tap } from 'rxjs/operators';
import { from } from 'rxjs';

// 港口模糊匹配
export function listByKeyword(keyword) {
  let cacheKey;
  if (!keyword) {
    cacheKey = constant.KEY_PORT;
    if (hasCache(cacheKey)) {
      return from(getCache(cacheKey));
    }
  }
  return iget(`${constant.API_PORT_LIST_BY_KEYWORD}?keyword=${keyword}`).pipe(
    map((data) => {
      const theData = data || [];
      return rmap(
        (item) => ({
          label: `${item.enName}|${item.countryName}`,
          value: `${item.ediCode}`,
          item: item,
        }),
        theData,
      );
    }),
    tap((v) => cacheKey && setCache(cacheKey, v)),
  );
}
