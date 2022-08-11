import axios from 'axios';
import { message, notification } from 'antd';
import { constant, has, isNil, forEach } from '@/common/utils';
import objectAssign from 'object-assign';
import { defer, from, lastValueFrom } from 'rxjs';
import { filter, map } from 'rxjs/operators';

// 创建 axios 实例
const service = axios.create({
  timeout: 60000,
  withCredentials: true,
});

const err = (error) => {
  const { response } = error;
  const data = response?.data || response?.result;
  if (response) {
    const errorText = data.message || response.statusText;
    const { status } = response;
    if (data && data.code !== 200) {
      if (
        data.code === 20002 ||
        data.code === 20003 ||
        data.code === 20006 ||
        data.code === 20004 ||
        data.code === 403 ||
        data.code === 503
      ) {
        notification.error({
          message: `请求错误 ${status}: ${response.config.url}`,
          description: errorText,
        });
        // if (data.code !== 403) {
        //   setTimeout(() => {
        //     window.location.href = constant.ROUTE_LOGIN
        //   }, 3000)
        // }
        // return data
      } else {
        message.error(data.message);
      }
      // console.log(data)
      //message.error(errorText)
      // TODO

      return data;
    }
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

// request interceptor
service.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(constant.KEY_USER_TOKEN);
  const beLogin = config.url === constant.API_LOGIN;
  // eslint-disable-next-line max-len
  if ((token === null || token.length === 0) && !beLogin) {
    window.location.href = constant.ROUTE_LOGIN;
    return config;
  }
  if (token) {
    objectAssign(config.headers, { Authorization: `${token}` });
  }
  return config;
}, err);

// response interceptor
service.interceptors.response.use((response) => {
  const res = response.data;
  if (res.code && res.code !== 200) {
    return Promise.reject(response);
  }
  return res;
}, err);

export const warpParam = (param) => {
  const target = {};
  const dto = {};
  const props = Object.keys(param);
  if (props.length === 0) return target;
  props.forEach((p) => {
    if (
      p !== 'current' &&
      p !== 'pageSize' &&
      p !== 'sorter' &&
      p !== 'filter' &&
      p !== 'ascs' &&
      p !== 'descs'
    ) {
      dto[p] = param[p];
    } else if (p === 'current') {
      target.pageNo = param[p];
    } else {
      target[p] = param[p];
    }
  });
  target.dto = dto;
  return target;
};
/**
 * 将后台的返回信息封装成表格所需的格式
 * @param {*} response 后台返回数据
 * @returns
 */
export const wrapResult = (response) => {
  const { data, totalCount } = response;
  return Promise.resolve({
    data,
    success: true,
    total: totalCount,
  });
};

/**
 * 封装post请求方法
 * @param {*} purl 请求Url
 * @param {*} param 请求参数
 * @returns
 */
export async function wpost(purl, param) {
  return service.post(purl, param, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 * 封装get请求方法
 * @param {*} purl 请求Url
 * @returns
 */
export async function wget(purl) {
  return service.get(purl, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: null,
  });
}
/**
 * 封装put请求方法
 * @param {*} purl 请求Url
 * @param {*} param  请求参数
 * @returns
 */
export async function wput(purl, param) {
  return service.put(purl, param, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
  });
}
/**
 * 封装delete请求方法
 * @param {*} purl 请求Url
 * @param {*} param 请求参数
 * @returns
 */
export async function wdelete(purl, param) {
  return service.delete(purl, {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data: param,
  });
}

/**
 * 文件上传方法
 * @param {*} formData
 * @returns
 */
export async function wfileUpload(purl, formData) {
  return service.post(purl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function wfileDownload(purl, formData = false, post = false) {
  const data = {
    headers: {
      'Content-Type': 'application/json; application/octet-stream;charset=UTF-8',
    },
    responseType: 'blob',
    data: null,
  };

  return post ? service.post(purl, formData, data) : service.get(purl, data);
}

/**
 * rxjs封装Promise(后台请求)方法为可观察者，结果为下载文件流
 * @param {*} promise
 * @param  {...any} args
 * @returns
 */
export const wrapStreamObservable = (promise, ...args) => {
  return defer(() => from(promise(...args)).pipe(map((resp) => resp)));
};
/**
 * rxjs封装Promise(后台请求)方法为可观察者，过滤结果为数组数据
 * @param promise 后台请求
 * @param args 可变参数
 * @returns
 */

export const wrapObservable = (promise, ...args) => {
  return defer(() =>
    from(promise(...args)).pipe(
      filter((resp) => has(resp, 'code') && has(resp, 'data') && resp.code === 200),
      map((resp) => resp.data),
    ),
  );
};

/**
 * rxjs封装Promise(后台请求)方法为可观察者，过滤结果为单个对象
 * @param {*} promise 后台请求
 * @param {*} args 后台请求参数
 * @returns
 */
export const wrapSObservable = (promise, ...args) => {
  return defer(() =>
    from(promise(...args)).pipe(
      filter(
        (resp) =>
          has(resp, 'code') && has(resp, 'data') && resp.code === 200 && !isNil(resp.data[0]),
      ),
      map((resp) => resp.data[0]),
    ),
  );
};

/**
 * 封装查询observable
 * <br>例如：
 * new Promise((resolve, reject) => {
      wrapSearchObservable(api.customer.searchCustomer, {
        ...params,
        sorter,
        filter,
      }).subscribe({
        next: (data) => resolve(data),
        error: (err) => reject(err),
      });
    })
 *
 * @param {*} promise 后台请求
 * @param {*} args 后台请求参数
 * @returns
 */
export const wrapSearchObservable = (promise, ...args) => {
  return defer(() =>
    from(promise(...args)).pipe(
      filter((resp) => has(resp, 'code') && has(resp, 'data') && resp.code === 200),
      map((response) => {
        const { data, totalCount } = response;
        return {
          data,
          success: true,
          total: totalCount,
        };
      }),
    ),
  );
};

/**
 * 经过observable封装后返回的Promise,用于表格分页的request中
 * @param {*} promise 后台请求
 * @param {*} args 后台请求参数
 * @returns {Promise}
 */
export async function wrapSearchPromise(promise, ...args) {
  return lastValueFrom(wrapSearchObservable(promise, ...args));
}

/**
 * 封装后台请求后供label,value格式的下拉用的observable
 * @param {*} labelProp 映射成label的属性名称
 * @param {*} valueProp 映射成value的属性名称
 * @param {*} promise 后台请求
 * @param {*} args 后台请求参数
 * @returns
 */
export const wrapSelectObservable = (labelProp, valueProp, promise, ...args) => {
  return defer(() =>
    from(promise(...args)).pipe(
      filter((resp) => has(resp, 'code') && has(resp, 'data') && resp.code === 200),
      map((response) => {
        const { data } = response;
        const results = [];
        forEach((v) => {
          results.push({ label: v[labelProp], value: v[valueProp] });
        })(data);
        return results;
      }),
    ),
  );
};

/**
 * 经过observable封装后返回的Promise,用于基于Label,value格式的request中
 * @param {*} labelProp 映射成label的属性名称
 * @param {*} valueProp 映射成value的属性名称
 * @param {*} promise 后台请求
 * @param {*} args 后台请求参数
 * @returns
 */
export async function wrapSelectPromise(labelProp, valueProp, promise, ...args) {
  return lastValueFrom(wrapSelectObservable(labelProp, valueProp, promise, ...args));
}
