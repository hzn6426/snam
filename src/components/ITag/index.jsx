import React from 'react';
import { option2States } from '@/common/utils';
import { Tag } from 'antd';
import { For } from 'react-loops';
export default (props) => {
  const { onClick, options, values, multiColor, color } = props;
  const optionMap = option2States(options);
  const colors = [ '#FF4D4F', '#FAAD14', '#983680', '#BDAEAD', '#9A4C5B', '#52C41A',];
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
                style={{ width: '55px', textAlign: 'center' }}
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
