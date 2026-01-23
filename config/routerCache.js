import router from './router';
import { forEach } from '@/common/utils';

const routeCache = {};
forEach((v) => {
  if (v.path) {
    routeCache[v.path] = {name:v.name,component:v.component};
  }
  if (v.routes) {
    forEach((inner) => {
      if (inner.path) {
        routeCache[inner.path] = {name:inner.name, component:inner.component};
      }
      if (inner.routes) {
        forEach((deepInner) => {
          if (deepInner.path) {
            routeCache[deepInner.path] = {name:deepInner.name,component:deepInner.component};
          }
        }, inner.routes);
      }
    }, v.routes);
  }
}, router[2].routes);
export default routeCache;
