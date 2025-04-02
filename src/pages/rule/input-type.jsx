import { Input } from 'antd';
import { useRef } from 'react';
const { TextArea } = Input;
const InputType = props => {
  const { disabled = false, value, onChange } = props;
  // const [focus, setFocus] = useState(!value);
  const ref = useRef();

  // useEffect(() => {
  //   if (focus) {
  //     ref.current.focus();
  //     if (onChange) {
  //       onChange(value, focus);
  //     }
  //   }
  // }, [focus]);

  const handleBlur =() => {
    if (disabled) return;
    onChange && onChange(value, false);
  };

  const handleEnter = ({ keyCode }) => {
    if (keyCode === 13) {
      onChange && onChange(value, false);
    }
  };

  return (
    <Input
    disabled={disabled}
    ref={ref}
    // type="text"
    size='small'
    value={value}
    onChange={(e) => onChange(e.target.value, true)}
    onBlur={() => handleBlur()}
    style={{width:120,fontSize:11}}
    // style={{ height: 15, width: 100, outline: 'none', border: '1px solid #c9c9c9' }}
    onKeyDown={handleEnter}
  />
  )
  // return focus ? (
  //   <Input
  //     disabled={disabled}
  //     ref={ref}
  //     // type="text"
  //     size='small'
  //     value={value}
  //     onChange={(e) => onChange(e.target.value, focus)}
  //     onBlur={() => handleFocus(false)}
  //     style={{width:100,fontSize:11}}
  //     // style={{ height: 15, width: 100, outline: 'none', border: '1px solid #c9c9c9' }}
  //     onKeyDown={handleEnter}
  //   />
  // ) : (
  //   <span disabled={disabled} onClick={() => handleFocus(true)} style={{ margin:"4px 0 4px 0", color: '#b45f04' }}>
  //     {value || '请输入值'}
  //   </span>
  // );
};

export default InputType;
