import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
export default (props) => {
  const { type, children, flexs, spans, style, bodyStyle, gutter } = props;
  const length = children?.length;
  const span = {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 8,
    xl: 6,
    xxl: 4,
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
        <Row wrap={false} style={style} gutter={gutter}>
          {React.Children.map(children, (child, index) => (
            <Col
              style={bodyStyle}
              {...(columnSpans && columnSpans.length >= index + 1
                ? { span: columnSpans[index] }
                : beFlex
                ? {}
                : span)}
              {...(columnFlexs && columnFlexs.length >= index + 1
                ? { flex: columnFlexs[index] }
                : {})}
            >
              {React.cloneElement(child)}
            </Col>
          ))}
        </Row>
      );
    } else if (type === 'vbox') {
      rui = (
        <>
          {React.Children.map(children, (child, index) => (
            <Row style={style} gutter={gutter}>
              <Col span={24} style={bodyStyle}>
                {React.cloneElement(child, { ...child.props })}
              </Col>
            </Row>
          ))}
        </>
      );
    } else if (type === 'fit') {
      rui = (
        <Row style={style} gutter={gutter}>
          {React.Children.map(children, (child, index) => (
            <Col
              style={bodyStyle}
              {...(columnSpans && columnSpans.length >= index + 1
                ? { span: columnSpans[index] }
                : beSpan
                ? { span: columnSpans[0] }
                : { ...span })}
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
  }, []);
  return ui;
};
