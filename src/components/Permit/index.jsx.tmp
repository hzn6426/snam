import { constant } from '@/common/utils';

const Permit = (props) => {
  const check = (id) => {
    const buttons = sessionStorage.getItem(constant.KEY_USER_BUTTON_PERMS);
    return buttons && buttons.includes(id);
  };

  const { authority, children } = props;
  return check(authority) ? { ...children } : null;
};

export default Permit;
