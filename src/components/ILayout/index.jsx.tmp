import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
export default (props) => {
  const { type, children, flexs, spans, style, bodyStyle, gutter } = props || {};
  const length = children?.length;
  const span = {
    xs: 24,
    sm: 12,
    md: 12,
    lg: 8,
    xl: 8,
    xxl: 6,
  };
  const [ui, setUi] = useState([]);
  const renderUI = () => {
    let rui;
    const columnSpans = spans && spans.split(' ');
    const columnFlexs = flexs && flexs.split(' ');
    const beSpan = columnSpans && columnSpans.length > 0;
    const beFlex = columnFlexs && columnFlexs.length > 0;
    
    if (type === 'hbox') {
      rui = (
        <Row wrap={false} style={style || false } gutter={gutter}>
          {children && React.Children.map(children, (child, index) => child && (
            <Col
              style={bodyStyle || false}
              {...(columnSpans && columnSpans.length >= index + 1
                ? { span: columnSpans[index] }
                : beFlex
                ? {}
                : span)}
              {...(columnFlexs && columnFlexs.length >= index + 1
                ? { flex: columnFlexs[index] }
                : {})}
            >
              {React.cloneElement(child, { ...(child.props || {}) })}
            </Col>
          ))}
        </Row>
      );
    } else if (type === 'vbox') {
      rui = (
        <>
          {children && React.Children.map(children, (child, index) => (
            <Row style={style || false} gutter={gutter}>
              <Col span={24} style={bodyStyle || false}>
                {React.cloneElement(child, { ...(child.props || {}) })}
              </Col>
            </Row>
          ))}
        </>
      );
    } else if (type === 'fit') {
      rui = (
        <Row style={style || false} gutter={gutter}>
          {children && React.Children.map(children, (child, index) => (
            <Col
              style={bodyStyle || false}
              {...(columnSpans && columnSpans.length >= index + 1
                ? { span: columnSpans[index] }
                : beSpan
                ? { span: columnSpans[0] }
                : span)}
              {...(columnFlexs && columnFlexs.length >= index + 1
                ? { flex: columnFlexs[index] }
                : beFlex
                ? { flex: columnFlexs[0] }
                : {})}
            >
              {React.cloneElement(child)}
            </Col>
          ))}
        </Row>
      );
    }
    setUi(rui);
  };

  useEffect(() => {
    renderUI();
  }, [props]);
  return ui;
};
