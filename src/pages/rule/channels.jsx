import { immerable } from 'immer';
export const  ConditionType = {
    AND : "and",
    OR : "or",
    NOT : "not",
    ANY : "any",
    NORMAL: "normal"
}

export const ConditionPositionType = {
    LEFT : "left",
    RIGHT : "right",
}

export const ConditionDataType = {
    INPUT: "input",
    VARIABLE: "variable",
    CONSTANT: "constant",
    FUNC: "func",
}

export const ActionDataTyp = {
  VARIABLE_ASSIGN: 'variableAssign',
  EXECUTE_METHOD : 'executeMethod',
}

export const ConditionOperatorType = {
  '==': '==',
  EqualsIgnoreCase: 'EqualsIgnoreCase',
  '!=': '!=',
  NotEqualsIgnoreCase: 'NotEqualsIgnoreCase',
  '<': '<',
  '<=': '<=',
  '>': '>',
  '>=': '>=',
  In: 'in',
  NotIn: 'NotIn',
  StartWith: 'StartWith',
  NotStartWith: 'NotStartWith',
  EndWith: 'EndWith',
  NotEndWith: 'NotEndWith',
  Null: 'Null',
  NotNull: 'NotNull',
  Match: 'Match',
  NotMatch: 'NotMatch',
  Contain: 'Contain',
  NotContain: 'NotContain'
};

export const ConditionOperator =  [
    {
      label: '等于',
      charator: ConditionOperatorType['==']
    },
    {
      label: '等于（不区分大小写）',
      charator: ConditionOperatorType['EqualsIgnoreCase']
    },
    {
      label: '不等于',
      charator: ConditionOperatorType['!=']
    },
    {
      label: '不等于（不区分大小写）',
      charator: ConditionOperatorType['NotEqualsIgnoreCase']
    },
    {
      label: '小于',
      charator: ConditionOperatorType['<']
    },
    {
      label: '小于等于',
      charator: ConditionOperatorType['<=']
    },
    {
      label: '大于',
      charator: ConditionOperatorType['>']
    },
    {
      label: '大于等于',
      charator: ConditionOperatorType['>=']
    },
    {
      label: '在集合中',
      charator: ConditionOperatorType['in']
    },
    {
      label: '不在集合中',
      charator: ConditionOperatorType['NotIn']
    },
    {
      label: '开始于',
      charator: ConditionOperatorType['StartWith']
    },
    {
      label: '不开始于',
      charator: ConditionOperatorType['NotStartWith']
    },
    {
      label: '结束于',
      charator: ConditionOperatorType['EndWith']
    },
    {
      label: '不结束于',
      charator: ConditionOperatorType['NotEndWith']
    },
    {
      label: '为空',
      charator: ConditionOperatorType['Null']
    },
    {
      label: '不为空',
      charator: ConditionOperatorType['NotNull']
    },
    {
      label: '匹配',
      charator: ConditionOperatorType['Match']
    },
    {
      label: '不匹配',
      charator: ConditionOperatorType['NotMatch']
    },
    {
      label: '包含',
      charator: ConditionOperatorType['Contain']
    },
    {
      label: '不包含',
      charator: ConditionOperatorType['NotContain']
    }
  ];

  class ValueType {
    constructor({ id, type, value }) {
      this.id = id;
      this.type = type;
      this.value = this.init(value);
    }
  
    [immerable] = true;
  
    get isInputType() {
      return this.type === ConditionDataType.INPUT;
    }
  
    get isConstantType() {
      return this.type === ConditionDataType.CONSTANT;
    }
  
    get isVariableType() {
      return this.type === ConditionDataType.VARIABLE;
    }
  
    get isFuncType() {
      return this.type === ConditionDataType.FUNC;
    }
  
    getValue() {
      return {
        type: this.type,
        value: this.value
      };
    }
  
    init(value) {
      if (!this.type) return {};
  
      if (this.type === ConditionDataType.INPUT) {
        return value;
      }
  
      if (this.type === ConditionDataType.CONSTANT) {
        return {
          dicts: value.dicts, // 该字典元数据
          dictType: value.dictType, // 字典类型
          dictTypeLabel: value.dictTypeLabel,
          code: value.code, // 字典码值
          label: value.label
        };
      }
  
      if (this.type === ConditionDataType.VARIABLE) {
        return {
          dicts: value.dicts,
          groupCode: value.groupCode,
          groupLabel: value.groupLabel,
          propCode: value.propCode,
          propLabel: value.propLabel
        };
      }
  
      if (this.type === ConditionDataType.FUNC) {
        return {
          actionName: value.actionName,
          methodName: value.methodName,
          methodLabel: value.methodLabel,
          parameters: value.parameters.map(param => {
            param.value = new ValueType(param.value);
            return param;
          })
        };
      }
    }
  }
  export class Condition {
    constructor(props) {
      this.id = props.id;
      this.type = props.type;
  
      if (this.isNormalType) {
        this.expression = {};
        if (props.expression.left) {
          this.expression.left = new ValueType(props.expression.left);
        }
        if (props.expression.operator) {
          this.expression.operator = props.expression.operator;
        }
        if (props.expression.right) {
          this.expression.right = new ValueType(props.expression.right);
        }
      } else {
        this.subConditions = Array.isArray(props.subConditions)
          ? props.subConditions.map(options => new Condition(options))
          : [];
      }
    }
  
    [immerable] = true;
  
    get isAndType() {
      return this.type === ConditionType.AND;
    }
  
    get isOrType() {
      return this.type === ConditionType.OR;
    }
  
    get isNormalType() {
      return this.type === ConditionType.NORMAL;
    }
  }