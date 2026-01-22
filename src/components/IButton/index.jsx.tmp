import { useState } from 'react';
import Button from "antd-button-color";
import 'antd-button-color/dist/css/style.css';
export default (props) => {
    const { icon, ...others } = props;
    const style = { marginRight: '-8px' };
    const iconProps = icon && React.cloneElement(icon, { style: { marginRight: '-8px' } })
    return <Button {...others} icon={iconProps || {}} />
}