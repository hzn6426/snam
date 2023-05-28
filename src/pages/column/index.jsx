import {
    IFooterToolbar,
    IGrid,
    ILayout
} from '@/common/components';
import {
    api,
    forEach,
    isEmpty,
    pluck,
    produce
} from '@/common/utils';
import { NodeCollapseOutlined, NodeExpandOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Input, Tag, message } from 'antd';
import { useEffect, useState } from 'react';


export default (props) => {

    const { clientHeight } = window?.document?.documentElement;
    const tableHight = clientHeight - 210;
    const [tableDataSource, setTableDataSource] = useState([]);
    const [columnDataSource, setColumnDataSource] = useState([]);
    const [permDataSource, setPermDataSource] = useState([]);

    const [searchLoading, setSearchLoading] = useState(false);

    const [tableTotal, setTableTotal] = useState(0);
    const [columnTotal, setColumnTotal] = useState(0);
    const [permTotal, setPermTotal] = useState(0);

    const [selectedTables, setSelectedTables] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [selectedPerms, setSelectedPerms] = useState([]);

    const [tableSearchValue, setTableSearchValue] = useState('');
    const [columnSearchValue, setColumnSearchValue] = useState('');

    const [saveLoading, setSaveLoading] = useState(false);

    const TagRenderer = (props) => {
        if (props.value === true) {
            return <Tag color="#f50">是</Tag>;
        }
        return <Tag color="#2db7f5">否</Tag>;
    }

    //列初始化
    const tableColumns = [
        {
            title: '表名',
            width: 150,
            align: 'left',
            dataIndex: 'tableName',
        },
        {
            title: '描述',
            width: 170,
            align: 'left',
            dataIndex: 'tableComment',
        },
    ];

    const columnColumns = [
        {
            title: '列名',
            width: 120,
            align: 'left',
            dataIndex: 'columnName',
        },
        {
            title: '类型',
            width: 100,
            align: 'left',
            dataIndex: 'dataType',
        },
        {
            title: '描述',
            width: 160,
            align: 'left',
            dataIndex: 'columnComment',
        },
        {
            title: '是否加入',
            width: 90,
            align: 'left',
            dataIndex: 'beInPerm',
            cellRenderer: 'tagCellRenderer'
        },
    ];

    const permColumns = [
        {
            title: '列名',
            width: 120,
            align: 'left',
            dataIndex: 'columnName',
        },
        {
            title: '类型',
            width: 100,
            align: 'left',
            dataIndex: 'columnType',
        },
        {
            title: '描述',
            width: 160,
            align: 'left',
            dataIndex: 'columnComment',
        },
    ];


    const fetchPermColumns = () => {
        api.column.listPermColumns(selectedTables[0]).subscribe({
            next: (data2) => {
                const datas = data2.data;
                setPermDataSource(data2 || []);
                setPermTotal((datas && datas.length) || 0);
            }
        })
    }

    useEffect(() => {
        if (selectedTables && selectedTables.length > 0) {
            console.log(selectedTables);
            fetchPermColumns();
            searchColmn(1, 50);
        }
    }, [selectedTables]);

    useEffect(() => {
        searchTable(1, 50);
    }, [tableSearchValue]);

    useEffect(() => {
        searchColmn(1, 50)
    }, [columnSearchValue])

    const onTableChange = (v) => {
        setSelectedTables(pluck('tableName', v));
    }

    const onColumnChange = (v) => {
        setSelectedColumns(v);
    }

    const onPermChange = (v) => {
        setSelectedPerms(v);
    }

    //查询
    const searchTable = (pageNo, pageSize) => {
        let dto = {};
        if (tableSearchValue) {
            dto = { tableName: tableSearchValue, tableComment: tableSearchValue };
        }
        let param = { dto: dto, pageNo: pageNo, pageSize: pageSize };
        setSearchLoading(true);
        api.column.fetchTables(param).subscribe({
            next: (data) => {
                setTableDataSource(data.data);
                setTableTotal(data.total)
            }
        }).add(() => setSearchLoading(false))
    };

    //查询
    const searchColmn = (pageNo, pageSize) => {
        if (!selectedTables || selectedTables.length == 0) {
            return;
        }
        let dto = {};
        dto.tableName = selectedTables[0];
        if (columnSearchValue) {
            dto.columnName = columnSearchValue;
            dto.columnComment = columnSearchValue;
        }
        let param = { dto: dto, pageNo: pageNo, pageSize: pageSize };
        api.column.fetchTableColumns(param).subscribe({
            next: (data) => {
                const datas = data.data;
                setColumnDataSource(datas);
                setColumnTotal(data.total);

            },
        });
    };

    const join = () => {
        const ds = [];
        const columns = [];
        forEach((record) => {
            if (record.beInPerm === true) {
                return;
            }
            columns.push(record.columnName);
            ds.push({ tableName: record.tableName, columnName: record.columnName, columnType: record.dataType, columnComment: record.columnComment });
        }, selectedColumns);
        const targets = produce(permDataSource, (draft) => {
            draft.push(...ds);
        });
        setPermDataSource(targets);
        setPermTotal(targets.length);
        const cds = produce(columnDataSource, (draft) => {
            forEach((v) => {
                if (columns.includes(v.columnName)) {
                    v.beInPerm = true;
                }
            }, draft);

        });
        setColumnDataSource(cds);
        setSelectedColumns([]);
        setSelectedPerms([]);
    }

    const unJoin = () => {
        const columns = []
        let ds = produce(permDataSource, (draft) => { });
        forEach((record) => {
            ds = ds.filter(v => v.columnName !== record.columnName);
            columns.push(record.columnName);

        }, selectedPerms)
        setPermDataSource(ds);

        const cds = produce(columnDataSource, (draft) => {
            forEach((v) => {
                if (columns.includes(v.columnName)) {
                    v.beInPerm = false;
                }
            }, draft);

        });
        setColumnDataSource(cds);
        setSelectedColumns([]);
        setSelectedPerms([]);
    }

    const onSave = () => {
        if (permDataSource.length === 0) {
            message.error("请至少添加一条记录!");
            return;
        }
        setSaveLoading(true);
        api.column.savePermColumns(permDataSource).subscribe({
            next: () => {
                message.success("操作成功!");

            }
        }).add(() => setSaveLoading(false));
    }

    // 列表及弹窗
    return (
        <>
            <ILayout type="hbox" spans="7 10 7" gutter="8">
                <IGrid
                    toolBarRender={[<Input.Search onSearch={(value) => setTableSearchValue(value)} type='text' size='small' key="tableSearch" placeholder='输入表名或描述进行搜索' allowClear />]}
                    title="表格列表"
                    key="table"
                    height={tableHight}
                    // columnsStorageKey="_cache_user_columns"
                    initColumns={tableColumns}
                    request={(pageNo, pageSize) => searchTable(pageNo, pageSize)}
                    dataSource={tableDataSource}
                    total={tableTotal}
                    rowSelection='single'
                    onSelectedChanged={onTableChange}
                    clearSelect={searchLoading}
                    showQuickJumper={false}
                />
                <>
                    <IGrid
                        toolBarRender={[<Input.Search onSearch={(value) => setColumnSearchValue(value)} type='text' size='small' key="columnSearch" placeholder='输入列名或描述进行搜索' allowClear />]}
                        title="表格列列表"
                        key="column"
                        height={tableHight}
                        components={{
                            tagCellRenderer: TagRenderer,
                        }}
                        initColumns={columnColumns}
                        request={(pageNo, pageSize) => searchColmn(pageNo, pageSize)}
                        dataSource={columnDataSource}
                        total={columnTotal}
                        onSelectedChanged={onColumnChange}
                        showQuickJumper={false}
                    />
                    <IFooterToolbar style={{
                        left: 'calc(37% + 20px)',
                        width: 'calc(36% - 5px)',
                    }} visible={!isEmpty(selectedColumns)}>
                        <Button type='danger' key="joinColumn" icon={<NodeExpandOutlined />} onClick={join} >
                            加入
                        </Button>
                    </IFooterToolbar>
                </>
                <>
                    <IGrid
                        title="权限列列表"
                        key="perm"
                        height={tableHight}
                        onSelectedChanged={onPermChange}
                        request={false}
                        // columnsStorageKey="_cache_user_columns"
                        initColumns={permColumns}
                        dataSource={permDataSource}
                        total={permTotal}
                        showQuickJumper={false}
                        toolBarRender={[
                            <Button
                                key="save"
                                size="small"
                                type="danger"
                                loading={saveLoading}
                                icon={<SaveOutlined />}
                                onClick={() => onSave()}
                            >
                                保存权限列
                            </Button>,

                        ]}
                    />
                    <IFooterToolbar style={{
                        left: 'calc(74% + 10px)',
                        width: 'calc(25% - 2px)',
                    }} visible={!isEmpty(selectedPerms)}>
                        <Button type='danger' key="joinPerm" icon={<NodeCollapseOutlined />} onClick={unJoin} >
                            移除
                        </Button>
                    </IFooterToolbar>
                </>
            </ILayout>
        </>
    );
};