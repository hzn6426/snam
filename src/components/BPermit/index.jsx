import { constant, split } from '@/common/utils';

const BPermit = (props) => {
  const check = (id) => {
    const buttons = sessionStorage.getItem(constant.KEY_USER_RESOURCE_PERMS);
    if (!buttons) {
      return false;
    }
    const filters = split(buttons,',').filter(x => x === id);
    return filters.length > 0;
  };

  const { authority, children } = props;
  return check(authority) ? { ...children } : (props.noAuthDesc || null);
};

export default BPermit;
