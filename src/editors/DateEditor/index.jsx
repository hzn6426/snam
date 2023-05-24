import React, {
    forwardRef, useEffect, useImperativeHandle, useRef, useState,
} from 'react';
import { Input, DatePicker } from 'antd';
import moment from 'moment';

export default forwardRef((props, ref) => {
    const refInput = useRef(null);
    const [value, setValue] = useState(props.value ? moment(props.value) : '');
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

    const onBlur = (e) => {
        let api = props.api;
        api.stopEditing();
        if (e.target.value || props.value) {
            let text = moment(e.target.value) || moment(props.value);
            props.api.forEachNode((rowNode) => {
                const rdata = rowNode.data;
                if (rowNode.rowIndex === props.rowIndex) {
                    rdata[props.column.colId] = text;
                }
            });
            props.onChange && props.onChange(props);
            setValue(text);
        }
    }
    const onChange = (m, s) => {
        let api = props.api;
        api.stopEditing();
        let text = s ? moment(s) : '';
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
        <DatePicker
            ref={refInput}
            defaultValue={value}
            // onBlur={onBlur}
            onChange={onChange}
            style={{ width: '100%', height: '27px' }}
        />
    );
});
