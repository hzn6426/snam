import { ApplicationStateProvider } from "@/store/state";
const StateLayout = (props) => {
    return (<ApplicationStateProvider>{props.children}</ApplicationStateProvider>)
}
export default StateLayout;