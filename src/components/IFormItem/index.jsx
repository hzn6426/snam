import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Radio,
  Checkbox,
  InputNumber,
  Switch,
} from 'antd';
import Dict from '@/components/Dict';
import User from '@/components/User';
import Customer from '@/components/Customer';
import Transceiver from '@/components/Transceiver';
import Vessel from '@/components/Vessel';
import ShipCompany from '@/components/ShipCompany';
import Port from '@/components/Port';
import Pack from '@/components/Pack';
import { isFunction } from '@/common/utils';
export default (props) => {
  const {
    xtype,
    required,
    message,
    regexp,
    readOnly,
    name,
    label,
    labelCol,
    options,
    type,
    loading,
    children,
    labelWrap,
    displayName,
    displayValue,
    tag,
    max,
    ruleType,
    format,
    tooltip,
    showTime,
    ...others
  } = props;

  const [ui, setUi] = useState(<></>);

  const renderComponent = () => {
    let ioptions = isFunction(options) ? options() : options;
    let beFormItem = true;
    let item;
    switch (xtype) {
      case 'id':
        item = (
          <Form.Item style={{ display: 'none' }}>
            <Form.Item name="id" label="id">
              <Input />
            </Form.Item>
          </Form.Item>
        );
        beFormItem = false;
        break;
      case 'input':
        item = <Input readOnly={readOnly} {...others} />;
        break;
      case 'textarea':
        item = <Input.TextArea readOnly={readOnly} {...others} />;
        break;
      case 'date':
        item = <DatePicker style={{ width: '100%' }} disabled={readOnly} />;
        break;
      case 'datetime':
        item = (
          <DatePicker
            disabled={readOnly}
            format={format ? format : 'YYYY-MM-DD HH:mm'}
            showTime={showTime || { defaultValue: moment('00:00', 'HH:mm') }}
            style={{ width: '100%' }}
            {...others}
          />
        );
        break;
      case 'number':
        item = <InputNumber style={{ width: '100%' }} readOnly={readOnly} />;
        break;
      case 'select':
        item = (
          <Select style={{ width: '100%' }} options={ioptions} {...others} disabled={readOnly}>
            {children}
          </Select>
        );
        break;
      case 'radio':
        item = (
          <Radio.Group disabled={readOnly} {...others} options={ioptions}>
            {children}
          </Radio.Group>
        );
        break;
      case 'checkbox':
        item = (
          <Checkbox.Group disabled={readOnly} options={ioptions} {...others}>
            {children}
          </Checkbox.Group>
        );
        break;
      case 'submit':
        beFormItem = false;
        item = (
          <Button
            type={type || 'primary'}
            loading={loading}
            htmlType="submit"
            {...others}
            disabled={readOnly}
          />
        );
        break;
      case 'button':
        beFormItem = false;
        item = <Button type={type || 'default'} {...others} disabled={readOnly} />;
        break;
      case 'dict':
        item = <Dict dictCode={tag} disabled={readOnly} {...others} />;
        break;
      case 'user':
        item = <User tag={tag} disabled={readOnly} {...others} label={displayName} />;
        break;
      case 'customer':
        item = (
          <Customer disabled={readOnly} {...others} label={displayName} value={displayValue} />
        );
        break;
      case 'transceiver':
        item = <Transceiver disabled={readOnly} {...others} />;
        break;
      case 'vssel':
        item = <Vessel {...others} label={displayName} />;
        break;
      case 'shipCompany':
        item = <ShipCompany ctmType={tag} {...others} label={displayName} />;
        break;
      case 'port':
        item = <Port displayName={displayName} displayValue={displayValue} {...others} />;
        break;
      case 'pack':
        item = <Pack {...others} label={displayName} />;
        break;
      case 'switch':
        item = <Switch {...others} />;
        break;
      case 'empty':
        beFormItem = false;
        item = <></>;
        break;
    }

    const formItem = beFormItem ? (
      <Form.Item
        name={name}
        label={label}
        labelCol={labelWrap ? { span: 24 } : labelCol || { flex: '80px' }}
        tooltip={tooltip || false}
        rules={[
          {
            required: required || false,
            message: message,
            max: max || false,
            type: ruleType || false,
            regexp: regexp || false,
          },
        ]}
      >
        {item}
      </Form.Item>
    ) : (
      <>{item}</>
    );
    setUi(formItem);
  };

  useEffect(() => {
    renderComponent();
  }, [options]);

  return ui;
};
