import { ipost, constant, getCache, setCache, hasCache, isArray, rmap } from '@/common/utils';
import { map, tap } from 'rxjs/operators';
import { from } from 'rxjs';

// 客户模糊匹配
export function listByKeyword(ctmType, keyword) {
  const param = { ctmTypes: ctmType, keyWord: keyword };
  let cacheKey;
  if (!keyword) {
    const cacheCtmType = ctmType ? (isArray(ctmType) ? ctmType.join('|') : ctmType) : '';
    cacheKey = constant.KEY_CUSTOMER + cacheCtmType;
    if (hasCache(cacheKey)) {
      return from(getCache(cacheKey));
    }
  }
  return ipost(constant.API_CUSTOMER_LIST_BY_KEYWORD, param).pipe(
    map((data) => {
      return rmap(
        (item) => ({
          label: `${item.shortName}`,
          value: `${item.id}`,
          item: item,
        }),
        data,
      );
    }),
    tap((v) => cacheKey && setCache(cacheKey, v)),
  );
}
