import { useState, useEffect } from 'react';
import * as R from 'ramda';
import objectAssign from 'object-assign';
import { parse } from 'querystring';
import * as _ from 'lodash';
import produce from 'immer';

import { tap } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import PubSub from 'pubsub-js';

export { PubSub };
import {
  useObservable,
  useObservableCallback,
  useObservableState,
  useSubscription,
  pluckFirst,
  pluckCurrentTargetChecked,
  pluckCurrentTargetValue,
} from 'observable-hooks';

export {
  useObservable,
  useObservableCallback,
  useObservableState,
  useSubscription,
  pluckFirst,
  pluckCurrentTargetChecked,
  pluckCurrentTargetValue,
};

import { isearch, ipost, iput, iget, idelete, iupload, idownload } from './request';

export { isearch, ipost, iput, iget, idelete, iupload, idownload };

import { removeCache, getCache, setCache, hasCache } from './cache';

export { removeCache, getCache, setCache, hasCache };

import api from './service';

export { api };

import constant from './constant';

export { constant };

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    clientWidth: window.innerWidth,
    clientHeight: window.innerHeight,
  });
  useEffect(() => {
    const updateSize = () =>
      setWindowSize({ clientWidth: window.innerWidth, clientHeight: window.innerHeight });
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return windowSize;
};

//==========================================
// const fn = () => {}
// isFunction(fn) //=> true
//==========================================
export const isFunction = (value) => {
  return _.isFunction(value);
};

//==========================================
// const arr = []
// isArray(arr) //=> true
//==========================================
export const isArray = (value) => {
  return _.isArray(value);
};

//==========================================
// has({name: 'alice'},'name')   //=> true
// has({},'name') //=> false
//==========================================
export const has = (obj, prop) => {
  return _.has(obj, prop);
};

//==========================================
// isNil(undefined)   //=> true
// isNil('111') //=> false
//==========================================
export const isNil = (data) => {
  return _.isNil(data);
};

//==========================================
// const App = (props) => {
//   const [onChange, value] = useObservableAutoCallback((event$) =>
//     event$.pipe(pluck("currentTarget", "value"))
//   );
//
//   return <>
//     <input type="text" onChange={onChange} />
//      <span>{value}</span>
//    <>;
// };
//==========================================
// import { useObservableAutoCallback } from './reactor';
// export { useObservableAutoCallback };
export const useObservableAutoCallback = (init, callback) => {
  const [data, setData] = useState();

  const [trggerFn, callbackEvent] = useObservableCallback(init);
  useEffect(() => {
    const sub = callbackEvent.subscribe({ next: (result) => setData(result) });
    sub.add(() => {
      if (callback && isFunction(callback)) {
        callback();
      }
    });
    return () => {
      sub.unsubscribe();
    };
  }, [init]);

  // const subRef = useSubscription(callbackEvent, setData);
  // console.log(subRef);
  // if (callback) {
  //   subRef.current.add(() => {
  //     callback();
  //   });
  // }
  // useEffect(() => {}, []);
  return [trggerFn, data, setData];
};

//==========================================
// const App = (props) => {
//   const [onClick, loading] = useAutoObservableEvent(
//        filter((keys) => !isEmpty(keys)),
//        switchMap((keys) => api.user.activeUser(keys)),
//        );
//
//   return <>
//     <button onClikec={() => onClick(values)} loading={loading} />
//
//    <>;
// };
//==========================================
export const useObservableAutoLoadingEvent = (...operations) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
  const [trggerFn, callbackEvent] = useObservableCallback((event) =>
    event.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => setLoading(true)),
      operations,
    ),
  );
  useEffect(() => {
    const sub = callbackEvent.subscribe({ next: (result) => setData(result) });
    sub.add(() => {
      setLoading(false);
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);
  return [trggerFn, loading, data, setData];
};

//==========================================
// const App = (props) => {
//   const [onClick, loading] = useAutoObservableEvent(
//        filter((keys) => !isEmpty(keys)),
//        switchMap((keys) => api.user.activeUser(keys)),
//        );
//
//   return <>
//     <button onClikec={() => onClick(values)} loading={loading} />
//
//    <>;
// };
//==========================================
export const useAutoObservableEvent = (operators, callback) => {
  const [data, setData] = useState();
  let opArr = operators;
  if (!isArray(operators)) {
    opArr = [doperators];
  }
  const [trggerFn, callbackEvent] = useObservableCallback((event) =>
    event.pipe(debounceTime(300), distinctUntilChanged(), ...opArr),
  );
  useEffect(() => {
    const sub = callbackEvent.subscribe({ next: (result) => setData(result) });
    sub.add(() => {
      if (callback && isFunction(callback)) {
        callback();
      }
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);
  return [trggerFn, data, setData];
};

// export const useAutoObserver = (init, inputs) => {
//   const [data, setData] = useState();
//   const ob$ = useObservable(() => init, inputs);
//   useEffect(() => {
//     const sub = ob$.subscribe({
//       next: (result) => setData(result),
//     });
//     return () => {
//       sub.unsubscribe();
//     };
//   }, [init]);
//   return [data, setData];
// };
//==========================================
// const Comp = (props) => {
//   const [showPanel, setShowPanel] = useState(false)

//   // 监听 props 或 state 变化
//   const [data, setData] = useAutoObservable(
//     inputs$ => inputs$.pipe(map(([isOpen, showPanel]) => isOpen && showPanel)),
//     [props.isOpen, showPanel]
//   )
// }
//==========================================
export const useAutoObservable = (init, inputs) => {
  const [data, setData] = useState();
  const ob = useObservable(init, inputs);
  useSubscription(ob, setData);
  return [data, setData];
};

//==========================================
// const arr = [{name: 'fred', age: 29}, {name: 'wilma', age: 27}]
// pluk('age', arr);  //=> [29, 27]
//==========================================
export const pluck = (p, list) => {
  return R.pluck(p, list);
};

//==========================================
// const arr = [{name: 'fred', age: 29, sex:'male'}, {name: 'wilma', age: 27, sex:'female'}]
// project(['age','name'], arr);  //=> [{name: 'fred', age: 29}, {name: 'wilma', age: 27}]
//==========================================
export const project = (props, list) => {
  return R.project(props, list);
};

//==========================================
// forEach((v)=>{}, array);
//==========================================
export const forEach = (fn, list) => {
  return R.forEach(fn, list);
};

//==========================================
// map((v)=>{}, array); return the new list;
//==========================================
export const rmap = (fn, list) => {
  return R.map(fn, list);
};

//==========================================
// forEachIndex((v, index, array)=>{}, array);
//==========================================
export const forEachIndex = (fn, list) => {
  const mapIndexed = R.addIndex(R.map);
  return mapIndexed(fn, list);
};

//==========================================
// const arr = [1,2,3,4]
// remove(1, -1, arr); //=> [1,2,3]
//==========================================
export const remove = (index, number, list) => {
  return R.remove(index, number, list);
};

//==========================================
// const arr = [1,2,3,4]
// insert(1, [5,6], arr); //=> [1,2,5,6,3,4]
//==========================================
export const insert = (index, arr, list) => {
  return R.insertAll(index, arr, list);
};

//==========================================
// const arr = [1,2,3,4]
// filter((v) => v%2 === 0, arr); //=> [2,4]
//==========================================
export const filter = (fn, list) => {
  return R.filter(fn, list);
};

//==========================================
// const arr = [1,2,3,4]
// reject((v) => v%2 === 0, arr); //=> [1,3]
//==========================================
export const reject = (fn, list) => {
  return R.reject(fn, list);
};

//==========================================
// const arr = [1,2,3,4]
// sort((a,b) => a -b, arr); //=> [1,2,3,4]
//==========================================
export const sort = (fn, list) => {
  return R.sort(fn, list);
};

//==========================================
// const arr = [{name: 'fred', age: 29, sex:'male'}, {name: 'wilma', age: 27, sex:'female'}]
// groupBy((v) => v.sex, arr) //=>{'male':[{name:'fred', age:29, sex:'male'}], 'female':[{name:'wilma', age:27, sex}]}
//==========================================
export const groupBy = (fn, list) => {
  return R.groupBy(fn, list);
};

//==========================================
// const arr = {x: 1, y: 2}
// props(['x', 'y'], arr) //=>[1,2]
//==========================================
export const props = (props, list) => {
  return R.props(props, list);
};

//==========================================
// const arr = {x: 1, y: 2}
// assoc('x', 2, arr) //=> {x: 2, y: 2}
// assoc('z', 2, arr) //=> {x: 1, y: 2, z:2}
//==========================================
export const assoc = (prop, value, obj) => {
  return R.assoc(prop, value, obj);
};

//==========================================
// const arr = {x: 1, y: 2, z:3, a:4}
// pick(['x', 'y'], arr) //=> {x: 2, y: 2}
//==========================================
export const pick = (arr, obj) => {
  return R.pick(arr, obj);
};

//==========================================
// const arr = []
// isEmpty(arr) //=> true
//==========================================
export const isEmpty = (objOrArr) => {
  if (R.isNil(objOrArr)) return true;
  return R.isEmpty(objOrArr);
};

//==========================================
// const arr = {x: 1, y: 2, z:3, a:4}
// keys(arr) //=> [x,y,z,a]
//==========================================
export const keys = (obj) => {
  return R.keys(obj);
};

//==========================================
// const arr = {x: 1, y: 2, z:3, a:4}
// values(arr) //=> [1,2,3,4]
//==========================================
export const values = (obj) => {
  return R.values(obj);
};

//==========================================
// forEachObject((value, key, obj)=>{}, obj);
//==========================================
export const forEachObject = (fn, obj) => {
  return R.forEachObjIndexed(fn, obj);
};

//==========================================
// const obj = {x:1,y:2};
// copyObject(obj, {z:3});
//==========================================
export const copyObject = (target, source) => {
  return objectAssign(target, source);
};

//==========================================
// product((action)=>{state[p] = 1}, state)
//==========================================
export const product = (state, fn) => {
  return produce(state, fn);
};

//==========================================
// split('/usr/local/bin/node','/') => ['usr', 'local', 'bin', 'node']
//==========================================
export const split = (value, s) => {
  const spChar = ',';
  if (s) {
    spChar = s;
  }
  return R.split(spChar, value);
};

//==========================================
// isNumber(10) //=> true
//==========================================
export const isNumber = (val) => {
  let regPos = /^\d+(\.\d+)?$/;
  let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  }
  return false;
};

//==========================================
// padLeftZero(2323) //=> 002323
//==========================================
export const padLeftZero = (str) => {
  return `00${str}`.substr(str.length);
};

//===========================================
//  dateFormat('2022-01-05 14:22:12', 'yyyy-MM-dd') => 2022-01-05
//===========================================
export const dateFormat = (d, fmt) => {
  const theDate = isNumber(d) ? d : new Date(d).getTime();
  let format;
  if (isNumber(theDate)) {
    let date = new Date(theDate);
    if (/(y+)/.test(fmt)) {
      format = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
    };
    // eslint-disable-next-line no-restricted-syntax
    for (let k in o) {
      if (new RegExp(`(${k})`).test(format)) {
        let str = `${o[k]}`;
        format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
      }
    }
  } else {
    format = '';
  }
  return format;
};

//===========================================
//  const cabinStatus = {
//    UNSEND: { color: 'Default', text: '未发送' },
//    FAILURE: { color: 'Error', text: '发送失败' },
//    SENDED: { color: 'Success', text: '已发送' },
//  };
//  state2Option(cabinStatus) =>
//  [{value:UNSEND, label:'未发送'},{value:FAILURE, label:'发送失败'},{value:SENDED, label:'已发送'}]
//===========================================
export const state2Option = (state) => {
  const options = [];
  forEachObject((v, k, obj) => {
    options.push({ value: k, label: v.text });
  }, state);
  return options;
};

//===========================================
//  const cabinOptons =
//  [{value:UNSEND, label:'未发送',color: 'red'},
//   {value:FAILURE, label:'发送失败',color: 'blue'},
//   {value:SENDED, label:'已发送',color: 'green'}]
//  option2States(cabinStatus) =>
//  {
//    UNSEND: { color: 'red', text: '未发送' },
//    FAILURE: { color: 'blue', text: '发送失败' },
//    SENDED: { color: 'green', text: '已发送' },
//  };
//===========================================
export const option2States = (options) => {
  const state = {};
  options &&
    forEach((v) => {
      state[v.value] = { text: v.label, color: v.color };
    }, options);
  return state;
};

//===========================================
// const data = [{id:12343453, name:'经理', age:23},{id:12332453, name:'专员', age:26}]
// data2Option（'id','name',data) => [{label:'经理', value:12343453},{label:'专员',value:12332453}]
//===========================================
export const data2Option = (valueProp, labelProp, data) => {
  const results = [];
  forEach((v) => {
    results.push({ label: v[labelProp], value: v[valueProp] });
  }, data);
  return results;
};

//===========================================
// Get The Query String Of URL
//===========================================
export const getQueryString = (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const search = window.location.search.split('?')[1] || '';
  const r = search.match(reg) || [];
  return r[2];
};

//===========================================
// Get The Query String Of URL
//===========================================
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

//===========================================
// check all the row prop value equals some value
// const students = [{name:'one', sex:'male'},{name:'two',sex:male}]
// beAllRowsPropEqual('sex', 'male', students) => true
//===========================================
export const beAllRowsPropEqual = (prop, value, rows) => {
  const values = pluck(prop, rows);
  let valueSets = [...new Set(values)];
  return valueSets.length == 1 && valueSets[0] === value;
};

//===========================================
// check has any row prop value  not equals a value
// const students = [{name:'one', sex:'male'},{name:'two',sex:male},{name:'three',sex:'female'}]
// beHasRowsPropNotEqual('sex', 'male', students) => true
//===========================================
export const beHasRowsPropNotEqual = (prop, value, rows) => {
  const values = pluck(prop, rows);
  let valueSets = [...new Set(values)];
  return valueSets.length > 1 || valueSets[0] !== value;
};
