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

const Port = (props) => {
  const { Option } = Select;
  const { value, displayName, placeholder, style, getPort, onChange } = props;
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
  //       tap((v) => console.log(beTrigger)),
  //       filter((v) => beTrigger),
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
      tap((v) => setBeTrigger(false)),
      tap((v) => setKeyword(v || {})),
      tap((v) => onChange && onChange(v?.value)),
      tap((v) => getPort && getPort(v || {})),
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
      {optionData &&
        optionData.map((item) => (
          <Option value={item.value} key={stringRandom(16) + item.value}>
            {item.label}
          </Option>
        ))}
    </Select>
  );
};

export default Port;
