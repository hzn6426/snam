import { ApplicationStateProvider } from '@/store/state';
import ProMainLayout from './ProMainLayout';
import { Outlet } from '@umijs/max';
import { AliveScope } from 'react-activation';

export default (props) => {
  return (
    <ApplicationStateProvider>
      <AliveScope>
      <ProMainLayout {...props}>
        <Outlet />
      </ProMainLayout>
      </AliveScope>
    </ApplicationStateProvider>
  );
};