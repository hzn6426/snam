import { IFormItem, ILayout, IWindow } from '@/common/components';
import { api, constant, data2Option, isArray, split, useAutoObservable } from '@/common/utils';
import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { filter, map, switchMap } from 'rxjs/operators';
import { useParams } from 'umi';


export default (props) => {
    const ref = useRef();
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [multiLogin, setMultiLogin] = useState(false);
    // const [current, setCurrent] = useState({});

    const [current, setCurrent] = useAutoObservable((inputs$) =>
        inputs$.pipe(
            map(([id]) => id),
            filter(id => id !== 'ADD'),
            switchMap((id) => api.user.getUser(id)),
            map((t1) => {
                const user = t1[0]
                if (user.beMultiLogin === true) {
                    user.loginMode = 'SHARED';
                } else {
                    user.loginMode = 'SINGLE';
                }
                if (user.userTag && isArray(user.userTag)) {
                    user.userTag = split(user.userTag, ',');
                }
                return user;
            })
        ),
        [params.id],
    )

    const onSaveClick = (user) => {
        setLoading(true);
        user.beMultiLogin = user.loginMode === 'SHARED' ? true : false;
        user.userTag = user.userTag && user.userTag.join(',');
        api.user.saveOrUpdateUser(user).subscribe({
            next: () => {
                message.success('操作成功!');
                window.close();
                window.opener.onSuccess();
            }
        }).add(() => setLoading(false));
    };

    const loadUserTags = () => {
        api.dict.listChildByParentCode(constant.DICT_USER_BUSINEESS_TAG).subscribe({
            next: (t2) => {
                const dicts = data2Option('dictCode', 'dictName', t2);
                setOptions(dicts);
            }
        });
    }

    useEffect(() => {
        loadUserTags();
    }, []);

    return (
        <IWindow
            ref={ref}
            current={current}
            className="snam-modal"
            title={(current && current.id) ? '编辑用户' : '新建用户'}
            width={clientWidth}
            height={clientHeight}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="id" />
            <ILayout type="hbox" spans="12 12">
                <IFormItem
                    disabled={current && current.id}
                    name="userName"
                    label="账号"
                    xtype="input"
                    tooltip="最长为20位,保存后不可更改"
                    //preserve={false}
                    required={true}
                    max={20}
                />
            </ILayout>
            <ILayout type="hbox" spans="12 12">
                <IFormItem name="userRealCnName" label="中文名" xtype="input" required={true} max={20} />
                <IFormItem
                    name="userRealEnName"
                    label="英文名"
                    xtype="input"
                    //required={true}
                    max={20}
                />
            </ILayout>
            <ILayout type="hbox" spans="12 12">
                <IFormItem
                    name="userSex"
                    label="性别"
                    initialValue="男"
                    required={true}
                    options={[
                        {
                            label: '男',
                            value: '男',
                        },
                        {
                            label: '女',
                            value: '女',
                        },
                        {
                            label: '保密',
                            value: '保密',
                        },
                    ]}
                    xtype="radio"
                />
                <IFormItem name="qq" label="QQ" xtype="input" max={20} />
            </ILayout>
            <ILayout type="hbox" spans="12 12">
                <IFormItem
                    name="userMobile"
                    label="手机"
                    xtype="input"
                    required={true}
                    max={20}
                    regexp="/^1[3456789]d{9}$/"
                />

                <IFormItem
                    name="userEmail"
                    label="邮箱"
                    xtype="input"
                    tooltip="激活后密码将发送到该邮箱"
                    required={true}
                    max={50}
                    ruleType="email"
                />
            </ILayout>
            <ILayout type="hbox" spans="12 12">
                <IFormItem label="登录模式" name="loginMode" xtype="select" options={[{ label: '共享登录', value: 'SHARED' }, { label: '单点登录', value: 'SINGLE' }]} tooltip="共享登录为账号可以同时登录,单点登录为账号同一时间同一系统只能登录一个" />
                <IFormItem label="过期策略" name="expirePolicy" xtype="select" options={[{ label: '固定时间', value: 'FIXED' }, { label: '最后活跃', value: 'LAST_ACTIVE' }]} tooltip="固定时间为:登录后经过固定的过期时间必须重新登录,最后活跃为最后一次操作后经过过期时间才会过期" />
            </ILayout>
            <ILayout type="hbox" spans="24">
                <IFormItem name="userTag" label="用户属性" xtype="checkbox" options={options} />
            </ILayout>
            <ILayout type="hbox" spans="24">
                <IFormItem
                    name="note"
                    label="备注说明"
                    xtype="textarea"
                    max={100}
                    autoSize={{ minRows: 4, maxRows: 6 }}
                />
            </ILayout>
        </IWindow>
    )
}