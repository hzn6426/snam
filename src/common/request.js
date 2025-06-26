import {
  wdelete,
  wfileDownload,
  wfileUpload,
  wget,
  wpost,
  wpostByToken,
  wpostWithheaders,
  wput,
  wrapObservable,
  wrapSearchObservable,
  wrapStreamObservable,
} from './iaxios';

export const isearch = (url, condition) => {
  return wrapSearchObservable(wpost, url, condition);
};

export const isearchByToken = (token, url, condition) => {
  return wrapSearchObservable(wpostByToken, token, url, condition);
};

export const ilogin = (url, param, headers) => {
  return wrapObservable(wpostWithheaders, url, param, headers);
}

export const ipost = (url, param) => {
  return wrapObservable(wpost, url, param || null);
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

export const idownload = (url, param, post = true) => {
  return wrapStreamObservable(wfileDownload, url, param, post);
};
