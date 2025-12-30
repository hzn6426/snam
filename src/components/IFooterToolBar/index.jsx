import { FooterToolbar } from '@ant-design/pro-layout';
import IIF from '@/components/IIF';
import './index.less'; // 引入样式文件

export default (props) => {
  const { visible, children, ...others } = props;
  const show = visible === false ? false : true;
  return (
    <IIF test={show}>
      <FooterToolbar {...others}>{children}</FooterToolbar>
    </IIF>
  );
};