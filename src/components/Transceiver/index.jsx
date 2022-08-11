import React, { useState, useEffect, useRef } from 'react';
import { Button, Input } from 'antd';

export default (props) => {
  const { rows, placeholder, value, onChange, hideButton } = props;
  const [message, setMessage] = useState('');
  const [colsNum, setColsNum] = useState(40);

  useEffect(() => {
    changeValue(value);
  }, [value]);

  //修改行数
  const changeCols = (num) => {
    if (value) {
      var lines = value.split('\n');
      var values = [];
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (line.length > num) {
          values.push(line.substring(0, num - 1));
          values.push(line.substring(num - 1, line.length));
        } else {
          values.push(line);
        }
      }
      var string = values.join('\n');
      onChange(string.toUpperCase());
    }
  };

  //验证
  const validate = (v, num) => {
    let falg = true;
    setColsNum(num);
    var lines = v.split('\n');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      let number = i + 1;
      if (line.match(/[^/|^\ \r\n|^@|^*|^'|^_|^+|^#|^&|^:|^"|^"|^\-|^ |^.|^,|^(|^)|^\d|^\[A-Z\]]/g)) {
        setMessage('第' + number + '包含非法字符');
        falg = false;
        break;
      }
      if (line.length > num) {
        setMessage('第' + number + '行超过' + num + '个字符');
        falg = false;
        break;
      }
    }
    if (falg) {
      setMessage('');
    }
  };

  //改变input
  const changeValue = (v) => {
    if (v) {
      validate(v, colsNum);
      // onChange(
      //  v
      // );
      onChange(
        v.toUpperCase().replace(/[^/|^\ \r\n|^@|^_|^*|^'|^+|^#|^&|^:|^"|^"|^\-|^ |^.|^,|^(|^)|^\d|^\[A-Z\]]/g, '?'),
      );
    } else {
      setMessage('');
      onChange('');
    }
  };

  return (
    <>
      <p
        style={{
          right: '40px',
          top: '-30px',
          position: 'absolute',
          color: '#F00000',
          fontSize: '10px',
          lineHeight: '30px',
        }}
      >
        {message}
      </p>
      <div style={{ display: 'flex' }}>
        <Input.TextArea
          rows={rows}
          placeholder={placeholder}
          style={{
            height: props.height || '105px',
            resize: 'none',
            lineHeight: '19px',
            fontSize: '12px',
            zIndex: 1,
          }}
          value={value}
          onChange={(e) => {
            changeValue(e.target.value);
          }}
        />
        <div style={{ marginLeft: '-1px', display: hideButton ? 'none' : '' }} >
          <div>
            <Button size="small" style={{ height: props.height ? '40px' : '35px' }} onClick={() => changeCols(30)}>
              30
            </Button>
          </div>
          <div>
            <Button
              size="small"
              style={{ height: props.height ? '42px' : '37px', margin: '-1px 0' }}
              onClick={() => changeCols(35)}
            >
              35
            </Button>
          </div>
          <div>
            <Button size="small" style={{ height: props.height ? '40px' : '35px' }} onClick={() => changeCols(40)}>
              40
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
