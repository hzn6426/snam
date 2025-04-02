// import { useApplicationState } from "@/store/state";
import { ConditionType } from './channels';
import RootCondition from './root-condition';
const WrapRootCondition = props => {
    const { disabled = false, rootCondition = {}} = props;
  
    return (
      <RootCondition
        id={rootCondition.id}
        key={rootCondition.id}
        isRoot={true}
        disabled={false}
        data={rootCondition}
        isAndType={rootCondition.type === ConditionType.AND}
      />
    );
  };
  
  export default WrapRootCondition;
  