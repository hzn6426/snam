import React from 'react';
import { option2States } from '@/common/utils';
import { Tag } from 'antd';
import { For } from 'react-loops';
export default (props) => {
  const { onClick, options, values, multiColor, color } = props;
  const optionMap = option2States(options);
  const colors = ['#1890FF', '#52C41A', '#FF4D4F', '#FAAD14', '#983680', '#BDAEAD'];
  return (
    <>
      {options && (
        <For of={values}>
          {(value, { index, isLast }) =>
            color ? (
              optionMap[value]?.text + (!isLast ? ',' : '')
            ) : (
              <Tag
                color={(multiColor && colors[index % colors.length]) || optionMap[value]?.color}
                style={{ width: '65px', textAlign: 'center' }}
                onClick={onClick && onClick(value)}
              >
                {optionMap[value]?.text + ' '}
              </Tag>
            )
          }
        </For>
      )}
    </>
  );
};
