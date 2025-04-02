import { Dropdown, Menu, Modal } from 'antd';
import cx from 'classnames';


import { useApplicationState } from "@/store/state";
import { nanoid } from 'nanoid';
import { ConditionType } from "./channels";
import styles from './condition.less';
import LeafCondition from './leaf-condition';

const mockConstants = [
  {
    label: '性别',
    value: 'sex',
    children: [{ label: '男', value: '1' }, { label: '女', value: '0' }]
  }
];
const mockFuncs = [
  {
    label: '日期',
    value: 'date.action',
    id: 'date.action',
    children: [
      {
        value: 'format',
        label: '格式化日期',
        parameters: [{ name: '目标日期', type: 'Date' }, { name: '格式', type: 'String' }]
      },
      {
        value: 'getDate',
        label: '当前日期',
        parameters: []
      },
      {
        value: 'addDateForDay',
        label: '日期加天',
        parameters: [{ name: '目标日期', type: 'Date' }, { name: '加几天', type: 'Number' }]
      }
    ]
  }
];
const mockVariables = [
  {
    label: '客户',
    value: 'kehu',
    desc: '描述客户的一些信息',
    children: [
      { label: '年龄', value: 'nianling', dictType: '' },
      { label: '性别', value: 'xingbie', dictType: 'sex' },
      { label: '婚否', value: 'hunfou', dictType: '' },
      {
        label: '订单',
        value: '_dingdan',
        children: [
          { label: '数量', value: '_shuliang' },
          { label: '名称', value: '_mingcheng' },
          { label: '价格', value: '_jiage' }
        ]
      }
    ]
  },
  {
    label: '订单',
    value: 'dingdan',
    desc: '描述订单的一些信息',
    children: [
      { label: '数量', value: 'shuliang' },
      { label: '名称', value: 'mingcheng' },
      { label: '价格', value: 'jiage' }
    ]
  }
];
const RootCondition = props => {
    const {
      disabled = false,
      isRoot = false,
      isLast,
      isFirst,
      id,
      data,
      parentId,
      isAndType,
    } = props;

    const { rules, setSubCondtion,updateSubCondition,addSubCondition, deleteSubCondition } = useApplicationState(s => ({
          rules: s.rules,
          setSubCondtion: s.actions.condition.setSubCondtion,
          updateSubCondition: s.actions.condition.updateSubCondition,
          addSubCondition: s.actions.condition.addSubCondition,
          deleteSubCondition: s.actions.condition.deleteSubCondition,
      }));
  
    // const hasChildren = props.children.length > 0;
    const hasChildren = data.subConditions.length > 0;
    

    const handleChanageConditionType = (updateCondition, beRoot = false) => {
      updateSubCondition(updateCondition, beRoot);
    };
  
    const handleAddCondition = (id, newCondition, beRoot) => {
      addSubCondition(id, newCondition, beRoot);
    };
  
    const handleDeleteUniteCondition = (id, parentId) => {
      Modal.confirm({
        title: '确定删除当前条件以及它的子条件吗？',
        okType: 'danger',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          deleteSubCondition(id, parentId);
        }
      });
    };


    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={() => {
            const subCondition = {id, type: ConditionType.AND}
            handleChanageConditionType(subCondition, isRoot);
          
          }}>并且</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={() => {
            const subCondition = {id, type: ConditionType.OR}
            handleChanageConditionType(subCondition, isRoot);
          }}>或者</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <a onClick={() => {
            const subCondition = {
              id:nanoid(),
              type: ConditionType.NORMAL,
              expression: {
                left: {
                  id: nanoid(),
                },
                operator: {
                  label: '等于',
                  charator: '=='
                },
                right: {
                  id: nanoid(),

                }
              }
            }
            handleAddCondition(id, subCondition, isRoot)
          }}>添加条件</a>

        </Menu.Item>
        <Menu.Item>
        <a onClick={() => {
            const subCondition = {
              id:nanoid(),
              type: ConditionType.NORMAL,
              expression: {
                left: {
                  id: nanoid(),
                },
                operator: {
                  label: '等于',
                  charator: '=='
                },
                right: {
                  id: nanoid(),

                }
              }
            }
            const rule = {
              id:nanoid(),
              type: ConditionType.AND,
              subConditions: [subCondition]
            }
            handleAddCondition(id, rule, isRoot)
          }}>添加联合条件</a>
        </Menu.Item>
        {!isRoot && <Menu.Divider />}
        {!isRoot && (
          <Menu.Item disabled={disabled}>
            <a style={{ color: 'red' }} onClick={() => handleDeleteUniteCondition(id, parentId)}>
              删除
            </a>
          </Menu.Item>
        )}
      </Menu>
    );
  
    return (
      <div className={cx(styles['rule-condition'], {[styles['rule-condition_last']]: isLast})}>
        <div className={styles['toolbar_wrapper']}>
          <div className={cx( {[styles['toolbar_container_has_children']]: hasChildren})}>
            <div className={cx(styles['toolbar_container'], {[styles['toolbar_container_display_no_border']]: isRoot},{[styles['toolbar_container_first']]: isFirst})}>
              <Dropdown.Button size="small" overlay={menu} disabled={disabled}>
                {isAndType ? '并且' : '或者'}
              </Dropdown.Button>
            </div>
          </div>
        </div>
        {hasChildren && (<div className={styles['condition_wrapper']}>
        {data.subConditions.map((condition, idx) => {
          const {type } = condition;
          const conditionId = condition.id;
          const isAndType = type === ConditionType.AND;
          const isNormalType = type === ConditionType.NORMAL
          const isFirst = idx === 0;
          const isLast = idx === data.subConditions.length - 1;
          return (
            
              <div className={styles['condition_container']}>
              {isNormalType && <LeafCondition
                key={conditionId}
                id={conditionId}
                disabled={false}
                parentId={data.id}
                condition={condition}
                constants={mockConstants}
                variables={mockVariables}
                funcs={mockFuncs}
              />}
              {!isNormalType && 
               <RootCondition
                key={conditionId}
                id={conditionId}
                isLast={isLast}
                isFirst={isFirst}
                disabled={false}
                parentId={data.id}
                isAndType={isAndType}
                data={condition}
              />
              }
              {isFirst && <div className={`${styles['condition_line']} ${styles['condition_line_top']}`}></div>}
              {isLast && <div className={`${styles['condition_line']} ${styles['condition_line_bottom']}`}></div>}
              </div>
           
          )
        })}
         </div>
        )}
        {/* {hasChildren > 0 && (
          <div className={styles['condition_wrapper']}>
            {React.Children.map(props.children, (child, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === props.children.length - 1;

              return (
                <div className={styles['condition_container']}>
                  {React.cloneElement(child, { isLast })}
                  {isFirst && <div className={`${styles['condition_line']} ${styles['condition_line_top']}`}></div>}
                  {isLast && <div className={`${styles['condition_line']} ${styles['condition_line_bottom']}`}></div>}
                </div>
              );
            })}
          </div>
        )} */}
      </div>
    );
  };
  
  export default RootCondition;
  