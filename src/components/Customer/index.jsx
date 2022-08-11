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
const { Option } = Select;

export default (props) => {
  const { Option } = Select;

  const {
    displayValue,
    displayName,
    placeholder,
    style,
    ctmType,
    onChange,
    getSelectItem,
    disabled,
  } = props;

  const [keyword, setKeyword] = useAutoObservable(
    (input$) => input$.pipe(map((v) => (isEmpty(v) ? undefined : [{ label: v[0], value: v[1] }]))),
    displayName && displayValue ? [displayName, displayValue] : [],
  );

  const [onSearch, optionData] = useObservableAutoCallback((event) =>
    event.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((v) => api.customer.listByKeyword(ctmType, v)),
    ),
  );

  const [doOnChange] = useObservableAutoCallback((event) =>
    event.pipe(
      tap((v) => setKeyword(v || {})),
      tap((v) => onChange && onChange(v.value || '')),
      tap((v) => getSelectItem && getSelectItem(v)),
      tap((v) => {
        if (getCustomer) {
          const options = optionData || [];
          const fvalue = options.filter((item) => v.value && item.value === v.value);
          if (fvalue) {
            getCustomer(fvalue.item);
          }
        }
      }),
    ),
  );
  // const keyword$ = useObservable(
  //   (input$) =>
  //     input$.pipe(
  //       debounceTime(400),
  //       distinctUntilChanged(),
  //       switchMap(([keyword]) => api.customer.listByKeyword(props.ctmType, keyword || '')),
  //       map((data) => setOptionData(data)),
  //     ),
  //   [keyword],
  // );

  // useEffect(() => {
  //   if (value && label && flag) {
  //     let data = {
  //       label: label,
  //       value: value,
  //     };
  //     setOptionData([data]);
  //     setKeyword(data);
  //   } else {
  //     fetchShipCompany();
  //   }
  // }, [value, label]);

  // const fetchShipCompany = (keywords) => {
  //   delayedQuery(keywords);
  // };

  // const loadData = (keywords) => {
  //   api.customer.listByKeyword(props.ctmType, keywords || '').subscribe({
  //     next: (data) => {
  //       setOptionData(data);
  //     },
  //   });
  // };

  // const handleChange = (selectItem) => {
  //   setFlag(false);
  //   setKeyword(selectItem);
  //   props.onChange && props.onChange(selectItem?.value || '');
  //   props.getSelectItem && props.getSelectItem(selectItem);
  //   if (props.getCustomer) {
  //     forEach((v) => {
  //       if (v.value === selectItem?.value) {
  //         props.getCustomer(v.item);
  //         return;
  //       }
  //     }, optionData);
  //   }
  // };

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
      style={style || { width: '100%' }}
      disabled={disabled}
    >
      {optionData.map((item) => (
        <Option key={item.value}>{item.label}</Option>
      ))}
    </Select>
  );
};
