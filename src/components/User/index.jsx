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
// 用户组件
export default (props) => {
  const { Option } = Select;

  const { displayValue, displayName, placeholder, style, getPort, onChange, tag } = props;

  const [keyword, setKeyword] = useAutoObservable(
    (input$) => input$.pipe(map((v) => (isEmpty(v) ? undefined : [{ label: v[0], value: v[1] }]))),
    displayName && displayValue ? [displayName, displayValue] : [],
  );

  const [onSearch, optionData] = useObservableAutoCallback((event) =>
    event.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((v) => api.ouser.listByKeyword(tag, v)),
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
      tap((v) => onChange && onChange(v?.value)),
    ),
  );

  // const { value, label, mode } = props;
  // const [keyword, setKeyword] = useState();
  // const [optionData, setOptionData] = useState([]);
  // const delayedQuery = useRef(debounce((value) => loadData(value), 100)).current;
  // const [flag, setFlag] = useState(true);

  // useEffect(() => {
  //   if (mode) {
  //     getUser(value);
  //   } else {
  //     if (value && label && flag) {
  //       let data = {
  //         label: label,
  //         value: value,
  //       };
  //       setOptionData([data]);
  //       setKeyword(data);
  //     } else {
  //       fetchUser();
  //     }
  //   }
  // }, [value, label]);

  // const getUser = (code) => {
  //   if (code) {
  //     api.user.getUserByCode(code).then((body) => {
  //       const { data } = body;
  //       const values = data.map((item) => ({
  //         label: `${item.userRealCnName}`,
  //         value: `${item.userName}`,
  //       }));
  //       setOptionData(values);
  //       setKeyword(values);
  //     });
  //   }
  // };

  // const fetchUser = (keywords) => {
  //   delayedQuery(keywords);
  // };

  // const loadData = (keywords) => {
  //   wrapObservable(api.user.listByKeyword, props.Tag, keywords || '').subscribe({
  //     next: (body) => {
  //       const data = R.map((item) => ({
  //         label: `${item.userRealCnName}`,
  //         value: `${item.userName}`,
  //       }))(body);
  //       setOptionData(data);
  //     },
  //   });
  // };

  // const handleChange = (selectItem) => {
  //   setFlag(false);
  //   setKeyword(selectItem);
  //   if (props.mode) {
  //     const values = selectItem.map((item) => item.value);
  //     props.onChange(values.toString() || '');
  //   } else {
  //     props.onChange(selectItem?.value || '');
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
      style={style}
    >
      {optionData && optionData.map((item) => <Option key={item.value}>{item.label}</Option>)}
    </Select>
  );
};
