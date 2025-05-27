import { ApplicationStateProvider } from '@/store/state';
const BlankLayout = (props) => {
    return (<>
        
        <ApplicationStateProvider>
            {props.children}
              
       </ApplicationStateProvider>
        </>
    );
};
export default BlankLayout;