import router from './router';
import { forEach } from '@/common/utils';

const routeCache = {};
forEach((v) => {
  if (v.path) {
    routeCache[v.path] = v.name;
  }
  if (v.routes) {
    forEach((inner) => {
      if (inner.path) {
        routeCache[inner.path] = inner.name;
      }
      if (inner.routes) {
        forEach((deepInner) => {
          if (deepInner.path) {
            routeCache[deepInner.path] = deepInner.name;
          }
        }, inner.routes);
      }
    }, v.routes);
  }
}, router[0].routes[2].routes);
export default routeCache;
