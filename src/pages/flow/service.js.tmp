import { ipost, iput, iget, isearch, constant,iupload } from '@/common/utils';
//查询流程列表
export function searchFlow(conditions) {
    return isearch(constant.API_FLOW_SEARCH, conditions);
}

//查询实例列表
export function searchInstance(conditions) {
    return isearch(constant.API_FLOW_INSTANCE_SEARCH, conditions);
}
//开始流程
export function startFlow(param) {
    return ipost(constant.API_FLOW_START, param);
}
//执行流程
export function executeFlow(param) {
    return iupload(constant.API_FLOW_EXECUTE, param);
}
//驳回流程
export function rejectFlow(param) {
    return iupload(constant.API_FLOW_REJECT, param);
}
//获取实例流程图
export function getInstanceChart(id) {
    return iget(`${constant.API_FLOW_GET_INSTANCE_CHART}?id=${id}`);
}
//正在执行的任务
export function getRunningTask(id) {
    return iget(`${constant.API_FLOW_TASK_RUNNING}?instanceId=${id}`);
}
//获取流程图
export function getFlowChart(id) {
  return iget(`${constant.API_FLOW_CHART}?id=${id}`);
}

