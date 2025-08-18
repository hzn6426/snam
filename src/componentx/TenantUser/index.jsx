import React, { useState, useEffect, useRef } from 'react';
import { Select } from 'antd';
import {
  api,
  useObservableAutoCallback,
  useAutoObservable,
  isEmpty,
  debounce,
  isArray,
  stringRandom,
  data2Option,
} from '@/common/utils';
import { tap } from 'rxjs/operators';

const { Option } = Select;
// 用户组件
export default (props) => {
  const { Option } = Select;

  
  const { value, displayName, placeholder, style, getUser, tag, onChange, ...others } = props;
  const [beTrigger, setBeTrigger] = useState(true);
  const [keyword, setKeyword] = useState();
  useEffect(() => {
    if (value && displayName && beTrigger) {
      const labelInValue = { label: displayName, value: value };
      const option = [labelInValue];
      setOptionData(option);
      setKeyword(labelInValue);
    } else if (value) {
      fetchUser(value);
    }
  }, [displayName, value]);

  const fetchUser = (id) => {
    api.tuser.getUser(id).subscribe({
      next:(data) => {
        const u = data2Option('id','userRealCnName',data);
        setOptionData(u);
        setKeyword(u[0]);
      }
    })
  }

  const delayedQuery = useRef(debounce((value,tid) => loadData(value,tid), 400)).current;

  const loadData = (v, tid) => {
        api.tuser.listByKeyword(tag || '', v || '', tid).subscribe({
          next:(data) => {
            setOptionData(data);
          }
        });
      }

  const [optionData, setOptionData] = useState([]);
  const onSearch = (v,tid) => {
    delayedQuery(v,tid);
  }
  // const [onSearch, optionData, setOptionData] = useObservableAutoCallback((event) =>
  //   event.pipe(
  //     debounceTime(400),
  //     distinctUntilChanged(),
  //     switchMap((v,tid) => api.tuser.listByKeyword(tag || '', v || '', tid)),
  //   ),
  // );

  const [doOnChange] = useObservableAutoCallback((event) =>
    event.pipe(
      tap((v) => setBeTrigger(false)),
      tap((v) => setKeyword(v || {})),
      tap((v) => onChange && onChange(v?.value || '')),
      tap((v) => getUser && getUser(v || {})),
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
      onSearch={(v) => {
        console.log(props.tenantId);
        onSearch(v,props.tenantId);
      }}
      onChange={doOnChange}
      style={style}
      {...others}
    >
      {optionData && isArray(optionData) && optionData.map((item) => <Option value={item.value} key={stringRandom(16) + item.value}>{item.label}</Option>)}
    </Select>
  );
};
