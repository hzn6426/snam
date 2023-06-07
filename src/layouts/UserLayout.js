import { constant } from '@/common/utils';
import { Helmet, HelmetProvider } from 'react-helmet-async';
// import logo from '../assets/logo.png';
import logo from '../assets/auth.svg';
import styles from './UserLayout.less';

const UserLayout = (props) => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>系统登录</title>
            </Helmet>

            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.top}>
                        <div className={styles.header}>
                            <img alt="logo" className={styles.logo} src={logo} />
                            <span className={styles.title}>{constant.SYSTEM_LOGIN_TITLE}</span>
                        </div>
                        <div className={styles.desc}>{constant.SYSTEM_LOGIN_DESC}</div>
                    </div>
                    {props.children}
                </div>
            </div>
        </HelmetProvider>
    );
};
export default UserLayout;