import {constant, idelete, iget, ipost, isearch} from '@/common/utils';

//菜单查询
export function searchTreeAllMenu() {
    return iget(constant.API_MENU_TREE_ALL);
}

//菜单 保存 更新
export function saveOrUpdateMenu(conditions) {
    return ipost(constant.API_MENU_SAVE_OR_UPDATE, conditions);
}

//菜单 刪除
export function deleteMenu(ids) {
    return idelete(constant.API_MENU_DELETE, ids);
}

// 按钮查询
export function searchButtonsAndApiByMenu(conditions) {
    return isearch(constant.API_SEARCH_BUTTON_AND_API_BY_MENU, conditions);
}

//按钮 保存 更新
export function saveOrUpdateButton(conditions) {
    return ipost(constant.API_BUTTON_SAVE_OR_UPDATE, conditions);
}

// 按钮 删除
export function deleteButton(ids) {
    return idelete(constant.API_BUTTON_DELETE, ids);
}

// id
export function getButton(sid) {
    return iget(`${constant.API_BUTTON_GETBUTTON}/${sid}`);
}

// 关键字查询按钮
export function listButtonsByKeyWord(keyword) {
    return iget(constant.API_BUTTON_LIST_BY_KEYWORD + '?keyWord=' + keyword);
}

//根据按钮ID获取按钮信息
export function getButtonAndApiById(id) {
    return iget(constant.API_BUTTON_GET_BUTTON_AND_API_BY_ID + '?id=' + id);
}