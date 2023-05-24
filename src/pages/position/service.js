import { ipost, iput, iget, iupload, isearch, idownload, getCache, setCache, constant, idelete, rmap, hasCache } from '@/common/utils';

// 根据职位条件查询用户
export function searchPosition(conditions) {
  return isearch(constant.API_POSITION_SEARCH, conditions);
}
// 删除选中的职位
export function deletePosition(ids) {
  return idelete(constant.API_POSITION, ids);
}
// 保存或更新职位
export function saveOrUpdatePosition(position) {
  return position && position.id
    ? iput(constant.API_POSITION, position)
    : ipost(constant.API_POSITION, position);
}
// 根据ID获取职位
export function getPosition(id) {
  return iget(`${constant.API_POSITION}/${id}`);
}
// 职位启用
export function use(ids) {
  return ipost(constant.API_POSITION_USE, ids);
}
// 职位停用
export function stop(ids) {
  return ipost(constant.API_POSITION_STOP, ids);
}
// 根据组织获取可用的职位列表
export function loadActiveByGroup(gid) {
  return iget(`${constant.API_POSITION_LIST_ACTIVED_BY_GROUP}?groupId=${gid}`);
}
// 根据组织ID获取所有的委托(组织和用户)列表
export function listEntrusByPosition(pid) {
  return iget(`${constant.API_POSITION_LIST_ENTRUSTS}?pid=${pid}`);
}
// 保存职位角色
export function savePositionRoles(positionRole) {
  return ipost(constant.API_POSITION_SAVE_POSITION_ROLES, positionRole);
}
