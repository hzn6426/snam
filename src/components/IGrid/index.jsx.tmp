import { copyObject, forEach } from '@/common/utils';
import { ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Drawer, Pagination, Space, Spin, Tooltip } from 'antd';
import React, { useEffect, useImperativeHandle, useState } from 'react';
// import './index.less';
import * as R from 'ramda';
const IGrid = React.forwardRef((props, ref) => {
  const {
    title,
    height,
    columnsStorageKey,
    initColumns,
    // columns,
    // onInitGridColumns,
    request,
    dataSource,
    showQuickJumper,
    pageNo,
    pageSize,
    total,
    components,
    toolBar,
    toolBarRender,
    rowSelection,
    childRef,
    onSelectedChanged,
    onDoubleClick,
    onClick,
    onCellValueChanged,
    clearSelect,
    optionsHide,
    cellClickedSelectRow,
    getRowStyle,
    selectWithClick,
  } = props;

  //主表格API
  const [gridApi, setGridApi] = useState(null);
  //主表格列API
  const [gridColumnApi, setGridColumnApi] = useState(null);
  //设置表格选中的列-同步更新朱表格
  const [checkedColumns, setCheckedColumns] = useState([]);
  //设置功能抽屉显示
  const [drawerVisible, setDrawerVisible] = useState(false);
  //设置功能表格列数据
  const [settingColumnsData, setSettingColumnsData] = useState([]);
  //设置功能表格API
  const [settingGridApi, setSettingGridApi] = useState(null);
  //设置功能表格列API
  const [settingGridColumnApi, setSettingGridColumnApi] = useState(null);

  const [ipageNo, setIpageNo] = useState(pageNo || 1);
  const [ipageSize, setIpageSize] = useState(pageSize || 50);
  //主表格列
  const [gridColumns, setGridColumns] = useState([]);

  const [beRefresh, setBerefresh] = useState(false);

  const { clientHeight } = window?.document?.documentElement;
  const tableHight = clientHeight - 260;
  const iheight = height || tableHight;

  const refresh = (params) => {
    setIpageNo(1);
    //setBerefresh(!beRefresh);
    request && request(1, ipageSize, params);
  };

  const reset = () => {
    setIpageNo(1);

    //setBerefresh(!beRefresh);
    request && request(1, 50);
  };

  useImperativeHandle(ref, () => ({
    refresh: (params) => {
      // 这里可以加自己的逻辑哦
      refresh(params);
    },
    reset: () => {
      reset();
    },
    getGridApi: () => {
      return gridApi;
    },
  }), [beRefresh]);

  const createGridColumns = (values) => {
    const loopColumns = values || initColumns;
    const cp = {};
    const target = [];
    forEach((v) => {
      const gridColumn = (
        <AgGridColumn
          key={v.key || v.dataIndex}
          headerName={v.title}
          field={v.dataIndex}
          width={v.width}
          cellRenderer={v.cellRenderer}
          hide={v.beHide}
          cellStyle={v.cellStyle || (v.align ? { textAlign: v.align } : { textAlign: 'center' })}
          headerClass={
            v.headerClass || (v.align === 'left'
              ? 'leftAlign'
              : v.align === 'right'
                ? 'rightAlign'
                : 'centerAlign')
          }
          valueFormatter={v.valueFormatter}
          valueGetter={v.valueGetter}
          cellEditorSelector={v.cellEditorSelector}
          editable={v.editable}
          suppressMovable={v.suppressMovable}
          pinned={v.pinned}
        />
      );
      // console.log(v.cellRenderer);
      // if (v.cellRenderer) {
      //   cp[`rd${v.cellRenderer.name}`] = v.cellRenderer;
      // }
      target.push(gridColumn);
    }, loopColumns);
    setGridColumns(target);
    // return target;
  };

  // const createGridColumns = isFunction(onInitGridColumns) ? onInitGridColumns : createColumnFn;

  useEffect(() => {
    gridApi && gridApi.deselectAll();
  }, [clearSelect]);

  // useEffect(() => {
  //   renderComponent();
  // }, []);

  const NoRowsOverlay = () => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="41"
          className="ant-empty-img-simple"
          viewBox="0 0 64 41"
        >
          <g fill="none" fillRule="evenodd" transform="translate(0 1)">
            <ellipse cx="32" cy="33" className="ant-empty-img-simple-ellipse" rx="32" ry="7" />
            <g fillRule="nonzero" className="ant-empty-img-simple-g">
              <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
              <path
                d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                className="ant-empty-img-simple-path"
              />
            </g>
          </g>
        </svg>
        <div
          className="empty-tips"
          style={{ marginTop: 8, color: 'rgba(0,0,0,.25)', fontSize: 14 }}
        >
          暂无数据
        </div>
      </>
    );
  };
  const NoRowsOverlayEmpty = () => {
    return <></>;
  };
  const CustomLoadingCellRenderer = () => {
    return <Spin spinning={true} />;
  };

  //保存列
  const saveColumn = (checkedValues) => {
    doRefreshGridColumn(checkedValues, true);
    // localStorage.setItem(columnsStorageKey, JSON.stringify(editColumns));
    setDrawerVisible(false);
  };

  //更新主表的列
  const doRefreshGridColumn = (checkedValues, beCache = false) => {
    let columns = gridColumnApi.getAllGridColumns();
    let editColumns = [];
    forEach((v) => {
      let editColumn = {};
      let colDef = v.colDef;
      if (v.colId != 0) {
        copyObject(editColumn, {
          title: colDef.headerName,
          width: v.actualWidth,
          cellStyle: colDef.cellStyle,
          headerClass: colDef.headerClass,
          dataIndex: colDef.field,
          beHide: checkedValues.indexOf(colDef.field) === -1,
          cellRenderer: colDef.cellRenderer,
          valueFormatter: colDef.valueFormatter,
          valueGetter: colDef.valueGetter,
          cellEditorSelector: colDef.cellEditorSelector,
          editable: colDef.editable,
          suppressMovable: colDef.suppressMovable,
        });
        editColumns.push(editColumn);
      }
    }, columns);
    createGridColumns(editColumns);
    if (beCache) {
      localStorage.setItem(columnsStorageKey, JSON.stringify(editColumns));
    }
    // return editColumns;
  };

  //重置列
  const resetColumn = () => {
    localStorage.removeItem(columnsStorageKey);
    let columns = getColumns();
    forEach((v) => {
      copyObject(v, {
        beHide: false,
      });
    }, columns);
    //创建列
    createGridColumns(columns);
    setDrawerVisible(false);
  };

  //选择
  const onSelectionChanged = () => {
    let selectedRows = gridApi.getSelectedRows();
    setBerefresh(!beRefresh);
    onSelectedChanged && onSelectedChanged(selectedRows);
  };

  //双击
  const onCellDoubleClicked = (param) => {
    onDoubleClick && onDoubleClick(param.data);
  };

  //点击
  const onCellClicked = (param) => {
    onClick && onClick(param);
    if (cellClickedSelectRow) {
      param.node.setSelected(true);
    }
  };

  //获取缓存或初始化的原始列
  const getColumns = () => {
    let columns;
    let storeColumns = columnsStorageKey && localStorage.getItem(columnsStorageKey);
    if (storeColumns) {
      columns = JSON.parse(storeColumns);
    } else {
      columns = initColumns;
      if (columnsStorageKey) {
        localStorage.setItem(columnsStorageKey, JSON.stringify(columns));
      }
    }
    return columns;
  };

  useImperativeHandle(childRef, () => ({
    // getGridApi 就是暴露给父组件的方法
    getGridApi: () => {
      return gridApi;
    },
  }));

  //打开设置
  const openSetting = () => {
    if (!drawerVisible) {
      changeSetting('', true);
    } else {
      setDrawerVisible(!drawerVisible);
    }
  };

  //改变列
  const changeSetting = (param, isOpen) => {
    let columns = gridColumnApi.getAllGridColumns();
    let checkedValues = [];
    let settingColmuns = [];
    forEach((v) => {
      let colDef = v.colDef;
      if (v.colId != 0) {
        if (v.visible) {
          checkedValues.push(v.colId);
        }
        let settingColumn = { title: colDef.headerName, field: colDef.field };
        settingColmuns.push(settingColumn);
      }
    }, columns);
    setSettingColumnsData(settingColmuns);
    setCheckedColumns(checkedValues);
    //设置选中
    setTimeout(() => {
      settingGridApi &&
        settingGridApi.forEachNodeAfterFilter((node) => {
          let index = node.data.field;
          node.setSelected(checkedValues.indexOf(index) >= 0);
        });
      if (isOpen) {
        setDrawerVisible(!drawerVisible);
      }
    }, 200);
  };

  //初始化
  const onGridReady = (params) => {
    let columns = getColumns();
    //创建列
    createGridColumns(columns);
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    request && request(ipageNo, ipageSize);
    let settingColmuns = [];
    forEach((v) => {
      if (v.title != ' ') {
        let settingColumn = { title: v.title, field: v.dataIndex };
        settingColmuns.push(settingColumn);
      }
    }, columns);
    setSettingColumnsData(settingColmuns);
  };

  //列设置初始化
  const settingOnGridReady = (params) => {
    setSettingGridApi(params.api);
    setSettingGridColumnApi(params.columnApi);
  };

  //列选择
  const settingOnSelectionChanged = () => {
    var selectedNodes = settingGridApi.getSelectedNodes();
    let checkedValues = [];
    forEach((v) => {
      checkedValues.push(v.data.field);
    }, selectedNodes);
    setCheckedColumns(checkedValues);
    doRefreshGridColumn(checkedValues);
  };

  //列选择
  const settingOnRowDragEnd = () => {
    var selectedNodes = settingGridApi.getSelectedNodes();
    let allNodes = [];
    settingGridApi.forEachNode((rowNode) => {
      allNodes.push(rowNode.data);
    });
    let checkedValues = [];
    let sortMap = {};
    forEach((v) => {
      checkedValues.push(v.data.field);
    }, selectedNodes);
    setCheckedColumns(checkedValues);
    settingGridApi.forEachNode((rowNode) => {
      copyObject(sortMap, { [`${rowNode.data.field}`]: rowNode.rowIndex });
    });
    //移动引用
    let columns = gridColumnApi.getAllGridColumns();
    let editColumns = [];
    forEach((v) => {
      let editColumn = {};
      let colDef = v.colDef;
      if (v.colId != 0) {
        copyObject(editColumn, {
          title: colDef.headerName,
          width: v.actualWidth,
          dataIndex: colDef.field,
          headerClass: colDef.field,
          cellStyle: colDef.cellStyle,
          //beHide: checkedValues.indexOf(colDef.field) === -1,
          cellRenderer: colDef.cellRenderer,
          valueFormatter: colDef.valueFormatter,
          valueGetter: colDef.valueGetter,
          cellEditorSelector: colDef.cellEditorSelector,
          editable: colDef.editable,
          suppressMovable: colDef.suppressMovable,
          beHide: checkedValues.indexOf(colDef.field) === -1,
          rowIndex: sortMap[colDef.field],
        });

        // copyObject(editColumn, {
        //   title: colDef.headerName,
        //   width: v.actualWidth,
        //   dataIndex: colDef.field,
        //   beHide: checkedValues.indexOf(colDef.field) === -1,
        //   rowIndex: sortMap[colDef.field],
        // });
        editColumns.push(editColumn);
      }
    }, columns);
    const indexSort = R.sortWith([R.ascend(R.prop('rowIndex'))]);
    editColumns = indexSort(editColumns);
    createGridColumns(editColumns);
    // setTimeout(() => gridApi.refreshCells());
  };

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: optionsHide?.noPadding
          ? '0'
          : optionsHide?.pagination
            ? '10px 10px 10px 10px'
            : '10px 10px 44px 10px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
          {title}
          {toolBar && toolBar.map((obj) => obj)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {toolBarRender && toolBarRender.map((obj) => obj)}
          <div style={{ display: optionsHide?.refresh ? 'none' : '' }}>
            <Tooltip placement="top" title="刷新">
              <ReloadOutlined
                style={{ marginLeft: '20px' }}
                onClick={() => {
                  request && request(ipageNo, ipageSize);
                }}
              />
            </Tooltip>
          </div>
          <div style={{ display: optionsHide?.setting ? 'none' : '' }}>
            <Tooltip placement="top" title="列设置">
              <SettingOutlined
                style={{ marginLeft: '20px', marginRight: '10px' }}
                onClick={() => {
                  openSetting();
                }}
              />
            </Tooltip>
          </div>
        </div>
      </div>
      <div
        className="ag-theme-balham"
        style={{ height: iheight, marginTop: '5px', position: 'relative', overflow: 'hidden' }}
      >
        <AgGridReact
          ref={ref}
          rowData={dataSource}
          onDragStopped={(e) => changeSetting(e, false)}
          onGridReady={onGridReady}
          rowSelection={rowSelection || 'multiple'}
          onSelectionChanged={onSelectionChanged}
          onCellDoubleClicked={onCellDoubleClicked}
          onCellClicked={onCellClicked}
          onCellValueChanged={onCellValueChanged}
          // frameworkComponents={copyObject(components || {}, {
          //   noRowsOverlay: optionsHide?.noDatasEmpty ? NoRowsOverlayEmpty : NoRowsOverlay,
          //   customLoadingCellRenderer: CustomLoadingCellRenderer,
          // })}
          frameworkComponents={{
            noRowsOverlay: optionsHide?.noDatasEmpty ? NoRowsOverlayEmpty : NoRowsOverlay,
            customLoadingCellRenderer: CustomLoadingCellRenderer,
            ...components,
          }}
          loadingCellRenderer={'customLoadingCellRenderer'}
          noRowsOverlayComponent={'noRowsOverlay'}
          defaultColDef={{
            sortable: true,
            resizable: true,
            minWidth: 45,
            // enableRowGroup: true,
            // enablePivot: true,
            // enableValue: true,
          }}
          singleClickEdit={true}
          suppressScrollOnNewData={true}
          getRowStyle={getRowStyle}
        >
          {!optionsHide?.select && (
            <AgGridColumn
              headerName=" "
              field="0"
              headerCheckboxSelection={rowSelection != 'single'}
              checkboxSelection={true}
              floatingFilter={false}
              suppressMenu={true}
              minWidth={35}
              maxWidth={35}
              width={35}
              flex={0}
              resizable={false}
              sortable={false}
              editable={false}
              filter={false}
              suppressColumnsToolPanel={true}
              pinned="left"
            />
          )}
          {gridColumns.map((obj, index) => obj)}
        </AgGridReact>
        <Drawer
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <div>列展示</div>
              <Space>
                <a
                  onClick={() => {
                    saveColumn(checkedColumns);
                  }}
                >
                  保存
                </a>
                <a onClick={resetColumn}>重置</a>
              </Space>
            </div>
          }
          placement="right"
          closable={false}
          onClose={() => {
            setDrawerVisible(false);
          }}
          visible={drawerVisible}
          getContainer={false}
          width={200}
          style={{
            position: 'absolute',
            border: '1px solid #f0f0f0',
            display: drawerVisible ? 'block' : 'none',
          }}
          headerStyle={{ height: '32px' }}
          bodyStyle={{ fontSize: '12px', padding: '4px 0px' }}
        // mask={false}
        >
          {/* <div className="ag-theme-balham ag-grid-setting"> */}
          <div id="settingGrid" className="ag-theme-balham">
            <AgGridReact
              onSelectionChanged={settingOnSelectionChanged}
              onRowDragEnd={settingOnRowDragEnd}
              rowDragManaged={true}
              rowSelection={'multiple'}
              animateRows={true}
              onGridReady={settingOnGridReady}
              rowData={settingColumnsData}
              suppressRowClickSelection={true}
              headerHeight={0}
              rowStyle={{ background: '#fff' }}
            >
              <AgGridColumn
                field="title"
                width={160}
                headerCheckboxSelection={true}
                rowDrag={true}
                checkboxSelection={true}
              />
            </AgGridReact>
          </div>
        </Drawer>
      </div>
      <div
        style={{
          display: optionsHide?.pagination ? 'none' : 'flex',
          justifyContent: 'flex-end',
          // justifyContent: 'space-between',
          // marginTop: toolBarRender ? '0px' : '5px',
          marginTop: '5px',
          paddingRight: '10px',
        }}
      >
        <div />
        <Pagination
          total={total || 0}
          current={ipageNo || 0}
          pageSize={ipageSize || 0}
          showQuickJumper={showQuickJumper === false ? false : true}
          size="small"
          onChange={(page, limit) => {
            setIpageNo(page);
            setIpageSize(limit);
            request && request(page, limit);
          }}
          showTotal={(total, range) => `第 ${range[0]}-${range[1]} 条/共 ${total} 条`}
        />

      </div>
    </div>
  );
});
export default IGrid;
