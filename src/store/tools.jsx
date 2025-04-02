import { every } from "@/common/utils";
export function getRule(id, rules) {
  let target;
  every((rule) => {
    if (rule.id == id) {
      target = rule;
      return false;
    }
    return true;
  }, rules);
  return target;
}
export function getAction(id, rules) {
  let target;

  const getInAction = (actions) => {
    every((action) => {
      if (action.id == id) {
        target = action;
        return false;
      }
      return true;
    }, actions);
  }

  every(rule => {

    return getInAction(rule.actions);
      
  }, rules);
  return target;
}
export function getActionValueByLeftOrRightId(id, rules) {
  let target;
  const getInAction = (actions) => {
    every((action) => {
      if (action.value.left.id == id) {
        target = action.value;
        return false;
      } else if (action.value.right.id == id) {
        target = action.value;
        return false;
      }
      return true;
    }, actions);
  }
  every(rule => {
    return getInAction(rule.actions);
  }, rules);
  return target;
}

export function getRootCondition(id, rules) {
  let target;
  const getSub = (rootCondition) => {

    if (rootCondition.id == id) {
      target = rootCondition;
    }
  }

  every((v) => {
    if (v.rootCondition ) {
      if (v.rootCondition.id == id) {
        target = v.rootCondition;
      }
    }
  }, rules);

  return target;
}
export function getSubCondition(id, rules) {
  let target;
  const getSub = (subConditions) => {

    every((sub) => {
      if (sub.id === id) {
        target = sub;
        return false;
      }
      if (sub.subConditions) {
        getSub(sub.subConditions);
      }
      return true;
    }, subConditions);
  }

  every((v) => {
    if (v.rootCondition && v.rootCondition.subConditions) {
      return getSub(v.rootCondition.subConditions);
    }
  }, rules);

  return target;
}

export function getSubConditionByLeftOrRightId(id, rules) {
  let target;
  every((v) => {
    if (v.rootCondition) {
      const subConditions = v.rootCondition?.subConditions;
      const doLoopSubConditions = (ctns) => {
        every((sub) => {
          if (sub.expression?.left?.id == id) {
            target = sub;
            return false;
          } else if (sub.expression?.right?.id == id) {
            target = sub;
            return false;
          }
          if (sub.subConditions) {
            doLoopSubConditions(sub.subConditions);
          }
          return true;
        }, ctns);
      }

      if (subConditions) {
        return doLoopSubConditions(subConditions);
      }
    }
  }, rules);
  return target;
}