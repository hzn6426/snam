import React, { useState, useRef } from 'react';
import { Modal } from 'antd';
import Draggable from 'react-draggable';

export default (props) => {
    const draggleRef = useRef(null);
    const [disabled, setDisabled] = useState(true);
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });

    const onStart = (_event, uiData) => {
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };
    return <Modal
        title={
            <div
                style={{ width: '100%', cursor: 'move' }}
                onMouseOver={() => {
                    if (disabled) {
                        setDisabled(false);
                    }
                }}
                onMouseOut={() => {
                    setDisabled(true);
                }}
            >
                {props.title}
            </div>
        }
        modalRender={(modal) => (
            <Draggable
                disabled={disabled}
                bounds={bounds}
                onStart={(event, uiData) => onStart(event, uiData)}
            >
                <div ref={draggleRef}>{modal}</div>
            </Draggable>
        )}
        width={props.width}
        maskClosable={false}
        open={props.open}
        onOk={props.onOk}
        okButtonProps={props.okButtonProps}
        onCancel={props.onCancel}
        styles={props.bodyStyle}
        destroyOnClose={true}
        wrapClassName={props.isScrollModal ? "scroll-modal" : null}
        footer={props.footer}
    >
        {props.children}
    </Modal>
}