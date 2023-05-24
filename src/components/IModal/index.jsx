import React, { useEffect, useState, useRef, useImperativeHandle } from 'react';
import { Button, Form, Modal, Space } from 'antd';
import Draggable from 'react-draggable';
import { useWindowSize } from '@/common/utils';

export default (props) => {
  const draggleRef = useRef();
  const targetRect = draggleRef?.current?.getBoundingClientRect();
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({});
  const [position, setPosition] = useState({ x: 0, y: 0 });
  //窗口大小
  const { clientWidth, clientHeight } = useWindowSize();
  //modal初始值
  const [modalWidth, setModalWidth] = useState(props.width);
  const [modalHeight, setModalHeight] = useState(props.height);
  // isBig
  const [isBig, setIsBig] = useState(false);
  // Form 数据
  const [snamModalForm] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);

  const onStart = (_, uiData) => {
    setBounds({
      left: -targetRect?.left + uiData?.x,
      right: clientWidth - (targetRect?.right - uiData?.x),
      top: -targetRect?.top + uiData?.y,
      bottom: clientHeight - (targetRect?.bottom - uiData?.y),
    });
  };
  const onStop = (e, uiData) => {
    setPosition({ x: uiData?.x, y: uiData?.y });
  };

  useImperativeHandle(props.mref, () => ({
    setFieldsValue: (obj) => {
      snamModalForm.setFieldsValue(obj || {});
    },
  }));

  useEffect(() => {
    snamModalForm.resetFields();
    if (props.current) {
      snamModalForm.setFieldsValue({
        ...props.current,
      });
    }
  }, [props.visible, props.current]);

  const load = () => setConfirmLoading(true);
  const unload = () => setConfirmLoading(false);
  const doSubmit = async () => {
    load();
    snamModalForm
      .validateFields()
      .then((values) => {
        const params = { ...values };
        props.onSubmit(params);
        unload();
      })
      .catch(() => unload());
  };

  return (
    <Modal
      title={
        props.draggable ? (
          <div
            style={{ width: '100%', userSelect: 'none', cursor: isBig ? 'default' : 'move' }}
            title={isBig ? '双击还原' : '双击最大化'}
            onMouseOver={() => {
              if (!isBig) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              if (!isBig) {
                setDisabled(true);
              }
            }}
            onDoubleClick={() => {
              setPosition({ x: 0, y: 0 });
              if (isBig) {
                setModalWidth(props.width);
                setModalHeight(props.height);
                setIsBig(false);
                setDisabled(false);
              } else {
                setModalWidth(clientWidth);
                setModalHeight(clientHeight);
                setIsBig(true);
                setDisabled(true);
              }
            }}
          >
            {props.title}
          </div>
        ) : (
          props.title
        )
      }
      width={modalWidth}
      bodyStyle={props.bodyStyle || { height: modalHeight && modalHeight - 114, overflow: 'auto' }}
      className={props.className}
      style={{ paddingBottom: 0, maxWidth: clientWidth - 6 }}
      centered
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          onStart={(event, uiData) => onStart(event, uiData)}
          onStop={(event, uiData) => onStop(event, uiData)}
          position={position}
        >
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
      maskClosable={false}
      visible={props.visible}
      onCancel={props.onCancel}
      closable={props.closable}
      footer={
        <Space>
          {props.addRowVisible && (
            <Button key="addRow" htmlType="button" onClick={props.onAddRow}>
              {props.addText || '添加一行'}
            </Button>
          )}
          {props.removeRowVisible && (
            <Button key="removeRow" htmlType="button" onClick={props.onRemoveRow} type="danger">
              {props.removeText || '删除一行'}
            </Button>
          )}
          {!props.hideCancel && (
            <Button
              key="cancel"
              htmlType="button"
              onClick={props.onCancel}
              disabled={props.cancelDisabled}
            >
              {props.cancelText || '取消'}
            </Button>
          )}
          {props.preStepVisible && (
            <Button
              key="preStep"
              htmlType="button"
              onClick={props.onPreStep}
              loading={props.preStepLoading}
            >
              {props.preStepText || '上一步'}
            </Button>
          )}
          {(props.saveVisible || false) && (
            <Button
              key="save"
              htmlType="button"
              className={props.saveDanger ? '' : 'snam-btn-success'}
              type={props.saveDanger ? 'danger' : 'default'}
              onClick={props.onSave}
              disabled={props.saveDisabled}
              loading={props.saveLoading}
            >
              {props.saveText || '保存'}
            </Button>
          )}
          <Button
            key="submit"
            htmlType="submit"
            onClick={doSubmit}
            disabled={props.okDisabled}
            loading={props.commitLoading}
            type={props.okDanger ? 'danger' : 'primary'}
          >
            {props.okText || '确定'}
          </Button>
        </Space>
      }
    >
      <Form
        form={snamModalForm}
        layout={props.layout || 'horizontal'}
        onValuesChange={unload}
        className="snam-form"
        size={props.size}
      >
        {props.children}
      </Form>
    </Modal>
  );
};
