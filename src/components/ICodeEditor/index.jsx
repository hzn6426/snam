import { StreamLanguage } from '@codemirror/language';
import { groovy } from '@codemirror/legacy-modes/mode/groovy';
import {mySQL} from "@codemirror/legacy-modes/mode/sql"
import { noctisLilac } from '@uiw/codemirror-theme-noctis-lilac';
import CodeMirror from '@uiw/react-codemirror';
import './index.less';
function ICodeEditor(props) {
  const { value, height, width, placeholder, ...restProps } = props;
  const h = height || '500px';
  const w = width || '1000px';
  return (
    <div
      style={{
        borderRadius: '5px',
        width: w,
        height: h,
        // marginLeft: '5px',
        resize: 'both',
        border: '1px solid #d7d7d7',
        ...props.style,
      }}
    >
      <CodeMirror
        value={value}
        width={w}
        height={h}
        placeholder={placeholder || 'Groovy代码片段'}
        {...restProps}
        theme={noctisLilac}
        extensions={props.language == 'mySql' ?[StreamLanguage.define(mySQL)] : [StreamLanguage.define(groovy)]}
      />
    </div>
  );
}

export default ICodeEditor;
