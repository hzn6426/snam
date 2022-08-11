import React, { useState, useEffect, useRef } from 'react';
import { Select } from 'antd';
import {
  api,
  useObservableAutoCallback,
  useAutoObservable,
  isEmpty,
  forEach,
} from '@/common/utils';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

const Port = (props) => {
  const { Option } = Select;

  const { displayValue, displayName, placeholder, style, getPort, onChange } = props;

  const [keyword, setKeyword] = useAutoObservable(
    (input$) => input$.pipe(map((v) => (isEmpty(v) ? undefined : [{ label: v[0], value: v[1] }]))),
    displayName && displayValue ? [displayName, displayValue] : [],
  );

  const [onSearch, optionData] = useObservableAutoCallback((event) =>
    event.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((v) => api.port.listByKeyword(v)),
    ),
  );

  // const doOnChange = (selectItem) => {
  //   // setFlag(false);
  //   setKeyword(selectItem || {});
  //   props.onChange(selectItem?.value || '');
  //   if (props.getPort) {
  //     R.forEach((v) => {
  //       if (v.value === selectItem?.value) {
  //         props.getPort(v.item);
  //         return;
  //       }
  //     }, optionData);
  //   }
  // };
  const [doOnChange] = useObservableAutoCallback((event) =>
    event.pipe(
      tap((v) => console.log(v)),
      tap((v) => setKeyword(v || {})),
      tap((v) => onChange && onChange(v?.value)),
      tap((v) => {
        if (getPort) {
          const options = optionData || [];
          const fvalue = options.filter((item) => v.value && item.value === v.value);
          if (fvalue) {
            getPort(fvalue.item);
          }
        }
      }),
    ),
  );

  return (
    <Select
      showSearch
      labelInValue
      allowClear
      showArrow={false}
      value={keyword}
      placeholder={placeholder}
      filterOption={false}
      onSearch={onSearch}
      onChange={doOnChange}
      style={style}
    >
      {optionData && optionData.map((item) => <Option key={item.value}>{item.label}</Option>)}
    </Select>
  );
};

export default Port;
