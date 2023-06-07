import { api, constant, isEmpty, md5 } from '@/common/utils';
import { LockTwoTone, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Form, Input, Typography, message } from 'antd';
import { parse } from 'querystring';
import { useState } from 'react';
import { history, useIntl } from 'umi';
import styles from './index.less';
const { Title } = Typography;
const getPageQuery = () => parse(window.location.href.split('?')[1]);

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);
export default (props) => {
  const { formatMessage } = useIntl(); //国际化
  const [loading, setLoading] = useState(false);
  //读取cookies
  const getCookie = (name) => {
    var arr,
      reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
    else return null;
  };

  // Form 数据
  const [form] = Form.useForm();
  const [checked, setChecked] = useState(getCookie(constant.SYSTEM_AVATAR_NAME + 'userPasswd') ? true : false);
  const [userName, setUserName] = useState(getCookie(constant.SYSTEM_AVATAR_NAME + 'userName'));
  const [userPasswd, setUserPasswd] = useState(getCookie(constant.SYSTEM_AVATAR_NAME + 'userPasswd'));
  const [errorMessage, setErrorMessage] = useState('');
  const [beError, setBeError] = useState(false);



  const handleToken = (token) => {
    let itoken;
    if (!isEmpty(token)) {
      itoken = `Bearer ${token}`;
      sessionStorage.setItem(constant.KEY_USER_TOKEN, itoken);
    }
  };

  const handleRemeberMe = (values) => {
    const { userName, userPasswd, autoLogin, groupId } = values;
    var exp = new Date();
    exp.setTime(exp.getTime() + 7 * 24 * 60 * 60 * 1000);
    document.cookie = constant.SYSTEM_AVATAR_NAME + 'userName=' + escape(userName) + ';expires=' + exp.toGMTString();
    if (autoLogin) {
      document.cookie = constant.SYSTEM_AVATAR_NAME + 'userPasswd' + "=" + escape(values.originPassword) + ";expires=" + exp.toGMTString();
    } else {
      exp.setTime(exp.getTime() - 1);
      document.cookie = constant.SYSTEM_AVATAR_NAME + 'userPasswd' + "=" + escape('') + ";expires=" + exp.toGMTString();
    }
  };

  const handleRedirect = () => {
    const urlParams = new URL(window.location.href);
    const params = getPageQuery();
    message.success('登录成功');
    // localStorage.setItem('umi-locale', localStorage.getItem('umi-locale') || 'zh-CN');
    let { redirect } = params;
    let url = '/dashboard/workplace';
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

  // const loadUserGroups = () => {
  //   const v = form.getFieldsValue();
  //   if (!v.userName || !v.userPasswd) {
  //     return;
  //   }
  //   v.userPasswd = md5(v.userPasswd);
  //   api.user.validateUserForDepartments(v).subscribe({
  //     next: (res) => {
  //       const code = res.code;
  //       if (code != 200) {
  //         setBeError(true);
  //         setErrorMessage(res.message);
  //         return;
  //       } else {
  //         setBeError(false);
  //         setErrorMessage('');
  //       }
  //       let groups = res.data;
  //       let deptId;
  //       const list = [];
  //       forEach((v) => {
  //         if (!deptId) {
  //           deptId = v.groupId;
  //         }
  //         let companyName = v.companyName;
  //         if (isNil(companyName)) {
  //           companyName = '';
  //         }
  //         list.push({ label: (companyName && (companyName + '-')) + v.groupName, value: v.groupId });
  //       }, groups);
  //       setOptions(list);
  //       form.setFieldsValue({ groupId: deptId });
  //     }
  //   });
  // }
  // const delayedQuery = useRef(debounce(() => loadUserGroups(), 200)).current;

  const doFinish = (v) => {
    setLoading(true);
    v.systemTag = 'admin';
    v.userPasswd = md5(v.userPasswd);
    v.originPassword = v.userPasswd
    api.user.login(v, v.systemTag).subscribe({
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
    <div className={styles.main}>
      <Form
        name="basic"
        initialValues={{
          autoLogin: checked,
          userName: userName,
          userPasswd: userPasswd,
        }}
        autoComplete="off"
        className="snam-form"
        form={form}
        onFinish={(values) => {
          // objectAssign(values, { userPasswd: md5(values.userPasswd), originPassword: values.userPasswd });
          // values.systemTag = 'business' + values.groupId;
          doFinish(values);
        }}
      >
        {beError && (
          <LoginMessage
            content={errorMessage}
          />)}
        <Form.Item name="userName" label="账号" rules={[
          {
            required: true,
            message: '请输入账号!'
          },
        ]}>
          <Input
            autoFocus={true}
            // onBlur={delayedQuery}
            prefix={<UserOutlined className={styles.prefixIcon} />}
            placeholder="请输入账号"
          />
        </Form.Item>
        <Form.Item name="userPasswd" label="密码" rules={[
          {
            required: true,
            message: '请输入密码！'
          },
        ]}>
          <Input.Password
            // onBlur={delayedQuery}
            prefix={<LockTwoTone className={styles.prefixIcon} />}
            placeholder="请输入密码"
          />
        </Form.Item>
        {/* <Form.Item name="groupId" label="组织" rules={[{ required: true, message: "请选择组织!" }]}>
          <Select
            options={options}
            prefix={<ApartmentOutlined />}
            placeholder="请选择组织"
          />
        </Form.Item> */}
        <div style={{ marginLeft: '54px', marginBottom: '30px' }}>
          <Form.Item name="autoLogin" valuePropName="checked" noStyle >
            <Checkbox>记住密码</Checkbox>
          </Form.Item>
        </div>
        <div style={{ marginLeft: '54px' }}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              shape="round"
              style={{ width: '200px' }}
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};
