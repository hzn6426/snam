import { IIF, IStatus, IWindow } from '@/common/components';
import { api, dateFormat, useAutoObservable } from '@/common/utils';
import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from '@uiw/react-codemirror';
import { Descriptions } from 'antd';
import { EditorView } from "codemirror";
import { useRef, useState } from 'react';
import { filter, map, switchMap } from 'rxjs/operators';
import { useParams } from 'umi';


export default (props) => {

    const [settings, setSettings] = useState(localStorage.getItem("settings") == null ? {} : localStorage.getItem("settings"));

    const ref = useRef();
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useAutoObservable((inputs$) =>
        inputs$.pipe(
            map(([id]) => id),
            filter(id => id !== 'ADD'),
            switchMap((id) => api.logger.getLogger(id)),
            map((role) => {
                return role[0];
            })
        ),
        [params.id],
    )

    const loggerState = {
        FAILURE: { text: '失败', status: 'Error' },
        SUCCESS: { text: '成功', status: 'Success' },
    };

    const sourceFrom = (text) => {
        if (text) {
            if (text.startsWith('business')) {
                return '业务端';
            } else if (text.startsWith('app')) {
                return 'APP';
            } else if (text.startsWith('admin')) {
                return '授权端';
            } else if (text.startsWith('temp')) {
                return '临时端';
            } else {
                return '其他';
            }
        }
        return '';
    }


    return (
        <IWindow
            ref={ref}
            current={current}
            className="snam-modal"
            title={(current && current.id) ? '编辑角色' : '新建角色'}
            width={clientWidth}
            height={clientHeight}
            saveVisible={false}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <Descriptions size='small' bordered>

                <Descriptions.Item label="请求" span={24}>
                    {dateFormat(current.exchangeTime, 'yyyy-MM-dd hh:mm:ss')} {current.exchangeMethod}  {current.exchangeUrl}
                </Descriptions.Item>
                <Descriptions.Item label="状态" span={24}>
                    <IStatus value={current.state} state={loggerState} /> 耗时:{current.executeTimer}秒
                </Descriptions.Item>

                <Descriptions.Item label="操作人" span={1}>
                    {current.createUserCnName} {current.ipAddress}
                </Descriptions.Item>
                <Descriptions.Item label="浏览器信息" span={2}>
                    {current.os}-{current.browser}
                </Descriptions.Item>
                <Descriptions.Item label="来源系统" span={1}>
                    {sourceFrom(current.systemTag)}
                </Descriptions.Item>
                <Descriptions.Item label="日志类型" span={2}>
                    {current.logTypeCode}
                </Descriptions.Item>
                <Descriptions.Item label="调用模块" span={3}>
                    {current.executeModuleName}  {current.executeMethod}
                </Descriptions.Item>

            </Descriptions>
            <br />
            <IIF test={current && current.exchangeParam}>
                <div className="snam-label">请求参数</div>
                <div style={{ border: '1px solid rgba(0, 0, 0, .06)' }}>
                    <CodeMirror
                        value={current.exchangeParam}
                        theme={settings.navTheme == 'realDark' ? 'dark' : 'light'}
                        language="json"
                        readOnly={true}
                        height="120px"
                        basicSetup={{ lineNumbers: false }}
                        extensions={[EditorView.lineWrapping, javascript({ jsx: true })]}
                    />
                </div>
            </IIF>
            <br />
            <IIF test={current && current.responseData}>
                <div className="snam-label">返回信息</div>
                <div style={{ border: '1px solid rgba(0, 0, 0, .06)' }}>
                    <CodeMirror
                        value={current.responseData}
                        theme={settings.navTheme == 'realDark' ? 'dark' : 'light'}
                        language="json"
                        readOnly={true}
                        height="120px"
                        basicSetup={{ lineNumbers: false }}
                        extensions={[EditorView.lineWrapping, javascript({ jsx: true })]}
                    />
                </div>
            </IIF>
            <br />

            <IIF test={current && current.exceptionMsg}>
                <div className="snam-label">错误信息</div>
                <div style={{ border: '1px solid rgba(0, 0, 0, .06)' }}>
                    <CodeMirror
                        value={current.exceptionMsg}
                        theme={settings.navTheme == 'realDark' ? 'dark' : 'light'}
                        language="json"
                        readOnly={true}
                        height="120"
                        basicSetup={{ lineNumbers: false }}
                        extensions={[EditorView.lineWrapping, javascript({ jsx: true })]}
                    />
                </div>
            </IIF>
        </IWindow>
    )
}