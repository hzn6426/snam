import { IIF, IStatus, IWindow, ICodeEditor,IFormItem,ILayout } from '@/common/components';
import { api, dateFormat,useAutoObservable } from '@/common/utils';
import { javascript } from "@codemirror/lang-javascript";
import {json} from "@codemirror/lang-json";
import { Descriptions } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from "codemirror";
import { useRef, useState, useEffect } from 'react';
import { useParams } from 'umi';
import { useApplicationState } from "@/store/state";


export default (props) => {
    const [current, setCurrent] = useState({});

    const [navTheme] = useApplicationState(s => [s.view.navTheme]);

    const params = useParams();
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    useEffect(() => {
        if (params.id) {
            api.logger.getLogger(params.id).subscribe({
                next: (data) => {
                    setCurrent(data[0]);
                }
            })
        }
    },[params.id])


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

    const items = [{
        label:'请求',
        key:'request',
        span:24,
        children: <>{dateFormat(current.exchangeTime, 'yyyy-MM-dd hh:mm:ss')} {current.exchangeMethod}  {current.exchangeUrl}</>
    },{
        label:'状态',
        key:'status',
        span:24,
        children: <><IStatus value={current.state} state={loggerState} /> 耗时:{current.executeTimer}秒</>
    },{
        label:'操作人',
        key:'operator',
        span:1,
        children: <>{current.createUserCnName} {current.ipAddress}</>
    },{
        label:'浏览器信息',
        key:'browser',
        span:2,
        children: <>{current.os}-{current.browser}</>
    }, {
        label:'来源系统',
        key:'system',
        span:1,
        children: <>{sourceFrom(current.systemTag)}</>
    },
    {
        label:'日志类型',
        key:'type',
        span:2,
        children: <>{current.logTypeCode}</>
    },{
        label:'调用模块',
        key:'module',
        span:3,
        children: <>{current.executeModuleName}  {current.executeMethod}</>
    }
];

    return  (<IWindow
            current={current}
            className="snam-modal"
            title={(current && current.id) ? '查看日志' : '查看日志'}
            width={clientWidth}
            height={clientHeight}
            saveVisible={false}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <Descriptions layout="vertical" size='small'  bordered items={items}/>

            <br/>
                <div className="snam-label">请求参数</div>
                <div style={{ border: '1px solid rgba(0, 0, 0, .06)' }}>
                    <CodeMirror
                        value={current.exchangeParam}
                        theme={navTheme == 'light' ? 'light' : 'dark'}
                        readOnly={true}
                        width="100%"
                        height="120px"
                        basicSetup={{ lineNumbers: false }}
                        extensions={[EditorView.lineWrapping,json(), javascript({ jsx: true })]}
                    />
                </div>
            <br />
                <div className="snam-label">返回信息</div>
                <div style={{ border: '1px solid rgba(0, 0, 0, .06)',  }}>
                    <CodeMirror
                        language="json"
                        value={current.responseData}
                        theme={navTheme == 'light' ? 'light' : 'dark'}
                        width="100%"
                        readOnly={true}
                        height="140px"
                        basicSetup={{ lineNumbers: false }}
                        extensions={[EditorView.lineWrapping,json(), javascript({ jsx: true })]}
                    />
                </div>
            <br />

            <IIF test={!!current.exceptionMsg}>
                <div className="snam-label">错误信息</div>
                <div style={{ border: '1px solid rgba(0, 0, 0, .06)' }}>
                    <CodeMirror
                        value={current.exceptionMsg}
                        theme={navTheme == 'light' ? 'light' : 'dark'}
                        language="json"
                        readOnly={true}
                        height="120px"
                        width="100%"
                        basicSetup={{ lineNumbers: false }}
                        extensions={[EditorView.lineWrapping,json(), javascript({ jsx: true })]}
                    />
                </div>
            </IIF>
        </IWindow>)
}