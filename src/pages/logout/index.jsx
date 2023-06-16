import { api, constant, isEmpty, md5 } from '@/common/utils';
import Language from '@/components/Layout/Language';
import { AntDesignOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Checkbox, Form, Input, Typography, message } from 'antd';
import { parse } from 'querystring';
import { useState } from 'react';
import { history, useIntl } from 'umi';
const { Title } = Typography;
const getPageQuery = () => parse(window.location.href.split('?')[1]);

export default (props) => {
    const { formatMessage } = useIntl(); //国际化
    const [loading, setLoading] = useState(false);

    //读取cookies
    const getCookie = (name) => {
        var arr,
            reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        if ((arr = document.cookie.match(reg))) return encodeURI(arr[2]);
        else return null;
    };

    const handleToken = (token) => {
        let itoken;
        if (!isEmpty(token)) {
            itoken = `Bearer ${token}`;
            sessionStorage.setItem(constant.KEY_USER_TOKEN, itoken);
        }
    };

    const handleRemeberMe = (values) => {
        const { userName, userPasswd, remember } = values;
        if (remember) {
            var exp = new Date();
            exp.setTime(exp.getTime() + 7 * 24 * 60 * 60 * 1000);
            document.cookie = 'userName=' + decodeURI(userName) + ';expires=' + exp.toGMTString();
            document.cookie = 'userPasswd=' + decodeURI(userPasswd) + ';expires=' + exp.toGMTString();
        } else {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            document.cookie = 'userName=;expires=' + exp.toGMTString();
            document.cookie = 'userPasswd=;expires=' + exp.toGMTString();
        }
    };

    const handleRedirect = () => {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        message.success(`${formatMessage({ id: 'message.login.success' })}`);
        localStorage.setItem('umi-locale', localStorage.getItem('umi-locale') || 'zh-CN');
        let { redirect } = params;
        let url = '/';
        if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
                redirect = redirect.substr(urlParams.origin.length);
                if (redirect.match(/^\/.*#/)) {
                    redirect = redirect.substr(redirect.indexOf('#') + 1);
                    url = redirect;
                }
            }
        }
        history.push(url);
    };

    const doFinish = (v) => {
        setLoading(true);
        v.systemTag = 'admin';
        v.userPasswd = md5(v.userPasswd);
        api.user.login(v).subscribe({
            next: (data) => {
                const resp = data[0];
                handleRemeberMe(v);
                handleToken(resp.access_token);
                handleRedirect();
                api.user.loadUserButtons().subscribe({
                    next: (br) => {
                        sessionStorage.setItem(constant.KEY_USER_BUTTON_PERMS, br || []);
                    }
                });

            }
        }).add(() => setLoading(false));
    }

    // const [doFinish] = useObservableAutoCallback((event) =>
    //   event.pipe(
    //     debounceTime(400),
    //     distinctUntilChanged(),
    //     tap(() => setLoading(true)),
    //     switchMap((v) => {
    //       v.systemTag = 'admin';
    //       v.userPasswd = md5(v.userPasswd);
    //       return api.user.login(v).pipe(tap(handleRemeberMe(v)));
    //     }),
    //     map((data) => data[0]),
    //     tap((v) => handleToken(v.access_token)),
    //     switchMap(() => {
    //       return api.user.loadUserButtons();
    //     }),
    //     tap((br) => sessionStorage.setItem(constant.KEY_USER_BUTTON_PERMS, br || [])),
    //     tap((v) => handleRedirect()),
    //     shareReplay(1),
    //   ), () => setLoading(false)
    // );

    return (
        <Card
            style={{
                width: 420,
                margin: '0 auto',
                top: 'calc(50% - 300px)',
                padding: '20px 30px 0',
                backgroundColor: 'rgba(255,255,255,0.8)',
                borderRadius: '15px',
            }}
        >
            <Title level={3}>
                <Avatar
                    size={36}
                    icon={<AntDesignOutlined />}
                    style={{ margin: '0 30px', background: '#1890ff' }}
                />
                {formatMessage({ id: 'login.loginTitle' })}
            </Title>
            <Form
                size="small"
                style={{ marginTop: '30px' }}
                initialValues={{
                    remember: getCookie('userName') ? true : false,
                    userName: getCookie('userName'),
                    userPasswd: getCookie('userPasswd'),
                }}
                onFinish={doFinish}
            >
                <Form.Item name="userName" rules={[{ required: true, message: false }]}>
                    <Input
                        prefix={<UserOutlined />}
                        type="text"
                        placeholder={formatMessage({ id: 'login.username' })}
                        size="large"
                    />
                </Form.Item>

                <Form.Item name="userPasswd" rules={[{ required: true, message: false }]}>
                    <Input
                        prefix={<LockOutlined />}
                        type="password"
                        placeholder={formatMessage({ id: 'login.password' })}
                        size="large"
                    />
                </Form.Item>

                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>{formatMessage({ id: 'login.rememberPassword' })}</Checkbox>
                    </Form.Item>
                    <a href="" style={{ float: 'right' }}>
                        {formatMessage({ id: 'login.forgotPassword' })}
                    </a>
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        shape="round"
                        style={{ width: '100%' }}
                        loading={loading}
                    >
                        {formatMessage({ id: 'login.loginBtn' })}
                    </Button>
                </Form.Item>
                <Form.Item style={{ margin: '0px' }}>
                    <Language onChange={(e) => { }} />
                </Form.Item>
            </Form>
        </Card >
    );
};
