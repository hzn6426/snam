import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { } from '@/common/utils'
import Select, { Option } from 'rc-select';
import './index.less';

export default forwardRef((props, ref) => {
  const { api, options, rowIndex, clearIndex, valueIndex, onChange } = props;


  const selectRef = useRef()
  const [value, setValue] = useState('');

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value;
      },
    }
  });

  useEffect(() => {
    focus();
  }, [])

  const focus = () => {
    window.setTimeout(() => {
      selectRef.current.focus()
    })
  }

  ////回写值
  const onChangeValue = (value) => {
    console.log(value);
    const ivalue = value || props.value;
    console.log(ivalue);
    // let mapValue = value || props.value;
    // if (!value) {
    //   mapValue = options && options.length > 0 ? options[0].value : '';
    // }
    const itemValue = options.filter(item => item.label === ivalue);
    console.log(itemValue);
    let mapValue = itemValue[0] && itemValue[0].value;
    let mapLabel = itemValue[0] && itemValue[0].label;
    props.api.forEachNode((rowNode) => {
      const data = rowNode.data;
      if (rowNode.rowIndex === rowIndex) {
        data[props.column.colId] = mapLabel;
        if (valueIndex) {
          data[valueIndex] = mapValue;
        }
      }
    });
    setTimeout(() => props.api.refreshCells());
    onChange && onChange(props);
    setValue(mapLabel);
  }

  const onBlur = (e) => {
    api.stopEditing();
    onChangeValue(e.target.value);
  }

  const onSelect = (value) => {
    onChangeValue(value);
  }


  return (
    <Select
      ref={selectRef}
      optionFilterProp="value"
      showArrow={false}
      style={{ width: '100%', height: '27px' }}
      onSelect={onSelect}
      onBlur={onBlur}
      defaultValue={props.value}
      mode="combobox"
      backfill
    >
      {options && options.map((item) => {
        return (<Option key={item.value} value={item.label}>{item.label}</Option>)
      })}
    </Select>
  );
});
