import { Modal } from 'antd';
import { isFunction } from './utils';

export const showDeleteConfirm = (title, onOk, onCancel) => {
  Modal.confirm({
    title: title,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      if (onOk && isFunction(onOk)) {
        onOk();
      }
    },
    onCancel() {
      if (onCancel && isFunction(onCancel)) {
        onCancel();
      }
    },
  });
};


export const showOperationConfirm = (title, onOk, onCancel) => {
  Modal.confirm({
    title: title,
    okText: '确认',
    okType: 'danger',
    cancelText: '取消',
    onOk() {
      if (onOk && isFunction(onOk)) {
        onOk();
      }
    },
    onCancel() {
      if (onCancel && isFunction(onCancel)) {
        onCancel();
      }
    },
  });
};
