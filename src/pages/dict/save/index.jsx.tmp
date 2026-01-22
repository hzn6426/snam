import React, { useState } from 'react';
import { IFormItem, ILayout, IWindow, IIF } from '@/common/components';
import { api, useAutoObservable, useAutoObservableEvent } from "@/common/utils";
import { map, shareReplay, switchMap, tap, filter } from "rxjs/operators";
import { zip } from 'rxjs'
import { message, Alert } from "antd";
import { useParams } from 'umi';
import { AccountBookOutlined } from '@ant-design/icons';
import moment from 'moment/moment';


export default (props) => {

    const params = useParams();

    const [current] = useAutoObservable(
        (inputs$) => inputs$.pipe(
            map(([id]) => id),
            filter(id => id !== 'ADD'),
            switchMap((id) => api.dict.getDictionary(id)),
            map((data) => data[0])
        ),
        [params.id],);

    const [onSaveClick] = useAutoObservableEvent([
        switchMap((dict) => api.dict.saveOrUpdateDictionary(dict)),
        tap(() => {
            window.close();
            window.opener.onSuccess();
        })
    ]);

    return (
        <IWindow
            current={current}
            className="snam-modal"
            //title={current && current.id ? '更新字典' : '新建字典'}
            onSubmit={(params) => onSaveClick(params)}
            onCancel={() => {
                window.close();
                window.opener.onSuccess();
            }}
        >
            <IFormItem xtype="id" />
            <ILayout type="vbox">
                <IFormItem name="dictCode"
                    label="字典编号"
                    xtype="input"
                    max={30}
                    disabled={current && current.id}
                    required={true}
                />
                <IFormItem
                    name="dictName"
                    label="字典名称"
                    xtype="input"
                    max={100}
                    required={true}
                />
                <IFormItem name="dictType"
                    label="字典类型"
                    xtype="select"
                    options={[{ label: '系统', value: 'SYSTEM' }, { label: '业务', value: 'BUSINESS' }]}
                    required={true}
                />
                <IFormItem
                    name="priority"
                    label="优先级"
                    xtype="number"
                />

            </ILayout>
        </IWindow>
    )
}