import * as _ from 'lodash';
import objectAssign from 'object-assign';
import { parse } from 'querystring';
import * as R from 'ramda';
import { ref, onMounted, onUnmounted } from 'vue';
import stringRandom from 'string-random';
import md5 from 'js-md5';
import { tap } from 'rxjs';
import PubSub from 'pubsub-js';
import dayjs from 'dayjs';
import { idelete, idownload, iget, ilogin, ipost, iput, isearch, isearchByToken, iupload } from './request';
import { getCache, hasCache, removeCache, setCache } from './cache';
import api from './service';
import constant from './constant';

// Vue 3 composable for window size
export const useWindowSize = () => {
  const windowSize = ref({
    clientWidth: window.innerWidth,
    clientHeight: window.innerHeight,
  });

  const updateSize = () => {
    windowSize.value = {
      clientWidth: window.innerWidth,
      clientHeight: window.innerHeight,
    };
  };

  onMounted(() => {
    window.addEventListener('resize', updateSize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize);
  });

  return windowSize;
};

export const debounce = (fun, wait, options) => {
  return _.debounce(fun, wait, options);
};

export const isFunction = (value) => {
  return _.isFunction(value);
};

export const isArray = (value) => {
  return _.isArray(value);
};

export const has = (obj, prop) => {
  return _.has(obj, prop);
};

export const isNil = (data) => {
  return _.isNil(data);
};

export const cloneDeep = (data) => {
  return _.cloneDeep(data);
};

export const pluck = (p, list) => {
  return R.pluck(p, list);
};

export const project = (props, list) => {
  return R.project(props, list);
};

export const includes = (item, list) => {
  return R.includes(item, list);
};

export const forEach = (fn, list) => {
  return R.forEach(fn, list);
};

export const rmap = (fn, list) => {
  return R.map(fn, list);
};

export const forEachIndex = (fn, list) => {
  const mapIndexed = R.addIndex(R.map);
  return mapIndexed(fn, list);
};

export const remove = (index, number, list) => {
  return R.remove(index, number, list);
};

export const insert = (index, arr, list) => {
  return R.insertAll(index, arr, list);
};

export const filter = (fn, list) => {
  return R.filter(fn, list);
};

export const reject = (fn, list) => {
  return R.reject(fn, list);
};

export const sort = (fn, list) => {
  return R.sort(fn, list);
};

export const groupBy = (fn, list) => {
  return R.groupBy(fn, list);
};

export const props = (props, list) => {
  return R.props(props, list);
};

export const invert = (obj) => {
  return _.invert(obj);
};

export const assoc = (prop, value, obj) => {
  return R.assoc(prop, value, obj);
};

export const pick = (arr, obj) => {
  return R.pick(arr, obj);
};

export const isEmpty = (objOrArr) => {
  if (R.isNil(objOrArr)) return true;
  return R.isEmpty(objOrArr);
};

export const contains = (item, array) => {
  return array.includes(item);
};

export const join = (x, arr) => {
  return R.join(x, arr);
};

export const keys = (obj) => {
  return R.keys(obj);
};

export const values = (obj) => {
  return R.values(obj);
};

export const forEachObject = (fn, obj) => {
  return R.forEachObjIndexed(fn, obj);
};

export const mapObjIndexed = (fn, obj) => {
  return R.mapObjIndexed(fn, obj);
};

export const copyObject = (target, source, source2) => {
  if (source2) {
    return objectAssign(target, source, source2);
  }
  return objectAssign(target, source);
};

export const startsWith = (x, list) => {
  return R.startsWith(x, list);
};

export const split = (value, s) => {
  let spChar = ',';
  if (s) {
    spChar = s;
  }
  return R.split(spChar, value);
};

export const isNumber = (val) => {
  let regPos = /^\d+(\.\d+)?$/;
  let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  }
  return false;
};

export const padLeftZero = (str) => {
  return `00${str}`.substr(str.length);
};

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

export const state2Option = (state) => {
  const options = [];
  forEachObject((v, k, obj) => {
    options.push({ value: k, label: v.text });
  }, state);
  return options;
};

export const option2States = (options) => {
  const state = {};
  options &&
    forEach((v) => {
      state[v.value] = { text: v.label, color: v.color || 'default' };
    }, options);
  return state;
};

export const data2States = (valueProp, labelProp, options) => {
  const state = {};
  options &&
    forEach((v) => {
      state[v[valueProp]] = { text: v[labelProp], color: v.color || 'default' };
    }, options);
  return state;
};

export const option2TextObject = (options) => {
  const state = {};
  options &&
    forEach((v) => {
      state[v.value] = v.label;
    }, options);
  return state;
};

export const data2TextObject = (keyProp, valueProp, data) => {
  const state = {};
  forEach((v) => {
    state[v[keyProp]] = v[valueProp];
  }, data);
  return state;
};

export const data2Option = (valueProp, labelProp, data) => {
  const results = [];
  forEach((v) => {
    results.push({ label: v[labelProp], value: v[valueProp] });
  }, data);
  return results;
};

export const getQueryString = (name) => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const search = window.location.search.split('?')[1] || '';
  const r = search.match(reg) || [];
  return r[2];
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const beAllRowsPropEqual = (prop, value, rows) => {
  const values = pluck(prop, rows);
  let valueSets = [...new Set(values)];
  return valueSets.length == 1 && valueSets[0] === value;
};

export const beHasRowsPropNotEqual = (prop, value, rows) => {
  const values = pluck(prop, rows);
  let valueSets = [...new Set(values)];
  return valueSets.length > 1 || valueSets[0] !== value;
};

const sWidth = window.screen.width;
const sHeight = window.screen.height;

export const INewWindow = (props) => {
  const { url, title, width, height, callback, callparam, features } = props;
  const iwidth = width || sWidth;
  const iheight = height || sHeight;

  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

  const uwidth = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  const uheight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  const systemZoom = uwidth / window.screen.availWidth;
  const ileft = (uwidth - iwidth) / 2 / systemZoom + dualScreenLeft;
  const itop = (uheight - iheight) / 2 / systemZoom + dualScreenTop;
  let browser = window.self;

  browser.onSuccess = (message) => {
    if (callback && _.isFunction(callback)) {
      callback(message);
    }
  };

  browser.onGetParams = () => {
    if (callparam && _.isFunction(callparam)) {
      return callparam();
    }
  };

  browser.onError = (error) => {
    if (callback && _.isFunction(callback)) {
      callback(error);
    }
  };

  browser.onOpen = (message) => {
    if (callback && _.isFunction(callback)) {
      callback(message);
    }
  };

  browser.onClose = (message) => {
    if (callback && _.isFunction(callback)) {
      callback(message);
    }
  };

  const opts = features || ('location=no,menubar=no,toolbar=no,resizable=no,status=no,width=' + (iwidth) + ',  height=' + (iheight) + ',top=' + itop + ',left=' + ileft);

  let settings = localStorage.getItem("settings");
  if (settings) {
    browser.localStorage.setItem("settings", settings);
  }
  
  const getPageQueryFn = () => parse(url.split('?')[1]);
  window.getPageQuery = getPageQueryFn;
  var popup = browser.open(url, title, opts);

  setTimeout(function () { popup.document.title = title }, 1000);
};

export const formatNumber = (v, fixNum) => {
  if (!v) {
    return '';
  }
  if (fixNum === '0') {
    return v;
  }
  let suffix = '';
  switch (fixNum) {
    case 1:
      suffix = '0.0';
      break;
    case 2:
      suffix = '0.00';
      break;
    case 3:
      suffix = '0.000';
      break;
    case 4:
      suffix = '0.0000';
      break;
    default:
      suffix = '';
  }
  return v ? toFixed(v, fixNum) : suffix;
};

export const timeFormat = (d, str) => {
  let date = new Date(d),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    minute = date.getMinutes(),
    second = date.getSeconds();

  month >= 1 && month <= 9 ? (month = "0" + month) : "";
  day >= 0 && day <= 9 ? (day = "0" + day) : "";
  hour >= 0 && hour <= 9 ? hour : "";
  minute >= 0 && minute <= 9 ? (minute = "0" + minute) : "";
  second >= 0 && second <= 9 ? (second = "0" + second) : "";

  if (str.indexOf('y') != -1) {
    str = str.replace('y', year);
  }
  if (str.indexOf('m') != -1) {
    str = str.replace('m', month);
  }
  if (str.indexOf('d') != -1) {
    str = str.replace('d', day);
  }
  if (str.indexOf('h') != -1) {
    str = str.replace('h', hour);
  }
  if (str.indexOf('i') != -1) {
    str = str.replace('i', minute);
  }
  if (str.indexOf('s') != -1) {
    str = str.replace('s', second);
  }
  return str;
};

function toFixed(n, d) {
  var s = n + "";
  if (!d) d = 0;
  if (s.indexOf(".") == -1) s += ".";
  s += new Array(d + 1).join("0");
  if (new RegExp("^(-|\\+)?(\\d+(\\.\\d{0," + (d + 1) + "})?)\\d*$").test(s)) {
    var s = "0" + RegExp.$2, pm = RegExp.$1, a = RegExp.$3.length, b = true;
    if (a == d + 2) {
      a = s.match(/\d/g);
      if (parseInt(a[a.length - 1]) > 4) {
        for (var i = a.length - 2; i >= 0; i--) {
          a[i] = parseInt(a[i]) + 1;
          if (a[i] == 10) {
            a[i] = 0;
            b = i != 1;
          } else break;
        }
      }
      s = a.join("").replace(new RegExp("(\\d+)(\\d{" + d + "})\\d$"), "$1.$2");
    }
    if (b) s = s.substr(1);
    return (pm + s).replace(/\.$/, "");
  }
  return this + "";
}

export {
  api,
  constant,
  getCache,
  hasCache,
  idelete,
  idownload,
  iget,
  ilogin,
  ipost,
  iput,
  isearch,
  isearchByToken,
  iupload,
  md5,
  dayjs as moment,
  PubSub,
  removeCache,
  setCache,
  stringRandom,
  tap,
};

