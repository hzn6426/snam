import React, { useState } from 'react';
import { setLocale } from 'umi';
import { Drawer, Form, Row, Col, Switch, Radio, Input } from 'antd';
import { SketchPicker } from 'react-color';
import * as R from 'ramda';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const [color, setColor] = useState({ primaryColor: props.settings.primaryColor });
  const [settingForm] = Form.useForm();

  const changeSettings = (v) => {
    let key = Object.keys(v)[0];
    let value = v[key];
    let n = R.assoc(key, value)(props.settings);
    if(key=="locale"){      
      setLocale(value, false);
      localStorage.setItem("umi-locale", value);
    }
    props.onSettingChange(n);
    localStorage.setItem("settings", JSON.stringify(n));
  }

  const closeDrawer = () => {
    props.closeDrawer();
  }

  const onColorChange = (nextColor) => {
    setColor(nextColor)
    settingForm.setFieldsValue(nextColor);
    changeSettings(nextColor);
  }

  return <Drawer
    title="系统设置"
    placement="right"
    width={320}
    closable={false}
    onClose={closeDrawer}
    visible={props.visible}
  >
    <Form
      form={settingForm}
      layout="horizontal"
      initialValues={props.settings}
      onValuesChange={changeSettings}
    >
      <Row>
        <Col span={24}>
          <Form.Item label="主题风格" name="navTheme" labelCol={{ span: 6 }} size="small">
            <Radio.Group buttonStyle="solid" size="small">
              <Radio.Button value="light">亮色</Radio.Button>
              <Radio.Button value="dark">暗色</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ display: 'none' }}>
        <Col span={12}>
          <Form.Item label="主 题 色" name="primaryColor" labelCol={{ span: 8 }}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <SketchPicker
            presetColors={['#1890FF', '#F5222D', '#FA541C', '#FAAD14', '#13C2C2', '#52C41A', '#2F54EB', '#722ED1','#8B572A','#808682']}
            color={color.primaryColor}
            disableAlpha={true}
            onChange={({ hex }) => {
              onColorChange({
                primaryColor: hex,
              });
            }}
            width={250}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Form.Item label="标签页" name="isTabs" labelCol={{ span: 6 }} valuePropName="checked">
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="导航模式" name="layout" labelCol={{ span: 6 }}>
            <Radio.Group buttonStyle="solid" size="small">
              <Radio.Button value="side">侧边</Radio.Button>
              <Radio.Button value="top">顶部</Radio.Button>
              <Radio.Button value="mix">混合</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      {/* <Row>
        <Col span={24}>
          <Form.Item label="宽度" name="contentWidth" labelCol={{ span: 6 }}>
            <Radio.Group buttonStyle="solid" size="small">
              <Radio.Button value="Fluid">适应</Radio.Button>
              <Radio.Button value="Fixed">定宽</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row> */}

      {/* <Row>
        <Col span={24}>
          <Form.Item label="语言" name="locale" labelCol={{ span: 6 }} initialValue={localStorage.getItem("umi-locale")}>
            <Radio.Group buttonStyle="solid" size="small">
              <Radio.Button value="zh-CN">中 文</Radio.Button>
              <Radio.Button value="en">ENGLISH</Radio.Button>
              <Radio.Button value="vi">Tiếng</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row> */}

    </Form>
  </Drawer>
};