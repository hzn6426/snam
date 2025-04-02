import { useApplicationState } from '@/store/state';
import { Button, Dropdown, Menu, Popconfirm } from 'antd';
import React from 'react';
import ValueSelect from './value-select';

import { copyObject } from '@/common/utils';
import { DeleteOutlined } from '@ant-design/icons';
import { nanoid } from 'nanoid';
import { ActionDataTyp, ConditionDataType, ConditionPositionType } from './channels';
// import { INPUT, VARIABLE, CONSTANT, FUNC } from '../../constants/valueType';
// import { VARIABLE_ASSIGN, EXECUTE_METHOD } from '../../constants/actionType';

const Action = props => {
  const {
    disabled = false,
    ruleId,
    dispatch,
    position,
    actions = [],
    variables = [],
    constants = [],
    funcs = []
  } = props;

  const { updateLeftAction, updateRightAction, addAction, deleteAction, updateAction } = useApplicationState(s => ({
            updateLeftAction: s.actions.action.updateLeftAction,
            updateRightAction: s.actions.action.updateRightAction,
            addAction: s.actions.action.addAction,
            deleteAction: s.actions.action.deleteAction,
            updateAction: s.actions.action.updateAction,
        }));

  const options = [
    {
      label: '输入值',
      value: ConditionDataType.INPUT
    },
    {
      label: '选择变量',
      value: ConditionDataType.VARIABLE,
      children: variables
    },
    {
      label: '选择常量',
      value: ConditionDataType.CONSTANT,
      children: constants
    },
    {
      label: '选择函数',
      value: ConditionDataType.FUNC,
      children: funcs
    }
  ];

  const handleAddAction = () => {
    const actionId = nanoid();
    const leftId = nanoid();
    const rightId = nanoid();
    console.log(leftId);
    const action = {
        id:actionId,
        type: ActionDataTyp.VARIABLE_ASSIGN,
        value: {
          left: {
            id:leftId,
          },
          right: {
            id:rightId
          }
        }
    }
    addAction(ruleId, action);
  };

  const handleDelete = (id) => {
    deleteAction(ruleId, id);
  };

  const handleSetActionType = ({ id, type }) => {
    updateAction(ruleId, {id, type});

    // dispatch({
    //   type: 'decisionSet/setActionType',
    //   payload: {
    //     ruleId,
    //     id,
    //     type,
    //     position
    //   }
    // });
  };

  const handleActionValueChange = ({ parentId, id, type, code, value }, position) => {
        const r = {};
        if (position == ConditionPositionType.RIGHT) {
          copyObject(r, {id,code: code, value:value, type})
          updateRightAction(r);
        } else if (position == ConditionPositionType.LEFT) {
          copyObject(r, {id, code: code, value:value, type})
          console.log(r);
          updateLeftAction(r);
        }
  };

  const renderActionTypeLabel = type => {
    if (!type) return '请选择动作类型';

    if (type === ActionDataTyp.VARIABLE_ASSIGN) return '变量赋值：';

    if (type === ActionDataTyp.EXECUTE_METHOD) return '执行方法：';
  };

  const renderActionValue = ({ parentId, actionType, actionValueRawdata }) => {
    if (actionType === ActionDataTyp.VARIABLE_ASSIGN) {
      const { left, right } = actionValueRawdata;
      console.log(left);
      return (
        <React.Fragment>
          <ValueSelect
            disabled={disabled}
            parentId={parentId}
            // dispatch={dispatch}
            data={left}
            // rawOptions={options}
            options={options.slice(0, 2)}
            // constants={constants}
            onChange={value => handleActionValueChange(value, ConditionPositionType.LEFT)}
          />
          <span style={{ color: 'red' }}>&nbsp;=&nbsp;</span>
          <ValueSelect
            disabled={disabled}
            parentId={parentId}
            // dispatch={dispatch}
            data={right}
            // rawOptions={options}
            options={options}
            // constants={constants}
            onChange={value => handleActionValueChange(value, ConditionPositionType.RIGHT)}
          />
        </React.Fragment>
      );
    }

    if (actionType === ActionDataTyp.EXECUTE_METHOD) {
      return (
        <ValueSelect
          disabled={disabled}
          defaultText="请填入方法"
          parentId={parentId}
        //   dispatch={dispatch}
          data={actionValueRawdata}
        //   rawOptions={options}
          options={options.slice(0,1)}
        //   constants={constants}
          onChange={value => handleActionValueChange(value, ConditionPositionType.LEFT)}
        />
      );
    }
  };

  return (
    <div>
      {actions.map(action => {
        const { id, type, value } = action;
        const actionTypeMenu = (
          <Menu>
            <Menu.Item key={ActionDataTyp.VARIABLE_ASSIGN}>
              <a
                onClick={() => {
                  handleSetActionType({ id, type: ActionDataTyp.VARIABLE_ASSIGN });
                }}
              >
                变量赋值
              </a>
            </Menu.Item>
            <Menu.Item key={ActionDataTyp.EXECUTE_METHOD}>
              <a style={{cursor:'pointer'}}
                onClick={() => {
                  handleSetActionType({ id, type: ActionDataTyp.EXECUTE_METHOD });
                }}
              >
                执行方法
              </a>
            </Menu.Item>
          </Menu>
        );

        return (
          <div key={id}>
            <Dropdown disabled={disabled} overlay={actionTypeMenu} trigger={['click']}>
              <span style={{ color: 'green', cursor: disabled ? '' : 'pointer', outline: 'none' }}>
                {renderActionTypeLabel(type)}
              </span>
            </Dropdown>

            {renderActionValue({ parentId: id, actionType: type, actionValueRawdata: value })}

            {!disabled && (
              <Popconfirm title="确定删除当前动作？" okText="确定" cancelText="取消" onConfirm={() => handleDelete(id)}>
                {/* <span style={{ color: '#1890ff', cursor: 'pointer' }}>&nbsp;删&nbsp;除</span> */}
                &nbsp;<DeleteOutlined style={{cursor:'pointer'}} />
              </Popconfirm>
            )}
          </div>
        );
      })}

      {!disabled && (
        <Button type="default" size='small' onClick={() => handleAddAction()}>
          添加动作
        </Button>
        // <div>
        //   <a onClick={() => handleAddAction(position)}>添加动作</a>
        // </div>
      )}
    </div>
  );
};

export default Action;
