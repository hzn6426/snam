import React, {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { Input, } from 'antd';
import { formatNumber } from '@/common/utils';

export default forwardRef((props, ref) => {

    const { api, fixNum, min, max } = props

    const refInput = useRef(null);

    const [value, setValue] = useState(formatNumber(props.value, fixNum || 2));

    useEffect(() => {
        setTimeout(() => refInput.current.select());
    }, []);

    useImperativeHandle(ref, () => {
        return {
            getValue() {
                return value;
            },
        };
    });

    const onBlur = (e) => {
        api.stopEditing();
        let text = parseFloat(e.target.value || props.value);
        let textValue = 0;
        if (text === '-') {
            textValue = '-';
        } else {
            let minValue = parseFloat(min) || 0, maxValue = parseFloat(max);
            var regex = /^[+-]?\d+(\.\d+)?$/;
            if (regex.test(text)) {
                if (maxValue && maxValue < 0) {
                    if (text > 0) {
                        textValue = maxValue;
                    } else {
                        textValue = Math.abs(text) < Math.abs(minValue) ? minValue : text;
                    }
                } else {
                    textValue = text < minValue ? minValue : text;
                }
            }
            if (maxValue && Math.abs(textValue) > Math.abs(maxValue)) {
                textValue = maxValue;
            }
        }

        props.api.forEachNode((rowNode) => {
            const rdata = rowNode.data;
            if (rowNode.rowIndex === props.rowIndex) {
                rdata[props.column.colId] = textValue;
            }
        });
        setTimeout(() => props.api.refreshCells());
        props.onChange && props.onChange(props);
        setValue(textValue);
    }

    return (
        <Input
            ref={refInput}
            defaultValue={value}
            onBlur={onBlur}
            style={{ width: '100%', height: '27px' }}
        />
    );
});
