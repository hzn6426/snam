import React, { useState, useEffect, useRef } from 'react';
import { Select } from 'antd';
import { api, useObservableAutoCallback, useAutoObservable, isEmpty } from '@/common/utils';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

const Pack = (props) => {
  const { Option } = Select;

  const { displayValue, displayName, placeholder, style, getPack, onChange } = props;

  const [keyword, setKeyword] = useAutoObservable(
    (input$) => input$.pipe(map((v) => (isEmpty(v) ? undefined : [{ label: v[0], value: v[1] }]))),
    displayName && displayValue ? [displayName, displayValue] : [],
  );

  const [onSearch, optionData] = useObservableAutoCallback((event) =>
    event.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((v) => api.pack.listByKeyword(v || '')),
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
      tap((v) => setKeyword(v || {})),
      tap((v) => onChange && onChange(v.value || '')),
      tap((v) => getPack && getPack(v.label || '')),
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
      {optionData && optionData.map((item) => <Option key={item.value}>{item.label}</Option>)}
    </Select>
  );
};

export default Pack;
