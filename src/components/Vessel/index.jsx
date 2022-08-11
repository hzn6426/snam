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

const Vessel = (props) => {
  const { Option } = Select;

  const { displayValue, displayName, placeholder, style, onChange } = props;

  const [keyword, setKeyword] = useAutoObservable(
    (input$) => input$.pipe(map((v) => (isEmpty(v) ? undefined : [{ label: v[0], value: v[1] }]))),
    displayName && displayValue ? [displayName, displayValue] : [],
  );

  const [onSearch, optionData] = useObservableAutoCallback((event) =>
    event.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((v) => api.vessel.listByKeyword(v)),
    ),
  );

  const [doOnChange] = useObservableAutoCallback((event) =>
    event.pipe(
      tap((v) => setKeyword(v || {})),
      tap((v) => onChange && onChange(v)),
    ),
  );
  // const { value, label } = props;
  // const [keyword, setKeyword] = useState();
  // const [optionData, setOptionData] = useState([]);
  // const delayedQuery = useRef(debounce((value) => shipData(value), 100)).current;
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
  //     fetchShip();
  //   }
  // }, [value, label]);

  // const fetchShip = (keywords) => {
  //   delayedQuery(keywords);
  // };

  // const shipData = (keywords) => {
  //   wrapObservable(api.ship.listByKeyword, keywords).subscribe({
  //     next: (body) => {
  //       let data = [];
  //       data = body.map((item) => ({
  //         label: `${item.enName}`,
  //         value: `${item.id}`,
  //       }));
  //       setOptionData(data);
  //     },
  //   });
  // };

  // const handleChange = (selectItem) => {
  //   setFlag(false);
  //   setKeyword(selectItem || {});
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
      {optionData.map((item) => (
        <Option key={item.value}>{item.label}</Option>
      ))}
    </Select>
  );
};

export default Vessel;
