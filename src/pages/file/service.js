import { ipost, iput, iget, isearch, idelete, constant } from '@/common/utils';

//搜索图片
export function searchPicture(conditions) {
  return isearch(constant.API_FILE_PICTURE_SEARCH, conditions);
}
//重命名图片
export function renamePicture(picture) {
    return ipost(constant.API_FILE_PICTURE_RENAME, picture);
}
//删除图片
export function deletePicture(ids) {
    return ipost(constant.API_FILE_PICTURE_DELETE, ids);
}

export function getPicture(id) {
    return iget(`${constant.API_FILE_PICTURE_GET}/${id}`);
}