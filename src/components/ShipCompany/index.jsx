import React, { useState, useEffect, useRef } from 'react';
import { Select } from 'antd';
import {
  api,
  useObservableAutoCallback,
  useAutoObservable,
  isEmpty,
  stringRandom,
  isArray,
} from '@/common/utils';
import { debounceTime, distinctUntilChanged, map, switchMap, tap, filter } from 'rxjs/operators';

export default (props) => {
  const { Option } = Select;

  const { value, displayName, placeholder, style, getShipCompany, onChange } = props;
  const [beTrigger, setBeTrigger] = useState(true);
  const [keyword, setKeyword] = useState();
  useEffect(() => {
    if (value && displayName && beTrigger) {
      const labelInValue = { label: displayName, value: value };
      const option = [labelInValue];
      setOptionData(option);
      setKeyword(labelInValue);
    }
  }, [displayName, value]);
  // const [keyword, setKeyword] = useAutoObservable(
  //   (input$) =>
  //     input$.pipe(
  //       filter((v) => v && v[0] && v[1]),
  //       map((v) => {
  //         const labelInValue = { label: v[0], value: v[1] };
  //         const option = [labelInValue];
  //         setOptionData(option);
  //         return labelInValue;
  //       }),
  //     ),
  //   [displayName, value],
  // );

  const [onSearch, optionData, setOptionData] = useObservableAutoCallback((event) =>
    event.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((v) => api.shipComany.listByKeyword(v)),
      tap((v) => console.log(v)),
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
      tap((v) => setBeTrigger(false)),
      tap((v) => setKeyword(v || {})),
      tap((v) => onChange && onChange(v?.value)),
      tap((v) => getShipCompany && getShipCompany(v || {})),
    ),
  );

  // const { value, label } = props;
  // const [keyword, setKeyword] = useState();
  // const [optionData, setOptionData] = useState([]);
  // const delayedQuery = useRef(debounce((value) => loadData(value), 100)).current;
  // const [flag, setFlag] = useState(true);

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
  //   wrapObservable(api.customer.listByKeyword, CUSTOMERTAG.SHIP_COMPANY, keywords || '').subscribe({
  //     next: (body) => {
  //       const data = R.map((item) => ({
  //         label: `${item.enName}`,
  //         value: `${item.id}`,
  //       }))(body);
  //       setOptionData(data);
  //     },
  //   });
  // };

  // const handleChange = (selectItem) => {
  //   setFlag(false);
  //   setKeyword(selectItem);
  //   props.onChange(selectItem?.value || '');
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
      style={style}
    >
      {optionData &&
        isArray(optionData) &&
        optionData.map((item) => (
          <Option value={item.value} key={stringRandom(16) + item.value}>
            {item.label}
          </Option>
        ))}
    </Select>
  );
};
