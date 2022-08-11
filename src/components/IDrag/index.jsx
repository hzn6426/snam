import React, { useRef, useState } from 'react';
export default (props) => {
  const container = {
    ...props.style,
    width: props.style?.width || '100%',
    height: props.style?.height || '100%',
    userSelect: 'none',
  };
  var dragFlag = 0;

  // 左右
  const hCtn = useRef();
  const leftLayout = useRef();
  const hBar = useRef();
  //回调resize
  const hResize = async () => {
    if (dragFlag == 1) {
      dragFlag = 0;
      let hCtnWidth = hCtn.current.clientWidth;
      let leftWidth = leftLayout.current.clientWidth;
      let rightWidth = hCtnWidth - leftWidth - 8;
      props.resize({ left: leftWidth, right: rightWidth });
    }
  };
  const hContainer = {
    display: 'flex',
    width: '100%',
    height: '100%',
  };
  const leftPanel = {
    width: props.leftWidth || '50%',
    height: '100%',
    overflow: 'auto',
  };
  const rightPanel = {
    flex: 1,
    height: '100%',
    overflow: 'auto',
  };
  const hDragBar = {
    cursor: 'col-resize',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };
  const hBars = {
    background: '#AAA',
    width: '4px',
    height: '4px',
    borderRadius: '2px',
    margin: '2px 1px',
  };
  var leftPosition = 0;
  const hdrag = (e) => {
    if (dragFlag == 0) {
      leftPosition = e.pageX - hBar.current.offsetLeft;
      dragFlag = 1;
    } else {
      let hCtnWidth = hCtn.current.clientWidth;
      let newWidth = e.pageX - leftPosition - hCtn.current.offsetLeft;
      if (newWidth < 0 || newWidth > hCtnWidth) {
        dragFlag = 0;
      }
      leftLayout.current.style.width = newWidth + 'px';
    }
  };
  // 上下
  const vCtn = useRef();
  const topLayout = useRef();
  const vBar = useRef();

  //回调resize
  const vResize = async () => {
    if (dragFlag == 1) {
      dragFlag = 0;
      let vCtnHeight = vCtn.current.clientHeight;
      let topHeight = topLayout.current.clientHeight;
      let bottomHeight = vCtnHeight - topHeight - 8;
      props.resize({ top: topHeight, bottom: bottomHeight });
    }
  };
  const vContainer = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  };
  const topPanel = {
    width: '100%',
    height: props.topHeight || '50%',
    overflow: 'hidden',
  };
  const bottomPanel = {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  };
  const vDragBar = {
    cursor: 'row-resize',
    backgroundColor: '#F9F9F9',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  };
  const vBars = {
    background: '#AAA',
    width: '4px',
    height: '4px',
    borderRadius: '2px',
    margin: '1px 2px',
  };
  var topPosition = 0;
  const vdrag = (e) => {
    if (dragFlag == 0) {
      topPosition = e.pageY - vBar.current.offsetTop;
      dragFlag = 1;
    } else {
      let vCtnHeight = vCtn.current.clientHeight;
      let newHeight = e.pageY - topPosition - vCtn.current.offsetTop;
      if (newHeight < 0 || newHeight > vCtnHeight) {
        dragFlag = 0;
      }
      topLayout.current.style.height = newHeight + 'px';
    }
  };

  return (
    <div style={container}>
      {props.layout === 'vertical' ? (
        <div
          style={hContainer}
          ref={hCtn}
          onMouseUp={() => {
            document.removeEventListener('mousemove', hdrag);
            hResize();
          }}
        >
          <div style={leftPanel} ref={leftLayout}>
            {props.children[0]}
          </div>
          <div
            style={hDragBar}
            ref={hBar}
            onMouseDown={() => {
              document.addEventListener('mousemove', hdrag);
            }}
          >
            <span style={hBars} />
            <span style={hBars} />
            <span style={hBars} />
            <span style={hBars} />
          </div>
          <div style={rightPanel}>{props.children[1]}</div>
        </div>
      ) : (
        <div
          style={vContainer}
          ref={vCtn}
          onMouseUp={() => {
            document.removeEventListener('mousemove', vdrag);
            vResize();
          }}
        >
          <div style={topPanel} ref={topLayout}>
            {props.children[0]}
          </div>
          <div
            style={vDragBar}
            ref={vBar}
            onMouseDown={() => {
              document.addEventListener('mousemove', vdrag);
            }}
          >
            <span style={vBars} />
            <span style={vBars} />
            <span style={vBars} />
            <span style={vBars} />
          </div>
          <div style={bottomPanel}>{props.children[1]}</div>
        </div>
      )}
    </div>
  );
};
