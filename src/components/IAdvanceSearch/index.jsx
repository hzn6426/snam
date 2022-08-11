import React, { useState, useEffect } from 'react';
import {
  Button,
  message,
  Form,
  Row,
  Col,
  Input,
  Select,
  Radio,
  DatePicker,
  InputNumber,
} from 'antd';
import moment from 'moment';
// import Port from '@/components/Port';
// import Customer from '@/components/Customer';
import IModal from '@/components/IModal';
// import User from '@/components/User';
// import UTAG from '@/constant/utag';
// import ShipCompany from '@/components/ShipCompany';
import produce from 'immer';
import * as R from 'ramda';
const AdvanceSearch = (props) => {
  //==================================================================//
  //searchColumns 格式为:[{ label: '拖车', value: 'T', xtype:'' }]
  //==================================================================//
  const { title, width, visible, onSubmit, onCancel, searchColumns, loading } = props;

  //根据value来进行分组以便获取对应的xtype
  const vtArr = R.groupBy((v) => v.value, searchColumns);

  // const defalutRow = row();
  const [ui, setUi] = useState([
    { component: <Input /> },
    { component: <Input /> },
    { component: <Input /> },
  ]);

  //逻辑连接
  const andOr = [
    { label: '且', value: 'AND' },
    { label: '或', value: 'OR' },
  ];
  //条件
  const cdn = [
    { label: '模糊', value: 'LIKE' },
    { label: '等于', value: 'EQ' },
    { label: '不等于', value: 'NEQ' },
    { label: '大于', value: 'GT' },
    { label: '大于等于', value: 'GTE' },
    { label: '小于', value: 'LT' },
    { label: '小于等于', value: 'LTE' },
  ];

  const dynamicChange = (value) => {
    const xtype = vtArr[value][0].xtype;
    const utag = vtArr[value][0].utag;
    const ctmType = vtArr[value][0].ctmType || [];
    const options = vtArr[value][0].opts || [];
    const target = {};
    let comp = <Input />;
    switch (xtype) {
      // case 'customer':
      //   comp = <Customer ctmType={ctmType} style={{ width: '100%' }} />;
      //   break;
      // case 'port':
      //   comp = <Port style={{ width: '100%' }} />;
      //   break;
      // case 'user':
      //   comp = <User style={{ width: '100%' }} Tag={utag} />;
      //   break;
      // case 'shipCompany':
      //   comp = <ShipCompany style={{ width: '100%' }} />;
      //   break;
      case 'date':
        target.dataType = 'date';
        comp = <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />;
        break;
      case 'datetime':
        target.dataType = 'date';
        comp = (
          <DatePicker
            format="YYYY-MM-DD HH:mm"
            showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
            style={{ width: '100%' }}
          />
        );
        break;
      case 'number':
        comp = <InputNumber style={{ width: '100%' }} />;
        break;
      case 'select':
        comp = <Select style={{ width: '100%' }} options={options} />;
        break;
      default:
        break;
    }
    target.component = comp;
    return target;
  };
  return (
    <>
      <IModal
        commitLoading={loading}
        title="高级查询"
        width="600px"
        bodyStyle={{ maxHeight: '250px', overflow: 'scroll' }}
        visible={visible}
        onCancel={() => {
          onCancel();
        }}
        onSubmit={(values) => {
          const arr = [];
          R.mapObjIndexed((_, idx) => {
            const v = {};
            v['andOr'] = values['andOr' + idx] || 'AND';
            v['column'] = values['column' + idx];
            v['condition'] = values['condition' + idx] || 'EQ';
            if (values['valuedate' + idx]) {
              v['value'] = values['valuedate' + idx];
              v['dataType'] = 'date';
            } else if (values['valuedatetime' + idx]) {
              v['value'] = values['valuedatetime' + idx];
              v['dataType'] = 'datetime';
            } else {
              v['value'] = values['value' + idx];
            }
            arr.push(v);
          }, ui);

          onSubmit(arr);
        }}
        addRowVisible={true}
        removeRowVisible={true}
        onAddRow={() => {
          const rows = produce(ui, (draft) => {
            draft.push(<Input />);
          });
          setUi(rows);
        }}
        onRemoveRow={() => {
          const rows = produce(ui, (draft) => {
            draft.splice(-1, 1);
          });
          setUi(rows);
        }}
      >
        {ui.map((item, idex) => (
          <Row key={idex} gutter={2}>
            <Col span={4}>
              <Form.Item
                name={'andOr' + idex}
                label=""
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                <Select options={andOr} defaultValue="AND" disabled={idex == 0} />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name={'column' + idex}
                label=""
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                <Select
                  options={searchColumns}
                  onChange={(v) => {
                    const comp = dynamicChange(v);
                    setUi(
                      produce(ui, (draft) => {
                        draft[idex] = comp;
                      }),
                    );
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                name={'condition' + idex}
                label=""
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                <Select options={cdn} defaultValue="EQ" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name={'value' + (item.dataType || '') + idex}
                label=""
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                {item.component}
              </Form.Item>
            </Col>
          </Row>
        ))}
      </IModal>
    </>
  );
};
export default AdvanceSearch;
