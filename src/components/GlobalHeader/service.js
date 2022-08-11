import { wpost,wput, warpParam, wget} from '@/utils/request';
import URL from '@/constant/url';

export async function search(conditions) {
  return wpost(URL.API_MESSAGE_SEARCH, conditions);
}
export async function searchPage(conditions) {
  return wpost(URL.API_MESSAGE_SEARCH, warpParam(conditions));
}
export async function countUnRead() {
  return wget(URL.API_MESSAGE_UNREAD_COUNT);
}

export async function readMessage(record) {
  return wput(URL.API_MESSAGE_READ_MESSAGE,record);
}

export async function unReadList(){
  return wget(URL.API_MESSAGE_UN_READ);
}

export async function readTypeAllMessage(){
  return wget(URL.API_MESSAGE_READ_TYPE_ALL);
}