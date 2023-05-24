import React, { useEffect, useRef, useState } from 'react';
export default (props) => {

  const { test, children } = props;
  useEffect(() => {},[test])
  return test ? children : null;
};
