import React from 'react';
import { Select } from 'antd';
import { api, useAutoObservable } from '@/common/utils';
import { map,switchMap } from 'rxjs';
import { isArray } from '@/common/utils';

export default (props) => {
  const { Option } = Select;
  const { value, placeholder, onChange, style, disabled, initialValue, isAll, dictCode } = props;

  const [optionData] = useAutoObservable(
    (input$) => input$.pipe(switchMap((v) => api.dict.listChildByParentCode(v[0]))),
    [dictCode],
  );

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={style || { width: '100%' }}
      defaultValue={initialValue}
    >
      {isAll && (
        <Option key={'all'} value={'all'}>
          {'全部'}
        </Option>
      )}
      {optionData &&
        isArray(optionData) &&
        optionData.map((item) => (
          <Option key={item.dictCode} value={item.dictCode}>
            {item.dictName}
          </Option>
        ))}
    </Select>
  );
};

// class Dict extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { data: [] };
//   }

//   componentDidMount() {
//     wrapObservable(api.dict.listChildByParentCode, this.props.dictCode).subscribe({
//       next: (data) => this.setState({ data }),
//     });
//   }

//   render() {
//     const { data } = this.state;
//     return (
//       <Select
//         value={this.props.value}
//         onChange={this.props.onChange}
//         placeholder={this.props.placeholder}
//         disabled={this.props.disabled}
//         style={this.props.style || { width: '100%' }}
//         defaultValue={this.props.initialValue}
//       >
//         {this.props.isAll && (
//           <Option key={'all'} value={'all'}>
//             {'全部'}
//           </Option>
//         )}
//         {data &&
//           data.map((item) => (
//             <Option key={item.dictCode} value={item.dictCode}>
//               {item.dictName}
//             </Option>
//           ))}
//       </Select>
//     );
//   }
// }

// export default Dict;
