import { ipost, iput, iget, isearch, idelete, constant } from '@/common/utils';

//条件查询Action
export function searchAction(conditions) {
  return isearch(constant.API_ACTION_SEARCH, conditions);
}
//ID获取Action
export function getAction(id) {
  return iget(`${constant.API_ACTION}/${id}`);
}
//保存或更新Action
export function saveOrUpdateAction(action) {
  return action && action.id ? iput(constant.API_ACTION, action) : ipost(constant.API_ACTION, action);
}
//删除Action
export function deleteAction(ids) {
  return idelete(constant.API_ACTION, ids);
}
//激活Action
export function activeAction(ids) {
  return ipost(constant.API_ACTION_USE, ids);
}
//停用Action
export function stopAction(ids) {
  return ipost(constant.API_ACTION_STOP, ids);
}

//刷新缓存
export function refreshCache(ids) {
  return ipost(constant.API_ACTION_REFRESH_CACHE, ids);
}