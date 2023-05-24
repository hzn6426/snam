import React, { useEffect, useState, useRef } from 'react';
import { Button, Form, Card, Space } from 'antd';
import { IFooterToolbar } from '@/common/components';
import { useWindowSize } from '@/common/utils';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';

export default (props) => {
    //窗口大小
    const { clientWidth, clientHeight } = useWindowSize();
    //modal初始值
    const [modalWidth, setModalWidth] = useState(props.width);
    const [modalHeight, setModalHeight] = useState(props.height);

    // Form 数据
    const [snamModalForm] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);


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

    return (
        <Card
            style={{
                height: clientHeight - 40 + 'px',
                overflow: 'auto',
                padding: '0 10px 10px 10px',
            }}
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
                {props.children}
            </Form>
            <IFooterToolbar
                visible={true}
            // style={{
            //     position: 'fixed',
            //     bottom: '1px',
            //     width: '100%',
            //     padding: '5px 0 5px 25px',
            //     background: '#f0f0f0',
            //     marginLeft: '-20px',
            // }}
            >
                <Space>
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
                    <Button
                        icon={<CloseOutlined />}
                        type="danger"
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
        </Card>
    );
};
