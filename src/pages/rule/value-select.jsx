import React, { useState } from 'react';

import { Cascader } from 'antd';
import InputType from './input-type';

import * as R from 'ramda';
import { ConditionDataType } from './channels';

const ValueSelect = props => {
  const {
    disabled = false,
    defaultText = '请选择类型',
    parentId,
    // constants = [],
    // rawOptions = [],
    options = [],
    data = {},
    onChange
  } = props;

  const [showInput, setShowInput] = React.useState(false);

  const { id, value, type, code } = data;

  const [inputValue, setInputValue] = useState(value);
  const isInputType = type === ConditionDataType.INPUT;
  const isFuncType = type === ConditionDataType.FUNC;
  const isConstantType = type === ConditionDataType.CONSTANT;
  const isVariableType = type === ConditionDataType.VARIABLE;
  // 更加不同的值类型显示不同的文本，如果是选择用户输入值时，则会出现一个输入框供用户输入
  const renderDisplayLabel = data => {
    return <span style={{ fontWeight: 500 }}>{data.value}</span>;
  };


  const handleChange = (value, selectedOptions) => {
    
    const [valueType] = value;
    if (value.length === 1 && valueType == ConditionDataType.INPUT) {
      setShowInput(true);
      return;
    };
    const selectedCode = R.join('.', R.remove(0,1,value));
    const selectedValue = R.join('.',R.remove(0,1,R.pluck('label',selectedOptions)));

    onChange &&
      onChange({
        parentId,
        id: id,
        type: valueType,
        value: selectedValue,
        code: selectedCode,
      });
  };

  const handleInputTypeValueChange = (value, beFocus) => {
    setShowInput(beFocus);
    setInputValue(value);
    if (beFocus == false) {
      
      onChange &&
      onChange({
        parentId,
        id: id,
        type: ConditionDataType.INPUT,
        value,
        code:code
      });
    }
    
  };

  return (
    <React.Fragment>
      {showInput && <InputType disabled={disabled}  value={inputValue} onChange={(value, beFocus) =>handleInputTypeValueChange(value, beFocus)} />}

      {!showInput && <Cascader disabled={disabled} changeOnSelect={false} options={options} onChange={handleChange}>
        <span style={{ color: 'blue', fontWeight: 700, cursor: disabled ? '' : 'pointer', outline: 'none' }}>
          {data.type ? renderDisplayLabel(data) : defaultText}
        </span>
      </Cascader>}

      {/* {isFuncType && renderFuncParameters(data)} */}
    </React.Fragment>
  );
};

export default ValueSelect;
