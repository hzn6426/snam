import React, { useState, useEffect, useRef } from 'react';
import { Select } from 'antd';
import {
  api,
  useObservableAutoCallback,
  useAutoObservable,
  isEmpty,
  forEach,
  stringRandom,
} from '@/common/utils';
import { debounceTime, distinctUntilChanged, map, switchMap, tap, filter } from 'rxjs/operators';

const Vessel = (props) => {
  const { Option } = Select;

  const { value, displayName, placeholder, style, onChange } = props;
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
      switchMap((v) => api.vessel.listByKeyword(v)),
    ),
  );

  const [doOnChange] = useObservableAutoCallback((event) =>
    event.pipe(
      tap((v) => setBeTrigger(false)),
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
      {optionData &&
        optionData.map((item) => (
          <Option value={item.value} key={stringRandom(16) + item.value}>
            {item.label}
          </Option>
        ))}
    </Select>
  );
};

export default Vessel;
