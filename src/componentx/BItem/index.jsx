import {
    api,
    data2Option,
    isArray,
    stringRandom,
    useObservableAutoCallback,
    debounce
} from '@/common/utils';
import { Select } from 'antd';
import { useEffect, useState,useRef } from 'react';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

const { Option } = Select;
// 用户组件
export default (props) => {
    const { Option } = Select;

    const { value, displayName, placeholder, style, getUser, tag, onChange, onGetItem, ...others } = props;
    const [beTrigger, setBeTrigger] = useState(true);
    const [keyword, setKeyword] = useState();
    const [optionData, setOptionData] = useState([]);
    const delayedQuery = useRef(debounce((value) => loadData(value), 200)).current;
    useEffect(() => {
        if (value && displayName && beTrigger) {
            const labelInValue = { label: displayName, value: value };
            const option = [labelInValue];
            setOptionData(option);
            setKeyword(labelInValue);
        } else if (value) {
            fetchItem(value);
        } else {
            onSearch('');
        }
    }, [displayName, value]);

    const fetchItem = (id) => {
        api.item.getItem(id).subscribe({
            next: (data) => {
                const u = data2Option('id', 'name', data);
                setOptionData(u);
                setKeyword(u[0]);
            }
        })
    }

    const loadData = (keywords) => {
        api.item.listByKeyword(keywords || '').subscribe({
          next:(data) => {
            setOptionData(data);
          }
        });
      }
    
      const onSearch = (keywords) => {
        delayedQuery(keywords);
      };

    // const [onSearch, optionData, setOptionData] = useObservableAutoCallback((event) =>
    //     event.pipe(
    //         debounceTime(400),
    //         distinctUntilChanged(),
    //         switchMap((v) => api.item.listByKeyword(v || '')),
    //     ),
    // );

    const [doOnChange] = useObservableAutoCallback((event) =>
        event.pipe(
            tap((v) => setBeTrigger(false)),
            tap((v) => setKeyword(v || {})),
            tap((v) => onChange && onChange(v?.value || '')),
            tap((v) => onGetItem && onGetItem(v || {})),
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
            {...others}
        >
            {optionData && isArray(optionData) && optionData.map((item) => <Option value={item.value} key={stringRandom(16) + item.value}>{item.label}</Option>)}
        </Select>
    );
};
