import {constant, idelete, iget, ipost, isearch} from '@/common/utils';

//资源查询
export function searchTreeAllResource(menuId, resourceType) {
    return iget(`${constant.API_BUSINESS_RESOURCE_TREE_ALL}?menuId=${menuId}&resourceType=${resourceType}`);
}

//资源 保存 更新
export function saveOrUpdateResource(conditions) {
    return ipost(constant.API_BUSINESS_RESOURCE_SAVE_OR_UPDATE, conditions);
}

//菜单 刪除
export function deleteResource(ids) {
    return idelete(constant.API_BUSINESS_RESOURCE_DELETE, ids);
}

// 按钮查询
export function searchButtonsAndApiByMenu(conditions) {
    return isearch(constant.API_BUSINESS_BUTTON_SEARCH_BUTTONS_AND_API_BY_RESOURCE, conditions);
}

//按钮 保存 更新
export function saveOrUpdateButton(conditions) {
    return ipost(constant.API_BUSINESS_BUTTON_SAVE_OR_UPDATE, conditions);
}

// 按钮 删除
export function deleteButton(ids) {
    return idelete(constant.API_BUSINESS_BUTTON_DELETE, ids);
}

//根据按钮ID获取按钮信息
export function getButtonAndApiById(id) {
    return iget(constant.API_BUSINESS_BUTTON_GET_BUTTON_AND_API_BY_ID + '?id=' + id);
}