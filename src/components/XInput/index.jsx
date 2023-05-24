import React, { useState, useEffect } from 'react';
import { Input } from 'antd';

export default (props) => {
  const { onChange, upperCase, ...others } = props;
  const handleChange = (e) => {
    const value = e.target.value;
    if (value && !!upperCase) {
      onChange(value.toUpperCase());
    } else {
      onChange('');
    }
  };
  return <Input {...others} onChange={handleChange} />;
};
