import React, { useState, useEffect } from 'react';
import IIF from '@/components/IIF';
import { For } from 'react-loops';
import { isEmpty, produce } from '@/common/utils';
export default (props) => {
  const { children } = props;
  const [noOtherWise, setNoOtherWise] = useState(true);
  const [childrenState, setChildrenState] = useState(new Array(children?.length));
  const doCallBack = (index, value) => {
    const state = produce(childrenState, (draft) => {
      draft[index] = !!value;
    });
    setChildrenState(state);
    const set = new Set(childrenState);
    setNoOtherWise(set.length > 1);
  };

  return (
    <>
      <For of={children}>
        {(child, { index }) =>
          React.cloneElement(child, {
            onHaveChildren: (v) => doCallBack(index, v),
            show: !noOtherWise,
          })
        }
      </For>
    </>
  );
};

export const IWhen = (props) => {
  const { children, onHaveChildren, test } = props;
  const beHaveChildren = !isEmpty(children);
  useEffect(() => {
    onHaveChildren(beHaveChildren);
  }, []);
  return <IIF test={test}>{children}</IIF>;
};

export const IOtherWise = (props) => {
  const { children, show } = props;
  return <IIF test={show}>{children}</IIF>;
};
