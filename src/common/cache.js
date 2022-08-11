import lscache from 'lscache';

// export const setCache = (key, value, expire = false, callbacks = false) => {
//   let iexpire = expire;
//   if (expire && typeof expire === 'number') {
//     iexpire = Math.round(expire * 1000 + Date.now());
//   }
//   return fromPromise(localforage.setItem(key, { value, iexpire }, iexpire && callbacks));
// };
export const setCache = (key, value, expireInMinutes) => {
  let iexpire = expireInMinutes || Math.round(10 * 100);
  lscache.set(key, value, iexpire);
};

export const getCache = (key) => {
  return key && lscache.get(key);
};

// export const getCache = async (key) => {
//   const data = await localforage.getItem(key);
//   if (!data) {
//     return data;
//   }
//   const { expire, value } = data;
//   if (expire && expire < Date.now()) {
//     localforage.removeItem(key);
//     return null;
//   }
//   return value;
// };

export const hasCache = (key) => {
  return !!getCache(key);
};

// export const hasCache = async (key) => {
//   const data = await localforage.getItem(key);
//   return !!data;
// };

// export const removeCache = (key, value, callbacks) => {
//   return localforage.removeItem(key, value, callbacks);
// };

export const removeCache = (key) => {
  lscache.remove(key);
};

// export const clearAll = (callbacks) => {
//   return localforage.clear(callbacks);
// };

// export const loopCache = (iteratorCallback, successCallback) => {
//   return localforage.iterate(iteratorCallback, successCallback);
// };

//export default { loopCache, clearAll, removeCache, getCache, setCache, hasCache };
