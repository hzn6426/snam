import { IFooterToolbar, IIF } from '@/common/components';
import { useWindowSize } from '@/common/utils';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Form, Space } from 'antd';
import React, { useEffect, useState,useImperativeHandle } from 'react';
export default React.forwardRef((props, ref) => {
    const { saveVisible } = props;
    //窗口大小
    const { clientWidth, clientHeight } = useWindowSize();
    //modal初始值
    const [modalWidth, setModalWidth] = useState(props.width);
    const [modalHeight, setModalHeight] = useState(props.height);

    // Form 数据
    const [snamModalForm] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);

    useImperativeHandle(ref, () => ({
        setFieldsValue: (params) => {
          // 这里可以加自己的逻辑哦
          snamModalForm.setFieldValue(params);
        },
        getFieldsValue: () => {
          return snamModalForm.getFieldsValue();
        },
      }), []);

    useEffect(() => {
        snamModalForm.resetFields();
        if (props.current) {
            snamModalForm.setFieldsValue({
                ...props.current,
            });
        }
    }, [props.visible, props.current]);

    const load = () => setConfirmLoading(true);
    const unload = () => setConfirmLoading(false);
    const doSubmit = async () => {
        load();
        snamModalForm
            .validateFields()
            .then((values) => {
                const params = { ...values };
                props.onSubmit(params);
                unload();
            })
            .catch(() => unload());
    };

    return (<Card
        style={{
            height: clientHeight - 0 + 'px',
            overflow: 'auto',
            padding: '0 10px 10px 10px',
            borderRadius: '0px',
        }}
        className="iwindow-card"
    >
        <Form
            name="basic"
            initialValues={{ remember: true }}
            autoComplete="off"
            size="small"
            className="snam-form"
            scrollToFirstError={true}
            form={snamModalForm}
        >
            <>{props.children}</>
        </Form>
        <IFooterToolbar
            visible={true}
        >
            <Space>
                <IIF test={saveVisible !== false}>
                    <Button
                        icon={<SaveOutlined />}
                        type="primary"
                        htmlType="submit"
                        loading={confirmLoading}
                        onClick={() => {
                            doSubmit();
                        }}
                    >
                        保存
                    </Button>
                </IIF>
                <Button
                    icon={<CloseOutlined />}
                    danger
                    htmlType="submit"
                    loading={confirmLoading}
                    onClick={() => {
                        props.onCancel();
                    }}
                >
                    关闭
                </Button>
            </Space>
        </IFooterToolbar>
    </Card>);
});
