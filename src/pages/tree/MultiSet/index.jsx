import { isArray, mapObjIndexed,  produce } from '@/common/utils';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
} from 'antd';
import { useEffect, useState,useImperativeHandle } from 'react';
import { IFormItem } from '@/common/components';

import {  PlusCircleOutlined,CloseCircleOutlined
} from '@ant-design/icons';

export default React.forwardRef((props, ref) => {
  const [form] = Form.useForm();

  const {value} = props;

  const [ui, setUi] = useState([
   {column:'',value:''},
   {column:'',value:''}
  ]);

  // 条件
  const cdn = [
    { label: '等于', value: '=' },
  ];

  

//   const onGetValue = () => {
    
//     form.validateFields()
//       .then((values) => {
//         const arr = [];
//         mapObjIndexed((_, idx) => {
//             const p = variable + '.' + values['column' + idx];
//             const op = "=";
//             const v = values['value' + idx];
//             arr.push(p + op + v);
//         }, ui);
//       });
//       return arr;
//   }


  useImperativeHandle(ref, () => ({
    getUi:  () => {
        return ui;
    },
  }), [ui]);

  useEffect(() => {
    if (value) {
        setUi(value);
    }
  }, [value]);

  const onChange = (index, p, v) => {
    setUi(produce(ui, (draft) => {
        draft[index][p] = v;
    }));
  }

//   useEffect(() => {

//   },[ui])

  return (
    <>
        {/* <Form form={form} size='small' layout="horizontal" className="snam-form"> */}
          {ui.map((item, idex) => (
        
            <Row key={idex} gutter={2}>
              <Col span={9}>
               <IFormItem xtype="input" name={'column'+idex} label="属性"  required={true} size='small' 
               onBlur={(e) => {onChange(idex, 'column',e.target.value) }} />
                {console.log(item.column,item.value)
                /* <Form.Item
                  name={'column' + idex}
                  label="属性"
                  labelCol={{ span: 0 }}
                  wrapperCol={{ span: 24 }}
                  rules={[{ required: true, message: '' }]}
                >
                 <Input size='small'/>
                </Form.Item> */}
              </Col>
              <Col span={6}>
                <Form.Item
                  name={'condition'+idex}
                  label=""
                  labelCol={{ span: 0 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Select options={cdn} size='small' defaultValue="=" disabled={true} />
                </Form.Item>
              </Col>
              <Col span={9}>
                <Form.Item
                  name={'value'+idex}
                  label=""
                  labelCol={{ span: 0 }}
                  wrapperCol={{ span: 24 }}
                  rules={[{ required: true, message: '' }]}
                >
                  <Input size='small'  onBlur={(e) => {onChange(idex, 'value',e.target.value) }}/>
                </Form.Item>
              </Col>
            </Row>
          ))}

          <div style={{float:'right',  paddingright: '10px' }} key="bottom" >
            <Space>
            <Button
              key="add"
              size='small'
              htmlType="button"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                const rows = produce(ui, (draft) => {
                  draft.push({column:'',value:''});
                });
                setUi(rows);
              }}
            >
              添加一行
            </Button>
            <Button
              key="delete"
              danger
              icon={<CloseCircleOutlined />}
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
            </Space>
          </div>
        {/* </Form> */}

    </>
  );
});
