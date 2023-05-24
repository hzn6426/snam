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
import moment from 'moment';
import Dict from '@/components/Dict';
import User from '@/components/User';
import Customer from '@/components/Customer';
import Transceiver from '@/components/Transceiver';
import Vessel from '@/components/Vessel';
import ShipCompany from '@/components/ShipCompany';
import Port from '@/components/Port';
import Pack from '@/components/Pack';
import Country from '@/components/Country';
import EntrustShipCompany from '@/components/EntrustShipCompany';
import Box from '@/components/Box';
import XInput from '@/components/XInput';
import { isFunction } from '@/common/utils';
export default (props) => {
  const {
    xtype,
    required,
    message,
    regexp,
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
      case 'hidden':
        item = (
          <Form.Item name={name} style={{ display: 'none' }}>
            item = <Input {...others} />;
          </Form.Item>
        );
        beFormItem = false;
        break;
      case 'input':
        item = <Input {...others} />;
        break;
      case 'xinput':
        item = <XInput {...others} />;
        break;
      case 'textarea':
        item = <Input.TextArea {...others} />;
        break;
      case 'date':
        item = (
          <DatePicker
            style={{ width: '100%' }}
            {...others}
            format={format ? format : 'YYYY-MM-DD'}
            onChange={() => { }}
          />
        );
        break;
      case 'datetime':
        item = (
          <DatePicker
            format={format ? format : 'YYYY-MM-DD HH:mm'}
            showTime={showTime || { defaultValue: moment('00:00', 'HH:mm') }}
            style={{ width: '100%' }}
            {...others}
          />
        );
        break;
      case 'number':
        item = (
          <InputNumber
            min={0}
            max={10000000}
            style={{ width: '100%' }}
            {...others}
            onChange={() => { }}
          />
        );
        break;
      case 'select':
        item = (
          <Select style={{ width: '100%' }} options={ioptions} {...others}>
            {children}
          </Select>
        );
        break;
      case 'radio':
        item = (
          <Radio.Group {...others} options={ioptions}>
            {children}
          </Radio.Group>
        );
        break;
      case 'checkbox':
        item = (
          <Checkbox.Group options={ioptions} {...others}>
            {children}
          </Checkbox.Group>
        );
        break;
      case 'submit':
        beFormItem = false;
        item = <Button type={type || 'primary'} loading={loading} htmlType="submit" {...others} />;
        break;
      case 'button':
        beFormItem = false;
        item = <Button type={type || 'default'} {...others} />;
        break;
      case 'dict':
        item = <Dict dictCode={tag} {...others} />;
        break;
      case 'user':
        item = <User tag={tag} {...others} displayName={displayName} />;
        break;
      case 'customer':
        item = <Customer {...others} displayName={displayName} />;
        break;
      case 'transceiver':
        item = <Transceiver {...others} />;
        break;
      case 'vssel':
        item = <Vessel {...others} displayName={displayName} />;
        break;
      case 'country':
        item = <Country {...others} displayName={displayName} />;
        break;
      case 'box':
        item = <Box {...others} displayName={displayName} />;
        break;
      case 'shipCompany':
        item = <ShipCompany {...others} displayName={displayName} />;
        break;
      case 'entrustShipCompany':
        item = <EntrustShipCompany {...others} displayName={displayName} />;
        break;
      case 'port':
        item = <Port {...others} displayName={displayName} />;
        break;
      case 'pack':
        item = <Pack {...others} displayName={displayName} />;
        break;
      case 'switch':
        item = <Switch {...others} />;
        break;
      case 'empty':
        beFormItem = false;
        item = <></>;
        break;
    }

    const otherRule = {};
    if (max) {
      otherRule.max = max;
    }
    if (ruleType) {
      otherRule.type = ruleType;
    }
    if (regexp) {
      otherRule.regexp = regexp;
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
            ...otherRule,
            //type: ruleType || false,
            //regexp: regexp || false,
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
  }, [props]);

  return ui;
};
