import React, { useState } from 'react';
import { setLocale } from 'umi';
import { Drawer, Form, Row, Col, Switch, Radio, Segmented } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import { useApplicationState } from "@/store/state";
import * as R from 'ramda';
import LayoutBox from './layoutBox';
import ThemeBox from './themeBox';
import ColorBox from './colorBox';

const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_4138236_ruatnx8t8dg.js'
});

export default (props) => {
  const [settingForm] = Form.useForm();

  const [setViewSetting] = useApplicationState(s => [s.actions.view.setViewSetting]);

  const changeSettings = (v) => {
    let key = Object.keys(v)[0];
    let value = v[key];
    let n = R.assoc(key, value)(props.settings);
    
    if (key == "locale") {
      setLocale(value, false);
      localStorage.setItem("umi-locale", value);
    }
    
    // 如果是主题相关设置，立即应用
    if (key === "navTheme" || key === "colorPrimary") {
      // 立即更新主题
      setViewSetting(n);
      localStorage.setItem("settings", JSON.stringify(n));
      
      // 立即设置data-theme属性
      if (key === "navTheme") {
        const theme = value === 'realDark' ? 'dark' : value;
        document.documentElement.setAttribute("data-theme", theme);
        
        // 处理玻璃主题
        if (value === 'glass') {
          document.body.classList.add('glass-theme');
          document.body.style.backgroundImage = "url('../assets/back/bg-6.jpg')";
          document.body.style.backgroundSize = "cover";
          document.body.style.backgroundPosition = "center";
          document.body.style.backgroundAttachment = "fixed";
        } else {
          document.body.classList.remove('glass-theme');
          document.body.style.backgroundImage = "";
          document.body.style.backgroundSize = "";
          document.body.style.backgroundPosition = "";
          document.body.style.backgroundAttachment = "";
        }
      }
      
      // 立即更新主题色
      if (key === "colorPrimary" && value) {
        document.documentElement.style.setProperty('--ant-primary-color', value);
        // 更新其他相关CSS变量
        const style = document.documentElement.style;
        style.setProperty('--ant-menu-item-selected-bg', value);
        style.setProperty('--ant-menu-item-active-bg', value);
        style.setProperty('--ant-menu-item-hover-bg', `${value}cc`);
        style.setProperty('--ant-menu-highlight-color', value);
        style.setProperty('--ant-menu-dark-item-selected-bg', value);
        style.setProperty('--ant-menu-dark-item-active-bg', value);
        style.setProperty('--ant-pagination-item-active-bg', value);
        style.setProperty('--ant-pagination-item-active-border', value);
        style.setProperty('--ant-btn-primary-bg', value);
        style.setProperty('--ant-btn-primary-border', value);
        style.setProperty('--ant-btn-primary-hover-bg', `${value}cc`);
        style.setProperty('--ant-btn-primary-hover-border', `${value}cc`);
        style.setProperty('--ant-btn-primary-active-bg', `${value}99`);
        style.setProperty('--ant-btn-primary-active-border', `${value}99`);
        style.setProperty('--ant-pro-layout-sider-background', value);
        style.setProperty('--ant-tree-node-selected-bg', value);
        style.setProperty('--ant-tree-node-hover-bg', `${value}cc`);
        style.setProperty('--ant-select-item-selected-bg', value);
        style.setProperty('--ant-select-item-hover-bg', `${value}cc`);
        style.setProperty('--ant-form-item-label-color', value);
        style.setProperty('--ant-aggrid-row-selected-bg', value);
        style.setProperty('--ant-aggrid-row-hover-bg', `${value}cc`);
        style.setProperty('--ant-input-hover-border-color', value);
        style.setProperty('--ant-input-focus-border-color', value);
        style.setProperty('--ant-btn-default-hover-bg', `${value}cc`);
        style.setProperty('--ant-btn-default-hover-border', value);
      }
    } else {
      setViewSetting(n);
      localStorage.setItem("settings", JSON.stringify(n));
    }
    
    //发送事件
    window.dispatchEvent(new Event("storage"));
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
                  {
                    label: '玻璃',
                    value: 'glass',
                    icon: <MyIcon type="caladog-glass" />,
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
          {/* <Col span={24}>
            <Form.Item label="主题" name="theme" labelCol={{ span: 4 }} size="small">
              <ThemeBox />
            </Form.Item>
          </Col> */}
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