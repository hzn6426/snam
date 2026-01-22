import { ConfigProvider } from 'antd';
import { ApplicationStateProvider } from '@/store/state';
import ProMainLayout from './ProMainLayout';
import { Outlet } from '@umijs/max';

export default (props) => {
  return (
    <ApplicationStateProvider>
      <ProMainLayout {...props}>
        <Outlet />
      </ProMainLayout>
    </ApplicationStateProvider>
  );
};