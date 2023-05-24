import React, { useState, useEffect, useRef } from 'react';
import { Select } from 'antd';
import {
  api,
  useObservableAutoCallback,
  useAutoObservable,
  isEmpty,
  stringRandom,
} from '@/common/utils';
import { debounceTime, distinctUntilChanged, map, switchMap, tap, filter } from 'rxjs/operators';

const Box = (props) => {
  const { Option } = Select;

  const { value, displayName, placeholder, style, getBox, onChange } = props;

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
      switchMap((v) => api.box.listByKeyword(v || '')),
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
      tap((v) => onChange && onChange(v?.value || '')),
      tap((v) => getBox && getBox(v || {})),
    ),
  );

  // const { value, label } = props;
  // const [keyword, setKeyword] = useState();
  // const [optionData, setOptionData] = useState([]);
  // const delayedQuery = useRef(debounce(value => packData(value), 100)).current;
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
  //     fetchPack();
  //   }
  // }, [value, label]);

  // const fetchPack = keywords => {
  //   delayedQuery(keywords);
  // }

  // const packData = (keywords) => {
  //   api.pack.listByKeyword(keywords || '').then(body => {
  //     let data = [];
  //     data = body.map(item => ({
  //       label: `${item.enName}`,
  //       value: `${item.packEdi}`,
  //     }));
  //     setOptionData(data);
  //   });
  // }

  // const handleChange = selectItem => {
  //   setFlag(false);
  //   setKeyword(selectItem || {});
  //   props.onChange(selectItem?.value || '');
  //   props.getPack && props.getPack(selectItem?.label || '');
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

export default Box;
