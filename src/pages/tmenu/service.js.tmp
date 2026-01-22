import { ipost, iput, iget, isearch, idelete, constant } from '@/common/utils';

// 以树的方式获取菜单列表
export function treeAllMenus() {
    return iget(constant.API_TMENU_TREE_ALL);
}

export function searchButtonsAndApiByMenu(conditions) {
    return isearch(constant.API_TMENU_SEARCH_BUTTON_AND_API_BY_MENU, conditions);
}

export function saveOrUpdateMenu(menu) {
    return ipost(constant.API_TMENU_SAVE_OR_UPDATE, menu);
}

export function deleteMenu(ids) {
    return idelete(constant.API_TMENU, ids);
}

export function saveOrUpdateButton(button) {
    return ipost(constant.API_TBUTTON_SAVE_OR_UPDATE, button);
}

export function deleteButton(ids) {
    return idelete(constant.API_TBUTTON, ids);
}

export function listBttonsByKeyWord(keyword) {
    return iget(constant.API_TBUTTON_LIST_BY_KEYWORDS + '?keyWord=' + keyword);
}

export  function getButtonAndApiById(id) {
    return iget(constant.API_TBUTTON_GET_BUTTON_AND_API_BY_ID + '?id=' + id);
}