
import { useApplicationState } from "@/store/state";
import { Dropdown, Menu, Popconfirm } from 'antd';

import { copyObject } from "@/common/utils";
import { DeleteOutlined } from '@ant-design/icons';
import { nanoid } from "nanoid";
import { ConditionDataType, ConditionOperator, ConditionOperatorType, ConditionPositionType } from './channels';
import styles from './condition.less';
import ValueSelect from './value-select';

const LeafCondition = props => {
  const { disabled = false, id, parentId, constants, variables, funcs, condition } = props;

  const { setSubConditionLeft,setSubConditionRight,updateSubConditionOperator,deleteSubCondition } = useApplicationState(s => ({
    setSubConditionLeft: s.actions.condition.setSubConditionLeft,
    setSubConditionRight: s.actions.condition.setSubConditionRight,
    updateSubConditionOperator: s.actions.condition.updateSubConditionOperator,
    deleteSubCondition: s.actions.condition.deleteSubCondition,
  }));


  const { expression = {} } = condition || {};
  const { left = {}, operator, right = {} } = expression;

  const options = [
    {
      label: '输入值',
      value: ConditionDataType.INPUT
    },
    {
      label: '变量',
      value: ConditionDataType.VARIABLE,
      children: variables
    },
    {
      label: '常量',
      value: ConditionDataType.CONSTANT,
      children: constants
    },
    {
      label: '函数',
      value: ConditionDataType.FUNC,
      children: funcs
    }
  ];

  const rightOptions =
    left.type === ConditionDataType.VARIABLE && left.value && left.value.dicts
      ? [{ label: '常量', value: ConditionDataType.CONSTANT, children: [left.value.dicts] }]
      : options;

  const handleChangeOperator = (id, { label, charator }) => {
    updateSubConditionOperator(id,{ label, charator})
  };

  const handleonDelete = (id, parentId) => {
    deleteSubCondition(id, parentId);
  };

  // 值类型的值改变
  const handleExpressionChange = ({ parentId, id, type, code, value }, position) => {
    const r = {};
    if (position == ConditionPositionType.RIGHT) {
      copyObject(r, right, {value:value, code:code})
      setSubConditionRight(r);
    } else if (position == ConditionPositionType.LEFT) {
      copyObject(r, left, {value:value,code:code})
      setSubConditionLeft(r);
    }
  };

  // 操作符
  const operatorMenu = (
    <Menu>
      {ConditionOperator.map(operator => {
        const key = nanoid();
        return (
          <Menu.Item key={key}>
            <a onClick={() => handleChangeOperator(id, {label: operator.label, charator: operator.charator })}>
              {operator.label}
            </a>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  return (
    <div className={styles['toolbar_container']}>
      {left.id && (
        <ValueSelect
          disabled={disabled}
          parentId={id}
          // rawOptions={options}
          data={left}
          options={options}
          // constants={constants}
          onChange={value => handleExpressionChange(value, ConditionPositionType.LEFT)}
        />
      )}

      {operator && (
        <Dropdown disabled={disabled} overlay={operatorMenu} trigger={['click']}>
          <span style={{ color: 'red', fontWeight: 700, cursor: disabled ? '' : 'pointer', outline: 'none' }}>
            &nbsp;{operator ? operator.label : '请选择操作符'}&nbsp;
          </span>
        </Dropdown>
      )}

      {right.id && (
        <ValueSelect
          disabled={disabled}
          parentId={id}
          // rawOptions={options}
          data={right}
          options={rightOptions}
          // constants={constants}
          onChange={value => handleExpressionChange(value, ConditionPositionType.RIGHT)}
        />
      )}

      {operator && [ConditionOperatorType.In, ConditionOperatorType.NotIn].includes(operator.charator) && (
        <span style={{ color: 'red', fontWeight: 700 }}>&nbsp;之中</span>
      )}

      {!disabled && (
        <Popconfirm title="确定删除当前条件？" okText="确定" cancelText="取消" onConfirm={() => handleonDelete(id, parentId)}>
          {/* <span style={{ color: '#1890ff', cursor: 'pointer' }}>&nbsp;删&nbsp;除</span> */}
          &nbsp;<DeleteOutlined style={{cursor:'pointer'}} />
        </Popconfirm>
      )}
    </div>
  );
};

export default LeafCondition;
