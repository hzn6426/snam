import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { Input, } from 'antd';

export default forwardRef((props, ref) => {
    const refInput = useRef(null);
    const [value, setValue] = useState(props.value);
    useEffect(() => {
        // get ref from React component
        const eInput = refInput.current;
        setTimeout(() => eInput.focus());
    }, []);

    useImperativeHandle(ref, () => {
        return {
            getValue() {
                return value;
            },
        };
    });

    //键盘事件
    const onKeyDown = (e) => {
        let keyCode = e.keyCode;
        let allNodes = [];
        props.api.forEachNode((rowNode) => {
            allNodes.push(rowNode.data);
        });
        let api = props.api;
        let rowIndex = props.rowIndex;
        let colKey = props.column.colId;
        if (keyCode === 38 && rowIndex > 0) {
            api.startEditingCell({
                rowIndex: rowIndex - 1,
                colKey: colKey,
            });
        }
        if (keyCode === 40) {
            if (rowIndex < allNodes.length - 1) {
                api.startEditingCell({
                    rowIndex: rowIndex + 1,
                    colKey: colKey,
                });
            } else {
                props.onNewRecord && props.onNewRecord();
            }
        }
    }

    const onBlur = (e) => {
        let api = props.api;
        api.stopEditing();
        let text = e.target.value;
        props.api.forEachNode((rowNode) => {
            const rdata = rowNode.data;
            if (rowNode.rowIndex === props.rowIndex) {
                rdata[props.column.colId] = text;
            }
        });
        props.onChange && props.onChange(props);
        setValue(text);
    }

    return (
        <Input
            ref={refInput}
            defaultValue={value}
            onBlur={onBlur}
            style={{ width: '100%', height: '27px' }}
        // onKeyDown={onKeyDown}
        />
    );
});
