import React from 'react';
import { Tag } from 'antd';

export default (props) => {
  const { onClick, state, value } = props;

  const color = state[value]?.status;
  const text = state[value]?.text;

  const map = {
    Empty: 'default',
    Default: '#D7D7D7',
    Processing: '#1890FF',
    Success: '#52C41A',
    Error: '#FF4D4F',
    Reject: '#FAAD14',
    Edited: '#983680',
    Deleted: '#BDAEAD',
  };

  return (
    <>
      <Tag
        color={map[color] || 'default'}
        style={{ textAlign: 'center' }}
        onClick={onClick && onClick()}
      >
        {(text || '-') + ' '}
      </Tag>
    </>
  );
};
