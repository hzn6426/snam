import React, { useState, useMemo, useRef, useEffect, useImperativeHandle } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Typography, Button, Space, Drawer, Pagination, message, theme } from 'antd';
import { SettingOutlined, SyncOutlined, FullscreenOutlined, DiffOutlined, InteractionOutlined, AppstoreOutlined, ControlOutlined } from '@ant-design/icons';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import './index.less';
import { forEach, isEmpty, isFunction } from '@/common/utils';


export default React.forwardRef((props, ref) => {
  const {
    gridName,
    title,
    columns,
    request,
    onDoubleClick,
    onClick,
    onCellValueChanged,
    cellClickedSelectRow,
    onSelectedChanged,
    rowSelection,
    pageSizeList,
    dataSource,
    toolBarRender,
    pageToolBarRender,
    pageToolBar,
    height,
    total,
    optionsHide,
    pageNo,
    pageSize,
    defaultSearch,
    showQuickJumper,
    showTotal,
    showSizeChanger,
    clearSelect,
    childRef
  } = props;


  const { token: { colorBgBase } } = theme.useToken();// 主题切换
  const [selectedRows, setSelectedRows] = useState([]);
  //主表格API
  const [gridApi, setGridApi] = useState(null);
  //主表格列API
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [gridColumns, setGridColumns] = useState(columns);  // 表格列

  const [isOpen, setIsOpen] = useState(false);
  const [columnData, setColumnData] = useState([]);  // 设置列数据 


  const gridRef = useRef();
  const settingRef = useRef();

  const localPrefix = 'Grid_'; // localStorage 前缀
  const localSearchPrefix = 'Search_';

  const refresh = (params) => {
    //setBerefresh(!beRefresh);
    request && request(1, pageSize || 50, params);
  };

  const reset = () => {
    //setBerefresh(!beRefresh);
    request && request(1, pageSize || 50);
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
  }), []);

  useImperativeHandle(childRef, () => ({
    getGridApi: () => {
      console.log(gridApi);
      return gridApi;
    },
  }));

  const NoRowsOverlay = () => {
    return <>
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="41" className="ant-empty-img-simple" viewBox="0 0 64 41">
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
      <div className="empty-tips" style={{ marginTop: 8, color: 'rgba(0,0,0,.25)', fontSize: 14 }}>
        暂无数据
      </div>
    </>
  }

  const NoRowsOverlayEmpty = () => {
    return <></>
  }

  useEffect(() => {

    if (defaultSearch !== false) {
      getRowData(pageNo, pageSize || 50);
    }

  }, []);

  useEffect(() => {
    gridApi && gridApi.deselectAll();
  }, [clearSelect]);

  const getRowData = (current, size) => {
    request && request(current, size)
  }

  const gridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    let customColumn = JSON.parse(localStorage.getItem(localPrefix + gridName));
    if (customColumn) {
      let initColumn = [], hideColumn = [];
      let remainNode = columns;
      customColumn.forEach((node) => {
        let tempNode = remainNode.filter(element => element.field == node.field)[0];
        if (tempNode) {
          remainNode = remainNode.filter(element => element.field != node.field);
          tempNode.width = node.width;
          if (node.visible == false) {
            hideColumn.push(tempNode.field);
          }
          initColumn.push(tempNode);
        }
      })
      initColumn = initColumn.concat(remainNode);

      setGridColumns(initColumn);
      hideColumn.forEach((node) => {
        gridColumnApi.setColumnVisible(node, false);
      })
    }
  }

  //打开Column设置面板
  const openSetting = () => {
    setIsOpen(true);
    const cols = gridColumnApi.getAllGridColumns();
    let colNames = [];
    let nodeSelect = [];
    cols.map((item) => {
      colNames.push({ "field": item.getId(), "headerName": item.getColDef().headerName, "width": item.getActualWidth(), "visible": item.isVisible() });
      if (item.isVisible()) { nodeSelect.push(item.getId()); }
    });
    setColumnData(colNames);
    setTimeout(() => {
      settingRef.current.api.forEachNodeAfterFilter(
        node => {
          let index = node.data.field;
          node.setSelected(nodeSelect.indexOf(index) >= 0);
        }
      );
    }, 100);
  }

  // 通用列属性
  const defaultCol = useMemo(() => {
    return {
      resizable: true,
      minWidth: 60,
    };
  }, []);

  // 拖拽顺序
  const settingDragEnd = (e) => {
    gridColumnApi.moveColumn(e.node.data.field, e.overIndex);
  }

  // 选择显示
  const settingChanged = () => {
    const selectedRows = settingRef.current.api.getSelectedRows();
    let settingCols = []
    selectedRows.forEach(element => { settingCols.push(element.field) });
    const cols = gridColumnApi.getAllGridColumns();
    let visibleCols = []
    cols.forEach(element => {
      if (element.isVisible()) {
        visibleCols.push(element.getId())
      }
    });
    // 隐藏列
    if (visibleCols.length > settingCols.length) {
      let actionNode = visibleCols.filter((item) => { return settingCols.indexOf(item) < 0 });
      gridColumnApi.setColumnVisible(actionNode[0], false);
      columnData.forEach(item => {
        if (item.field == actionNode[0]) { item.visible = false }
      })
    }
    // 显示列
    if (visibleCols.length < settingCols.length) {
      let actionNode = settingCols.filter((item) => { return visibleCols.indexOf(item) < 0 });
      gridColumnApi.setColumnVisible(actionNode[0], true);
      columnData.forEach(item => {
        if (item.field == actionNode[0]) { item.visible = true }
      })
    }
  }

  // 保存
  const saveSetting = () => {
    let colNames = [];
    settingRef.current.api.forEachNode((node, index) => {
      let item = node.data;
      colNames.push(item)
    })
    localStorage.setItem(localPrefix + gridName, JSON.stringify(colNames));
    setIsOpen(false);
    message.success(title + "列设置，保存成功!")
  }

  // 清空还原
  const clearSetting = () => {
    localStorage.removeItem(localPrefix + gridName);
    setGridColumns(columns)
    let colNames = [];
    columns.map((item) => {
      colNames.push({ "field": item.field, "headerName": item.headerName, "width": item.width, "visible": true });
    });
    setColumnData(colNames);
    setTimeout(() => {
      settingRef.current.api.forEachNodeAfterFilter(
        node => { node.setSelected(true) }
      )
    }, 100);
    message.success(title + "列设置，还原成功!")
  }

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

  // Setting-列属性
  const columnCols = [
    {
      headerName: '自定义列属性',
      field: 'headerName',
      lockPosition: 'left',
      checkboxSelection: true,
      rowDrag: true
    }
  ];

  return (
    <div className={"ag-container" + (colorBgBase == '#fff' ? "" : "-dark")} style={{ height: height || 300 }}>

      <div className="ag-tools" style={{ display: optionsHide?.topTool ? 'none' : '', }}>
        <div className='ag-tools-left'>
          <Typography.Text>{title}</Typography.Text>
        </div>
        <div className='ag-tools-right'>
          {/* <Space> */}
          <Space.Compact block>
            {toolBarRender && toolBarRender.map((obj) => obj)}
            {/* {topToolBar && topToolBar()} */}

            <Button size="small" key="refresh" type="default" iconPosition="end" icon={<InteractionOutlined />} onClick={() => getRowData(pageNo, pageSize)} />
            <Button size="small" key="setting" type="default" iconPosition="end" icon={<AppstoreOutlined />} onClick={openSetting} />
          </Space.Compact>
          {/* </Space> */}
        </div>
      </div>

      <div className={"ag-body ag-theme-balham" + (colorBgBase == '#fff' ? "" : "-dark")} >
        <AgGridReact
          ref={ref}
          rowData={dataSource} // 表格数据
          columnDefs={gridColumns} // 列数据
          defaultColDef={defaultCol} // 列属性设置
          rowSelection={rowSelection || 'multiple'} // 行选择设置
          onSelectionChanged={(e) => {
            const nodes = e.api.getSelectedNodes() || [];
            const datas = [];
            forEach((v) => {
              datas.push(v.data);
            }, nodes);
            if (isFunction(onSelectedChanged)) {
              onSelectedChanged(datas);
            }
            setSelectedRows(datas);
          }} // 行选择数据
          onCellDoubleClicked={onCellDoubleClicked}
          onCellClicked={onCellClicked}
          onCellValueChanged={onCellValueChanged}
          singleClickEdit={true}
          rowMultiSelectWithClick={true}
          onGridReady={gridReady}
          //suppressDragLeaveHidesColumns={true} // 拖拽隐藏
          rowDragManaged={true} // 允许拖动
          animateRows={true} // 行动画
          noRowsOverlayComponent={optionsHide?.noDatasEmpty ? NoRowsOverlayEmpty : NoRowsOverlay}
          enableCellChangeFlash={true}
        />
        <Drawer
          onClose={() => setIsOpen(false)}
          closable={false}
          open={isOpen}
          width={200}
          getContainer={false}
          bodyStyle={{ padding: '5px' }}
          footer={
            <Space>
              <Button size="small" onClick={clearSetting}>还原</Button>
              <Button size="small" type="primary" onClick={saveSetting}>保存</Button>
            </Space>
          }
          footerStyle={{ textAlign: 'center' }}
          className='ag-setting'
        >
          <AgGridReact
            ref={settingRef}
            rowData={columnData} // 设置表格数据
            columnDefs={columnCols} // 设置列数据
            rowSelection="multiple"
            rowDragManaged={true}
            animateRows={true}
            suppressRowClickSelection={true}
            onRowDragEnd={settingDragEnd}
            onSelectionChanged={settingChanged}
          />
        </Drawer>
      </div>

      <div className="ag-pagination" style={{ display: optionsHide?.pagination ? 'none' : '', height: 25 }}>
        <div className="pagination-tools">
          <Space style={{ display: isEmpty(selectedRows) ? 'none' : '' }}>
            {pageToolBarRender && pageToolBarRender.map((obj) => obj)}
            {/* {pageToolBar && pageToolBar()} */}
          </Space>
        </div>
        <Pagination
          className='pagination-content'
          showSizeChanger={showSizeChanger === false ? false : true}
          showQuickJumper={showQuickJumper === false ? false : true}
          size="small"
          defaultPageSize={pageSize || 50}
          current={pageNo}
          total={total}
          showTotal={showTotal === false ? false : (total, range) => `第${range[0]}-${range[1] || 0}条/共${total}条`}
          pageSizeOptions={pageSizeList || [50, 100, 500, 1000, 3000, 5000]}
          onChange={(page, pageSize) => {
            getRowData(page, pageSize);
          }}
        />
      </div>

    </div>
  );
});