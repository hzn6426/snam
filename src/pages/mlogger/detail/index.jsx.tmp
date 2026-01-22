import { IIF, IStatus, IWindow } from '@/common/components';
import { api, dateFormat, useAutoObservable } from '@/common/utils';
import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from '@uiw/react-codemirror';
import {json} from "@codemirror/lang-json";
import { Descriptions } from 'antd';
import { EditorView } from "codemirror";
import { useState } from 'react';
import { filter, map, switchMap } from 'rxjs/operators';
import { useParams } from 'umi';
import { useApplicationState } from "@/store/state";

export default (props) => {
    const [navTheme] = useApplicationState(s => [s.view.navTheme]);
    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useAutoObservable((inputs$) =>
        inputs$.pipe(
            map(([id]) => id),
            filter(id => id !== 'ADD'),
            switchMap((id) => api.mlogger.getLogger(id)),
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

    const userType = {
        TENANT:'租户',
        USER:'用户'
    }



    return (
        <IWindow
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
                    <IStatus value={current.state} state={loggerState} />
                </Descriptions.Item>
                <Descriptions.Item label="用户类型" span={24}>
                    {userType[current.bindType]} {current.tenantName}
                </Descriptions.Item>
                <Descriptions.Item label="操作人" span={1}>
                    {current.createUserCnName} {current.ipAddress}
                </Descriptions.Item>
                <Descriptions.Item label="来源系统" span={2}>
                    {current.dataFrom}
                </Descriptions.Item>

                <Descriptions.Item label="调用功能" span={3}>
                    {current.exchangeName}
                </Descriptions.Item>

            </Descriptions>
            <br />
                <div className="snam-label">请求参数</div>
                <div style={{ border: '1px solid rgba(0, 0, 0, .06)' }}>
                    <CodeMirror
                        value={current.exchangeParam}
                        theme={navTheme == 'light' ? 'light' : 'dark'}
                        language="json"
                        readOnly={true}
                        height="120px"
                        basicSetup={{ lineNumbers: false }}
                        extensions={[EditorView.lineWrapping, json(), javascript({ jsx: true })]}
                    />
                </div>
            <br />
                <div className="snam-label">返回信息</div>
                <div style={{ border: '1px solid rgba(0, 0, 0, .06)' }}>
                    <CodeMirror
                        value={current.dataContent}
                        theme={navTheme == 'light' ? 'light' : 'dark'}
                        readOnly={true}
                        height="160px"
                        basicSetup={{ lineNumbers: false }}
                        extensions={[EditorView.lineWrapping, json(), javascript({ jsx: true })]}
                    />
                </div>
            <br />

            <IIF test={!!current.exceptionMsg}>
                <div className="snam-label">错误信息</div>
                <div style={{ border: '1px solid rgba(0, 0, 0, .06)' }}>
                    <CodeMirror
                        value={current.exceptionMsg}
                        theme={navTheme == 'light' ? 'light' : 'dark'}
                        readOnly={true}
                        height="140"
                        basicSetup={{ lineNumbers: false }}
                        extensions={[EditorView.lineWrapping, json(), javascript({ jsx: true })]}
                    />
                </div>
            </IIF>
        </IWindow>
    )
}