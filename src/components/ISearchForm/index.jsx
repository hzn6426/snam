import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import IIF from '@/components/IIF';
// import AdvanceSearch from '@/components/IAdvanceSearch';
import { isFunction } from '@/common/utils';
import { For } from 'react-loops';
import './index.less';
import ILayout from '@/components/ILayout';
export default (props) => {
  const {
    children,
    showAdSearch = false,
    form,
    onSearch,
    onAdSearch,
    onReset,
    adSearchConfig,
  } = props;
  const [searchForm] = Form.useForm(form || null);
  const [expand, setExpand] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [adSearchVisible, setAdSearchVisible] = useState(false);
  const { clientWidth, clientHeight } = window?.document?.documentElement;
  const [tableHight, setTableHight] = useState(clientHeight - 332);
  const divRef = useRef();

  const span = {
    xs: 24,
    sm: 12,
    md: 8,
    lg: 6,
    xl: 4,
    xxl: 2,
  };
  useEffect(() => {
    var o = divRef.current;
    if (expand) {
      setTableHight(tableHight - o.offsetHeight + 44);
    } else {
      setTableHight(clientHeight - 332);
    }
  }, [expand]);

  const doSearch = () => {
    setSearchLoading(true);
    searchForm
      .validateFields()
      .then((values) => {
        if (isFunction(onSearch)) {
          onSearch(values);
        }
      })
      .finally(() => {
        setSearchLoading(false);
      });
  };

  const doAdSearch = (values) => {
    if (isFunction(onAdSearch)) {
      onAdSearch(values);
    }
  };

  const doReset = () => {
    searchForm.resetFields();
    if (isFunction(onReset)) {
      onReset();
    }
  };

  return (
    <>
      <div className={expand ? 'open' : 'close'} ref={divRef}>
        <Form form={searchForm} size="small" className="searchForm">
          <Row wrap={false} gutter={2}>
            <Col flex="auto">
              {/* <ILayout type="hbox">
                $
              </ILayout> */}
              <Row gutter={2}>
                <For of={children}>
                  {(child) => (
                    <Col xxl={4} lg={6} sm={8}>
                      {React.cloneElement(child, { labelCol: { flex: '65px' } })}
                    </Col>
                  )}
                </For>
              </Row>
            </Col>
            <Col flex="160px">
              <Form.Item>
                <Button type="default" key="reset" onClick={doReset}>
                  重置
                </Button>
                <Button
                  type="primary"
                  onClick={doSearch}
                  loading={searchLoading}
                  style={{ margin: '0 4px' }}
                  htmlType="submit"
                >
                  查询
                </Button>
                <IIF test={showAdSearch}>
                  <Button
                    type="primary"
                    onClick={() => setAdSearchVisible(true)}
                    style={{ margin: '0 4px' }}
                  >
                    高级查询
                  </Button>
                </IIF>
                <a
                  style={{ fontSize: 12 }}
                  onClick={() => {
                    setExpand(!expand);
                  }}
                >
                  {expand ? (
                    <>
                      {' '}
                      折叠 <UpOutlined />{' '}
                    </>
                  ) : (
                    <>
                      {' '}
                      展开 <DownOutlined />{' '}
                    </>
                  )}
                </a>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      {/* <AdvanceSearch
        loading={searchLoading}
        width="1000px"
        titile="高级查询"
        visible={adSearchVisible}
        onSubmit={(values) => {
          doAdSearch(values);
        }}
        searchColumns={adSearchConfig}
        onCancel={() => {
          setSearchVisible(false);
        }}
      /> */}
    </>
  );
};
