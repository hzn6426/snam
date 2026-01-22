import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, } from 'react';
import { Checkbox, } from 'antd';

export default forwardRef((props, ref) => {

    const [value, setValue] = useState(props.value);

    useImperativeHandle(ref, () => {
        return {
            getValue() {
                return value;
            },
        };
    });

    useEffect(() => {
        focus();
    }, []);


    const onChange = (e) => {
        let text = e.target.checked;
        props.api.forEachNode((rowNode) => {
            const rdata = rowNode.data;
            if (rowNode.rowIndex === props.rowIndex) {
                rdata[props.column.colId] = text;
            }
        });
        props.onChange && props.onChange(props);
        setValue(text);
    };

    return <Checkbox checked={value} onChange={onChange} />;
});
