import { useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { Resizable } from 'react-resizable';
import './index.less';

const ResizableTitle = ({ onResize, width, ...restProps }) => {
    if (!width) { return (<th {...restProps} />) };
    return (
        <Resizable
            width={width}
            height={0}
            handle={<span className="react-resizable-handle" onClick={e => { e.stopPropagation() }} />}
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} style={{ ...restProps?.style, userSelect: 'none' }} />
        </Resizable>
    );
};


export default ({ columns = [], ...props }) => {
    // * 列数据
    const [cols, setCols] = useState(columns);
    const colsArray = cols.map((col, index) => {
        return {
            ...col,
            onHeaderCell: column => ({ width: column.width, onResize: handleResize(index) })
        };
    });

    // 调整列宽
    const handleResize = index => {
        return (_, { size }) => {
            const temp = [...cols];
            temp[index] = { ...temp[index], width: size.width > 60 ? size.width : 60 };
            setCols(temp);
        };
    };

    return (
        <ProTable
            components={{ header: { cell: ResizableTitle } }}
            columns={colsArray}
            {...props}
        />
    );
};

