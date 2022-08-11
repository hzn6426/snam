import { iget, constant } from '@/common/utils';
//获取所有角色----需要权限
export function listAll() {
  return iget(constant.API_ROLE_LIST_ALL);
}
