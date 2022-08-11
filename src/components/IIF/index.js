export default (props) => {
  const { test, children } = props;

  return test ? children : null;
};
