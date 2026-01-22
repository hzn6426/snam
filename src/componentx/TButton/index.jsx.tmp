import React, { useState, useEffect, useRef } from 'react';
import { Select, Tag } from 'antd';
import {
  api,
  useObservableAutoCallback,
  useAutoObservable,
  isEmpty,
  forEach,
  isArray,
  stringRandom,
  data2Option,
  rmap,
} from '@/common/utils';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

const { Option } = Select;
// 用户组件
export default (props) => {
  const { Option } = Select;

  const { value, displayName, placeholder, style, onGetButton, onChange, ...others } = props;

  const [keyword, setKeyword] = useState();
  useEffect(() => {
    if (value) {
      getButton(value)
    } else if (value) {
      onSearch(value);
    }
  }, [value]);

  const getButton = (id) => {
    api.tmenu.getButtonAndApiById(id).subscribe({
      next: (data) => {
        const values = rmap((item) => ({
          label: `${item.reqUrl}`,
          value: `${item.id}`,
          item: item
        }), data);
        setOptionData(values);
        setKeyword(values);
      }
    })
  }

  const maObject = {
    'POST': '#108ee9',
    'PUT': '#2db7f5',
    'GET': '#87d068',
    'DELETE': '#f50'
  }

  const [onSearch, optionData, setOptionData] = useObservableAutoCallback((event) =>
    event.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((v) => api.tmenu.listBttonsByKeyWord(v || '')),
      map((body) => {
        const data = rmap((item) => ({
          label: <><Tag style={{ fontSize: 8 }} bordered={false} color={maObject[item.reqMethod]}>{item.reqMethod}</Tag>  {item.reqUrl}</>,
          value: `${item.id}`,
          item: item
        }), body);
        return data;
      })
    ),
  );

  const doOnChange = (selectItem, option) => {
    setKeyword(selectItem);
    onChange && onChange(selectItem?.value || '');
    onGetButton && onGetButton(option && option['data-item'] || {});
  }

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
      {...others}
    >
      {optionData && isArray(optionData) && optionData.map((item) => <Option data-item={item.item} key={item.value}>{item.label}</Option>)}
    </Select>
  );
};
