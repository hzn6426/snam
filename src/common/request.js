import {
  wrapObservable,
  wrapStreamObservable,
  wpost,
  wget,
  wdelete,
  wput,
  wfileUpload,
  wfileDownload,
  wrapSearchObservable,
} from './iaxios';

export const isearch = (url, condition) => {
  return wrapSearchObservable(wpost, url, condition);
};

export const ipost = (url, param) => {
  return wrapObservable(wpost, url, param);
};

export const iget = (url, param) => {
  return wrapObservable(wget, url, param);
};

export const idelete = (url, param) => {
  return wrapObservable(wdelete, url, param);
};

export const iput = (url, param) => {
  return wrapObservable(wput, url, param);
};

export const iupload = (url, param) => {
  return wrapStreamObservable(wfileUpload, url, param);
};

export const idownload = (url, param, post = false) => {
  return wrapStreamObservable(wfileDownload, url, param, post);
};
