import React, { useState } from 'react';
import { setLocale } from 'umi';
import { Drawer, Form, Row, Col, Switch, Radio, Segmented } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import * as R from 'ramda';
import LayoutBox from './layoutBox';
import ThemeBox from './themeBox';
import ColorBox from './colorBox';

const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4138236_ruatnx8t8dg.js'
});

export default (props) => {
  const [settingForm] = Form.useForm();

  const changeSettings = (v) => {
    let key = Object.keys(v)[0];
    let value = v[key];
    let n = R.assoc(key, value)(props.settings);
    if (key == "locale") {
      setLocale(value, false);
      localStorage.setItem("umi-locale", value);
    }
    props.onSettingChange(n);
    localStorage.setItem("settings", JSON.stringify(n));
  }

  const closeDrawer = () => {
    props.closeDrawer();
  }


  return (
    <Drawer
      title="系统设置"
      placement="right"
      width={320}
      closable={false}
      onClose={closeDrawer}
      open={props.visible}
    >
      <Form
        form={settingForm}
        // layout="horizontal"
        initialValues={props.settings}
        onValuesChange={changeSettings}
      >
        <Row gutter={[0,25]}>
          <Col span={24}>
            <Form.Item label="模式" name="navTheme" labelCol={{ span: 4 }} size="small">
              <Segmented
                options={[
                  {
                    label: '白昼',
                    value: 'light',
                    icon: <MyIcon type="caladog-day" />,
                  },
                  {
                    label: '暗夜',
                    value: 'realDark',
                    icon: <MyIcon type="caladog-night" />,
                  },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="标签" name="isTabs" labelCol={{ span: 4 }} valuePropName="checked">
              <Switch checkedChildren="是" unCheckedChildren="否" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="布局" name="layout" labelCol={{ span: 4 }}>
              <LayoutBox />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="主题" name="theme" labelCol={{ span: 4 }} size="small">
              <ThemeBox />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="颜色" name="colorPrimary" labelCol={{ span: 4 }} size="small">
              <ColorBox />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
};