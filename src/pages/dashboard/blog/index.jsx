import React from 'react';
import { Typography, Card, Timeline } from 'antd';
const { Title, Paragraph, Text } = Typography;

export default () => {
  const { clientHeight } = window?.document?.documentElement;
  return (
    <>
      <Card bodyStyle={{ overflow: 'auto', height: clientHeight - 70 + 'px', margin: '10px 0px' }}>
        <Timeline>
          <Timeline.Item>
            <Title level={4}>CRM客户管理、操作管理、财务管理</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>客户管理协议信息新增同步相关业务结算信息；</li>
                <li>操作、销售提单基本信息新增应结日期;</li>
                <li>
                  操作海运出口费用新增查询明细，核销、结算、付费申请、发票、发票申请、对账信息
                </li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              页面、功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化分票信息汇总的件重尺信息，保留三位小数;</li>
                <li>修改费用引入匹配，新增忽略计费单位;</li>
                <li>优化CRM客户管理协议信息,新增间隔月份；</li>
                <li>优化订舱出号、提单信息更新，提单新增应结日期计算；</li>
                <li>优化海运出口业务保存、锁定,新增应结日期计算;</li>
                <li>优化修改财务收付费结算、CZF核销、冲抵费用核销费用结算日期;</li>
                <li>优化收费结算、付费结算新增提单号、业务编号查询;</li>
                <li>优化修改提成统计资占费、财务费用计算方式;</li>
                <li>优化提成统计查询，新增实际结算日期查询;</li>
                <li>优化列表页高度信息;</li>
                <li>优化客户、船公司、船名、港口查询组件，输入后可全选、并默认选中第一条数据</li>
              </ul>
            </Paragraph>
            <Text>2022-07-22</Text>
          </Timeline.Item>
        </Timeline>
      </Card>
    </>
  );
};
