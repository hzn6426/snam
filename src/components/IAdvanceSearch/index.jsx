import { groupBy, isArray, mapObjIndexed, moment, produce } from '@/common/utils';
import Customer from '@/components/Customer';
import Port from '@/components/Port';
import User from '@/components/User';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd';
import { useEffect, useState } from 'react';

const AdvanceSearch = (props) => {
  // ==================================================================//
  // searchColumns 格式为:[{ label: '拖车', value: 'T', xtype:'' }]
  // ==================================================================//
  const { onChange, searchColumns, size, table, alias, value } = props;
  const [form] = Form.useForm();
  // 根据value来进行分组以便获取对应的xtype
  const vtArr = groupBy((v) => v.value, searchColumns);

  // const defalutRow = row();
  const [ui, setUi] = useState([
    { component: <Input /> },
    { component: <Input /> },
    { component: <Input /> },
  ]);

  // 逻辑连接
  const andOr = [
    { label: '且', value: 'AND' },
    { label: '或', value: 'OR' },
  ];
  // 条件
  const cdn = [
    { label: '模糊', value: 'LIKE' },
    { label: '等于', value: 'EQ' },
    { label: '不等于', value: 'NEQ' },
    { label: '大于', value: 'GT' },
    { label: '大于等于', value: 'GTE' },
    { label: '小于', value: 'LT' },
    { label: '小于等于', value: 'LTE' },
    { label: '包含', value: 'IN' },
    { label: '不包含', value: 'NIN' },
  ];



  const onFormChange = () => {
    form.validateFields()
      .then((values) => {
        const arr = [];
        mapObjIndexed((_, idx) => {
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
        const rvalue = { tableName: table, aliasName: alias, express: arr };
        onChange && onChange(rvalue);
      });

  }

  const getCompByXtype = (xtype, ctmType, utag, options) => {
    let comp = <Input onChange={onFormChange} />;
    if (!xtype) {
      return comp;
    }
    switch (xtype) {
      case 'customer':
        comp = <Customer ctmType={ctmType} style={{ width: '100%' }} />;
        break;
      case 'port':
        comp = <Port style={{ width: '100%' }} />;
        break;
      case 'user':
        comp = <User style={{ width: '100%' }} Tag={utag} />;
        break;
      case 'date':

        comp = <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} onChange={onFormChange} />;
        break;
      case 'datetime':

        comp = (
          <DatePicker
            format="YYYY-MM-DD HH:mm"
            showTime={{ defaultValue: moment('00:00', 'HH:mm') }}
            style={{ width: '100%' }}
            onChange={onFormChange}
          />
        );
        break;
      case 'number':
        comp = <InputNumber style={{ width: '100%' }} onChange={onFormChange} />;
        break;
      case 'select':
        comp = <Select style={{ width: '100%' }} options={options} onChange={onFormChange} />;
        break;
      default:
        break;
    }
    return comp;
  }

  const loadExpress = (value) => {
    const formValue = {};
    const comp = [];
    value = value || [];
    value.map((item, index) => {
      const type = item.dataType || '';
      const beDate = type === 'date' || type === 'datetime';
      formValue['andOr' + index] = item['andOr'];
      formValue['condition' + index] = item['condition'];

      formValue['value' + type + index] = beDate ? moment(item['value']) : item['value'];
      formValue['column' + index] = item['column'];
      const component = getCompByXtype(type);
      comp.push({ component: component, dataType: type });
    });
    setUi(comp);
    form.setFieldsValue(formValue);
  }


  const dynamicChange = (value) => {
    const xtype = vtArr[value][0].xtype;
    const utag = vtArr[value][0].utag;
    const ctmType = vtArr[value][0].ctmType || [];
    const options = vtArr[value][0].opts || [];
    const target = {};
    if (xtype === 'date' || xtype === 'datetime') {
      target.dataType = 'date';
    }
    const comp = getCompByXtype(xtype, ctmType, utag, options);
    target.component = comp;
    return target;
  };

  useEffect(() => {
    if (value && isArray(value)) {
      loadExpress(value);
    }
  }, [value]);

  useEffect(() => {
    onFormChange();
  }, [ui])
  return (
    <>
      <Card
        // commitLoading={loading}
        // title="高级查询"
        // width="600px"
        size={size}
        bordered={false}
        bodyStyle={{ maxHeight: '250px', overflow: 'scroll' }}
      // visible={visible}
      >
        <Form form={form} size='small' layout="horizontal" className="snam-form">
          {ui.map((item, idex) => (
            <Row key={idex} gutter={2}>
              <Col span={4}>
                <Form.Item
                  name={'andOr' + idex}
                  label=""
                  labelCol={{ span: 0 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select options={andOr} defaultValue="AND" disabled={idex == 0} onChange={onFormChange} />
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
                      onFormChange();
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

          <div style={{ float: 'right', paddingRight: '10px' }} key="bottom">
            <Button
              key="add"
              size='small'
              htmlType="button"
              onClick={() => {
                const rows = produce(ui, (draft) => {
                  draft.push(<Input />);
                });
                setUi(rows);
              }}
              style={{ marginRight: '10px' }}
            >
              添加一行
            </Button>

            <Button
              key="submit"
              type="danger"
              size='small'
              onClick={() => {
                const rows = produce(ui, (draft) => {
                  draft.splice(-1, 1);
                });
                setUi(rows);
              }}
            >
              删除一行
            </Button>
          </div>
        </Form>

      </Card>
    </>
  );
};
export default AdvanceSearch;
