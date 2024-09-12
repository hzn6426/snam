import { useState, useEffect } from "react";
import { Form, Row, Col, Button, message, Checkbox, Card } from 'antd';
import { OrderedListOutlined } from '@ant-design/icons';
import DragModal from '@/components/DragModal';
import Container from "./Container.jsx";
import { IFor } from '@/common/components.js';
import './index.less';
import objectAssign from 'object-assign';
import moment from 'moment';
import { isArray, isFunction } from "@/common/utils.js";
import { IIF } from '@/common/components';

export default (props) => {
    const {
        form,
        searchName,
        initSearchParam,
        children,
        onSearch,
        onReset,
    } = props;
    const [params, setParams] = useState([]);
    const [dragItems, setDragItems] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false); // 设置
    const [searchForm] = Form.useForm(form || null);
    const [searchChecked, setSearchChecked] = useState(false);
    const localPrefix = 'Search_'; // localStorage 前缀


    useEffect(() => {
        let beSaveSearch = localStorage.getItem(localPrefix + 'search_' + searchName);
        setSearchChecked(beSaveSearch == 'true');
        if (beSaveSearch == 'true') {
            let searchV = localStorage.getItem(localPrefix + 'searchData_' + searchName);
            let searchData = JSON.parse(searchV);
            //   objectAssign(searchData, {
            //     atdStart: searchData?.atdStart ? moment(searchData?.atdStart) : '',
            //     atdEnd: searchData?.atdEnd ? moment(searchData?.atdEnd) : '',
            //     financeDateStart: searchData?.financeDateStart ? moment(searchData?.financeDateStart) : '',
            //     financeDateEnd: searchData?.financeDateEnd ? moment(searchData?.financeDateEnd) : '',
            //   });
            searchV && searchForm.setFieldsValue(searchData);
            if (isFunction(initSearchParam)) {
                initSearchParam(searchData);
            }
            //   props.initSearchParam && props.initSearchParam(searchData);
        }
    }, []);

    useEffect(() => {
        let localData = JSON.parse(localStorage.getItem(localPrefix + searchName));
        if (localData) {
            // 原始            
            let originalItems = children;

            let dragLists = []; // 自定义表单
            let searchList = []; // 展示表单

            localData.forEach((item) => {
                let tempNode = originalItems.filter(element => element.props.name == item.id)[0];//查找节点
                originalItems = originalItems.filter(element => element.props.name != item.id);// 删除节点
                if (tempNode) {
                    searchList.push(tempNode);
                    dragLists.push({ "id": tempNode.props.name, "text": tempNode.props.label })
                }
            })

            originalItems.forEach((item) => {
                dragLists.push({ "id": item.props.name, "text": item.props.label })
            });

            setParams(searchList);
            setDragItems(dragLists);
        } else {
            setParams(children);
            let items = [];
            let childrenArray = [];
            if (!isArray(children)) {
                childrenArray = [children];
            } else {
                childrenArray = children;
            }
            childrenArray.forEach(element => {
                items.push({ "id": element.props.name, "text": element.props.label })
            });
            setDragItems(items);
        }
    }, [isModalVisible])

    const doFinish = (values) => {
        if (searchChecked) {
            let searchData = searchForm.getFieldValue();
            localStorage.setItem(localPrefix + 'searchData_' + searchName, JSON.stringify(searchData));
        }
        if (isFunction(onSearch)) {
            onSearch(values);
        }
        // props.onSearch && props.onSearch(values);
    };
    const doReset = () => {
        searchForm.resetFields();
        if (isFunction(onReset)) {
            onReset();
        }
    };

    const onChangeSearch = (e) => {
        localStorage.setItem(localPrefix + 'search_' + props.searchName, e.target.checked);
        setSearchChecked(e.target.checked);
        if (e.target.checked) {
            let searchData = searchForm.getFieldValue();
            localStorage.setItem(localPrefix + 'searchData_' + props.searchName, JSON.stringify(searchData));
        }
    };

    const openModal = () => {
        setIsModalVisible(true);
    }

    const closeModal = () => {
        setIsModalVisible(false);
    }

    const handleOk = () => {
        message.success("保存成功！")
        localStorage.setItem(localPrefix + props.searchName, JSON.stringify(dragItems));
        setIsModalVisible(false);
    }

    const onChange = (data) => {
        setDragItems(data);
    }

    return (<>
        {/* <Card bodyStyle={{ paddingBottom: 0, border: 0 }}> */}
        <div style={{ padding: '0px', height: props.rows && props.rows >= 1 ? (props.rows - 2) * 35 + 60 : 60, overflow: 'hidden', margin: '0 10px 15px 10px' }}>
            <Form size="small" className='snam-form' onFinish={doFinish} form={searchForm}>
                <Row wrap={false} gutter={8}>
                    <Col flex="auto" style={{ marginRight: '10px' }}>
                        <Row>
                            <IFor of={params}>
                                {(child) => (
                                    <Col span={4}>
                                        {React.cloneElement(child, { labelCol: { flex: '80px' } })}
                                    </Col>
                                )}
                            </IFor>
                            {/* {params.map((element, i) => <Col span={4} key={i}>{element}</Col>)} */}
                        </Row>
                    </Col>
                    <Col flex="140px">
                        <Row>
                            <Button type="default" key="reset" onClick={doReset}>
                                重置
                            </Button>
                            <Button type="primary" style={{ margin: '0 8px' }} htmlType="submit">
                                查询
                            </Button>
                        </Row>
                        {/* <IIF test={props.showExtra == true ? true : false}> */}
                        <Form.Item>
                            <Checkbox checked={searchChecked} onChange={onChangeSearch}>记忆查询</Checkbox>
                            <Button type="text" style={{ margin: '10px 8px' }} icon={<OrderedListOutlined />} onClick={openModal} />
                        </Form.Item>
                        {/* </IIF> */}
                    </Col>
                </Row>
            </Form>
        </div>
        {/* </Card> */}

        <DragModal
            title="自定义查询条件"
            width={800}
            maskClosable={false}
            open={isModalVisible}
            onOk={handleOk}
            onCancel={closeModal}
            bodyStyle={{ padding: '20px 0px 20px 10px', height: '300px', overflow: 'auto' }}
        >
            <Container items={dragItems} onChange={(data) => onChange(data)} />
        </DragModal>

    </>)
}