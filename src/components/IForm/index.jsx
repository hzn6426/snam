import { Form } from 'antd';
import React from 'react';

export default (props) => {
  const { size, children, ref, ...others } = props;
  const [form] = Form.useForm();

  const reset = () => {
    form.resetFields();
  };
  const validate = (callback, alwayscall) => {
    form
      .validateFields()
      .then((values) => {
        if (callback) {
          callback(values);
        }
      })
      .finally(() => {
        if (alwayscall) {
          alwayscall();
        }
      });
  };
  return (
    <Form form={form} size={size} {...others} ref={ref}>
      {children}
    </Form>
  );
};
