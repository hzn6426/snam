import { useRef, useState } from 'react';
import {
    Card,
    Tabs,
    message,
} from 'antd';
import {
    BPermit,
    IAGrid,
    IButton,
    IGridSearch
} from '@/common/components';
import {
    api,
    dateFormat,
    pluck,
    INewWindow
} from '@/common/utils';

import {
  LockTwoTone,
  UnlockTwoTone,
  FormOutlined,
  RestOutlined
} from '@ant-design/icons';
import { showDeleteConfirm } from '@/common/antd';
import "./index.less"

//组件
const LockRenderer = (props) => {
    return props.value ? (
        <LockTwoTone twoToneColor="#FF0000" />
    ) : (
        <UnlockTwoTone twoToneColor="#52c41a" />
    );
};

const logoRenderer = (params) => {
    return <span className="imgSpanLogo">
        {params.value && (
            <img
                alt={`${params.value} Flag`}
                src={`https://www.ag-grid.com/example-assets/software-company-logos/${params.value.toLowerCase()}.svg`}
                className="logo"
            />
        )}
    </span>
};

//列初始化
const initColumns = [
    {
        headerName: '序号',
        textAlign: 'center',
        checkboxSelection: true,
        headerCheckboxSelection: true,
        lockPosition: 'left',
        width: 80,
        cellStyle: { userSelect: 'none' },
        valueFormatter: (params) => {
            return `${parseInt(params.node.id) + 1}`;
        },
        // rowDrag: true,
    },
    {
        headerName: '锁定',
        width: 70,
        field: 'beLock',
        cellRenderer: LockRenderer
    },
    {
        headerName: '图片名称',
        width: 100,
        field: 'name',
    },
    {
        headerName: '图片',
        width: 100,
        field: 'url',
        cellRenderer: logoRenderer
    },
    {
        headerName: '创建人',
        width: 100,
        field: 'createUserCnName',
    },
    {
        headerName: '创建时间',
        width: 160,
        field: 'createTime',
        valueFormatter: (x) => dateFormat(x.value, 'yyyy-MM-dd hh:mm:ss'),
    },
    {
    headerName: '备注',
    width: 160,
    field: 'note',
  }
];

export default (props) => {

    const [dataSource, setDataSource] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const ref = useRef();
    const refresh = () => ref.current.refresh();
    //查询
    const searchPicture = (pageNo, pageSize, params) => {
        setSelectedKeys([]);
        setSearchLoading(true);
        let param = { dto: params || {}, pageNo: pageNo, pageSize: pageSize };
        api.file.searchPicture(param).subscribe({
            next: (data) => {
                setDataSource(data.data);
                setTotal(data.total);
            },
        })
            .add(() => {
                setSearchLoading(false);
            });
    };

    const onDelete = (keys) => {
        setLoading(true);
        api.file.deletePicture(keys).subscribe({
            next: (res) => {
                message.success('操作成功!');
                refresh();
            },
        })
    }


    const rename = () => {
        if (selectedKeys.length !== 1) {
            message.error('请选择一个图片!');
            return;
        }
         INewWindow({
            url: '/new/file/picture/' + selectedKeys[0],
            title: ' 重命名',
            width: 600,
            height: 300,
            callback: () => refresh()
        })
    }

    const onChange = (v) => {
        setSelectedKeys(pluck('id', v));
    }

    const { offsetHeight } = window.document.getElementsByClassName("cala-body")[0];

    return (
        <Card
            className='snam-card'
            size='small'
            //bordered={false}
            bodyStyle={{ height: offsetHeight - 66, overflow: 'auto', padding: '0px' }}
        >
            <Tabs
                size="small"
                type="card"
                items={[
                    {
                        key: 'picture',
                        label: '图片文件夹',
                        children: (
                            <BPermit authority="picture" noAuthDesc={<div className='noAuth'>没有权限</div>}>
                            <IAGrid
                                gridName="perm_picture_list"
                                ref={ref}
                                title="图片列表"
                                columns={initColumns}
                                height={offsetHeight - 130}
                                defaultSearch={true}
                                request={(pageNo, pageSize) => searchPicture(pageNo, pageSize)}
                                dataSource={dataSource}
                                pageNo={pageNo}
                                pageSize={pageSize}
                                total={total}
                                onSelectedChanged={onChange}
                                // onDoubleClick={(record) => onDoubleClick(record.id)}
                                toolBarRender={[
                                    <IGridSearch defaultValue={'name'}
                                        onSearch={(params) => searchPicture(1, pageSize, params)}
                                        options={[{ label: '图片名称', value: 'name' }]}
                                    />,
                                ]}
                                pageToolBarRender={[
                                    <BPermit authority="picture:rename">
                                        <IButton
                                            type="primary"
                                            size='small'
                                            key="active"
                                            onClick={() => rename()}
                                            loading={loading}
                                            icon={<FormOutlined />}
                                        >
                                            重命名
                                        </IButton>
                                    </BPermit>,
                                    <BPermit authority="picture:delete">
                                    <IButton
                                        danger
                                        type="primary"
                                        icon={<RestOutlined />}
                                        size="small"
                                        key="delete"
                                        onClick={() => showDeleteConfirm('确定删除选中的图片吗?', () => onDelete(selectedKeys))}
                                    >
                                        删除
                                    </IButton>
                                    </BPermit>,
                                ]}
                                // onClick={(data) => onClicked(data)}
                                clearSelect={searchLoading}
                            />
                            </BPermit>
                        )
                    }
                    // ,{
                    //      key: 'pdf',
                    //     label: 'PDF文件夹',
                    //     children: (
                    //         <BPermit authority="pdf" noAuthDesc={<div className='noAuth'>没有权限</div>}></BPermit>
                    //     )
                    // }

                ]}
            />
        </Card>
    )
}
