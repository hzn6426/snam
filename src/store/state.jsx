import { immer } from "zustand/middleware/immer";

import { copyObject, forEach } from "@/common/utils";
import { getActionValueByLeftOrRightId, getRootCondition, getRule, getSubCondition, getSubConditionByLeftOrRightId } from "@/store/tools";
import { createStoreContext, defineStoreInstance } from "./store";

const applicationStateInstance = defineStoreInstance((init) => {
    return immer((set, get) => ({
        ...init,
        actions: {
            action: {
                addAction: (ruleId, action) => set((state) => {
                    const rule = getRule(ruleId, state.rules);
                    rule.actions.push(action);
                }),
                updateAction: (ruleId, action) => set((state) => {
                    const rule = getRule(ruleId, state.rules);
                    if (rule) {
                        const actions = [];
                        forEach((a) => {
                            if (a.id == action.id) {
                                const t = copyObject({}, a, action);
                                actions.push(t);
                            } else {
                                actions.push(a);
                            }
                        },rule.actions)
                        rule.actions = actions;
                    }
                }),
                updateLeftAction: left => set((state) => {
                    const action = getActionValueByLeftOrRightId(left.id, state.rules);
                    // console.log(action)
                    if (action) {
                        const l = copyObject({}, action.left, left);
                        console.log(l);
                        action.left = l;
                    }
                }),
                updateRightAction: right => set((state) => {
                    const action = getActionValueByLeftOrRightId(right.id, state.rules);
                    // console.log(action)
                    if (action) {
                        const r = copyObject({}, action.right, right);
                        action.right = r;
                    }
                }),
                deleteAction: (ruleId, id)=> set((state) => {
                    const rule = getRule(ruleId, state.rules);
                    if (rule) {
                        const filterd = rule.actions.filter(i => i.id != id);
                        rule.actions = filterd;
                    }
                }),
            },
            condition: {
                setRules: rules => set((state) => {
                    state.rules = rules;
                }),

                

                updateSubCondition: (condition,beRoot = false) => set((state) => {
                    const sub = beRoot == true ? getRootCondition(condition.id, state.rules) : getSubCondition(condition.id, state.rules);
                    if (sub) {
                        sub.type = condition.type;
                    }
                }),
                deleteSubCondition: (id, parentId) => set((state) => {

                    let sub = getRootCondition(parentId, state.rules) ;
                    if (!sub) {
                        sub = getSubCondition(parentId, state.rules);
                    }

                    if (sub) {
                        const filterd = sub.subConditions.filter(i => i.id != id);
                        sub.subConditions = filterd;
                    }
                    
                }),
                addSubCondition: (id, newCondition, beRoot = false) => set((state) => {
                    const sub = beRoot == true ? getRootCondition(id, state.rules) : getSubCondition(id, state.rules);
                    if (sub) {
                        sub.subConditions.push(newCondition);
                    }
                }),
                setSubCondtion: (condition, beRoot = false) => set((state) => {
                    const sub = beRoot == true ? getRootCondition(condition.id, state.rules) : getSubCondition(condition.id, state.rules);
                    if (sub) {
                        sub.subConditions = condition.subConditions;
                        sub.type = condition.type;
                    }
                }),
                updateSubConditionOperator: (id, operator) => set((state) => {
                    const sub = getSubCondition(id, state.rules);
                    if (sub) {
                        sub.expression.operator = operator;
                    }
                }),
                setSubConditionLeft: left => set((state) => {
                    const sub = getSubConditionByLeftOrRightId(left.id, state.rules);
                    if (sub) {
                        sub.expression.left = left;
                    }
                }),
                setSubConditionRight: right => set((state) => {
                    const sub = getSubConditionByLeftOrRightId(right.id, state.rules);
                    if (sub) {
                        sub.expression.right = right;
                    }
                }),
            }
        },
    }));
}, {

    rules: [
        {
            id: '123',
            name: '累哦',
            rootCondition: {
                id: 'ROOT',
                type: 'and',
                subConditions: [
                    {
                        id: '95fe42f0b1f395f9e20529b825e5599d',
                        type: 'normal',
                        expression: {
                            left: {
                                id: 'fb842a8d3730e7cd5a919fc8a0014214',
                                type: 'input',
                                value: '客户.婚否',
                                code:'customer.hunfou',
                                // type: 'variable',
                                // value: {
                                //     groupCode: ['kehu'],
                                //     groupLabel: '客户',
                                //     propCode: 'hunfou',
                                //     propLabel: '婚否'
                                // }
                            },
                            operator: {
                                label: '等于',
                                charator: '=='
                            },
                            right: {
                                id: '769dfa8a8013d8987735d542df188021',
                                type: 'input',
                                value: '未婚',
                                code:'',
                            }
                        }
                    },
                    {
                        id: '638b12ff1d67d0e61a3aace0f1e6a11c',
                        type: 'normal',
                        expression: {
                            left: {
                                id: 'f0c01555924010e52f9cc918c5a55d7d',
                                type: 'variable',
                                code: 'customer.nianling',
                                value: '客户.年龄',
                                // value: {
                                //     groupCode: ['kehu'],
                                //     groupLabel: '客户',
                                //     propCode: 'nianling',
                                //     propLabel: '年龄'
                                // }
                            },
                            operator: {
                                label: '等于',
                                charator: '=='
                            },
                            right: {
                                id: '5a30eaec8e0ed46f49dcb25ebd51bc7c',
                                type: 'func',
                                code: 'format(getDate(),"YYYYMMDD")',
                                value: '格式化日期(当前日期,YYYYMMDD)'
                                // value: {
                                //     actionName: 'date.action',
                                //     methodName: 'format',
                                //     methodLabel: '格式化日期',
                                //     parameters: [
                                //         {
                                //             name: '目标日期',
                                //             type: 'Date',
                                //             value: {
                                //                 id: 'dfc3cd60659f125bcd5766905260b20c',
                                //                 type: 'func',
                                //                 value: {
                                //                     actionName: 'date.action',
                                //                     methodName: 'getDate',
                                //                     methodLabel: '当前日期',
                                //                     parameters: []
                                //                 }
                                //             }
                                //         },
                                //         {
                                //             name: '格式',
                                //             type: 'String',
                                //             value: {
                                //                 id: '150fea2a440d4a251c8e62982d7ef054',
                                //                 type: 'input',
                                //                 value: 'YYYYMMDD'
                                //             }
                                //         }
                                //     ]
                                // }
                            }
                        }
                    },
                    {
                        id: '9ee37340f10e30a944f23860f7b06afd',
                        type: 'normal',
                        expression: {
                            left: {
                                id: 'b83129403fcaaf3c70b330d4d53ae60b',
                                type: 'variable',
                                code: 'customer.xingbie',
                                value: '客户.性别',
                                // value: {
                                //     dicts: {
                                //         label: '性别',
                                //         value: 'sex',
                                //         children: [
                                //             {
                                //                 label: '男',
                                //                 value: '1'
                                //             },
                                //             {
                                //                 label: '女',
                                //                 value: '0'
                                //             }
                                //         ]
                                //     },
                                //     groupCode: ['kehu'],
                                //     groupLabel: '客户',
                                //     propCode: 'xingbie',
                                //     propLabel: '性别'
                                // }
                            },
                            operator: {
                                label: '等于',
                                charator: '=='
                            },
                            right: {
                                id: 'e12a208596c5525130399c43d507a3aa',
                                type: 'constant',
                                value: '男',
                                code: '1'
                                // value: {
                                //     dicts: {
                                //         label: '性别',
                                //         value: 'sex',
                                //         children: [
                                //             {
                                //                 label: '男',
                                //                 value: '1'
                                //             },
                                //             {
                                //                 label: '女',
                                //                 value: '0'
                                //             }
                                //         ]
                                //     },
                                //     dictType: 'sex',
                                //     dictTypeLabel: '性别',
                                //     code: '1',
                                //     label: '男'
                                // }
                            }
                        }
                    },
                    {
                        id: '57d2401cb7b49f4643bd4ba775886fc5',
                        type: 'normal',
                        expression: {
                            left: {
                                id: 'a201a2e363defe1868233f469705437d',
                                type: 'variable',
                                code: 'customer.xingbie',
                                value: '客户.性别',
                                // value: {
                                //     dicts: {
                                //         label: '性别',
                                //         value: 'sex',
                                //         children: [
                                //             {
                                //                 label: '男',
                                //                 value: '1'
                                //             },
                                //             {
                                //                 label: '女',
                                //                 value: '0'
                                //             }
                                //         ]
                                //     },
                                //     groupCode: ['kehu'],
                                //     groupLabel: '客户',
                                //     propCode: 'xingbie',
                                //     propLabel: '性别'
                                // }
                            },
                            operator: {
                                label: '在集合中',
                                charator: 'in'
                            },
                            right: {
                                id: '911fb641ab283eccc1a17fd78601c551',
                                type: 'constant',
                                value: '男,女',
                                code: '1,0'
                                // value: {
                                //     dicts: {
                                //         label: '性别',
                                //         value: 'sex',
                                //         children: [
                                //             {
                                //                 label: '男',
                                //                 value: '1'
                                //             },
                                //             {
                                //                 label: '女',
                                //                 value: '0'
                                //             }
                                //         ]
                                //     },
                                //     dictType: 'sex',
                                //     dictTypeLabel: '性别',
                                //     code: '',
                                //     label: ''
                                // }
                            }
                        }
                    },
                    {
                        id: '50757e83994e09379b35c4132e4415bb',
                        type: 'or',
                        subConditions: [{
                            id:'wer234r345345345353535546567',
                            type:'and',
                            subConditions:[
                            {
                                id: '0a2d8a7d952e124159226a69ed21fb15',
                                type: 'normal',
                                expression: {
                                    left: {
                                        id: '2956e9cc421afbb073f3fc537d2a7d49',
                                        type: 'variable',
                                        code: 'customer.nianling',
                                        value: '客户.年龄',
                                        // value: {
                                        //     groupCode: ['kehu'],
                                        //     groupLabel: '客户',
                                        //     propCode: 'nianling',
                                        //     propLabel: '年龄'
                                        // }
                                    },
                                    operator: {
                                        label: '大于等于',
                                        charator: '>='
                                    },
                                    right: {
                                        id: 'aaee47dcbcd8b775ad98baf0be3171f8',
                                        type: 'input',
                                        value: '99',
                                        code: '99',
                                    }
                                }
                            }
                        ]}]
                    },
                    {
                        id: 'bbc7b9132e24deff907386b6c511fec2',
                        type: 'or',
                        subConditions: [
                            {
                                id: '1d1c6a532ac8222b8f45e05e5983688',
                                type: 'normal',
                                expression: {
                                    left: {
                                        id: '3a0dd38fea59adc86ba3bc3a86cee3c2',
                                        type: 'variable',
                                        code: 'dingdan.shuliang',
                                        value: '订单.数量',
                                        // value: {
                                        //     groupCode: ['dingdan'],
                                        //     groupLabel: '订单',
                                        //     propCode: 'shuliang',
                                        //     propLabel: '数量'
                                        // }
                                    },
                                    operator: {
                                        label: '大于等于',
                                        charator: '>='
                                    },
                                    right: {
                                        id: 'f3e8f1bd1baf90153cabf5a7c3d119a0',
                                        type: 'input',
                                        value: '1000000',
                                        code: '1000000',
                                    }
                                }
                            },
                            {
                                id: '1d1c6a532ac8222b8f45e05e59983688',
                                type: 'normal',
                                expression: {
                                    left: {
                                        id: '3a0dd38fea59adc86ba3bc3a86cee3c2',
                                        type: 'variable',
                                        code: 'dingdan.shuliang',
                                        value: '订单.数量',
                                        // value: {
                                        //     groupCode: ['dingdan'],
                                        //     groupLabel: '订单',
                                        //     propCode: 'shuliang',
                                        //     propLabel: '数量'
                                        // }
                                    },
                                    operator: {
                                        label: '大于等于',
                                        charator: '>='
                                    },
                                    right: {
                                        id: 'f3e8f1bd1baf90153cabf5a7c3d119a0',
                                        type: 'input',
                                        value: '1000000',
                                        code: '1000000',

                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            actions: [
                {
                    id: '4c97fb7f6890bbd8e64891ab61330195',
                    type: 'variableAssign',
                    value: {
                        left: {
                            id: '9144ca3d13a17d06f6812ebb2e90bd76',
                            type: 'variable',
                            value:'客户',
                            code:'customer'
                            // value: {
                            //     groupCode: 'kehu',
                            //     groupLabel: '客户',
                            //     propCode: '',
                            //     propLabel: ''
                            // }
                        },
                        right: {
                            id: 'a1094e6a993c42cc35a0f2419e5399f2',
                            type: 'input',
                            value: '高级客户',
                            code:'customer',
                        }
                    }
                },
                {
                    id: 'c13208bdd305314a960bb16a86c7d2c3',
                    type: 'variableAssign',
                    value: {
                        left: {
                            id: '40d054f6f3daf664e2ab4467db30e845',
                            type: 'variable',
                            code:'dingdan.jiage',
                            value:'订单.价格'
                            // value: {
                            //     groupCode: ['dingdan'],
                            //     groupLabel: '订单',
                            //     propCode: 'jiage',
                            //     propLabel: '价格'
                            // }
                        },
                        right: {
                            id: 'dd26473c22139ba91b54212cdb281a19',
                            type: 'input',
                            value: '50',
                            code:'50'
                        }
                    }
                }
            ],
            falseActions: [
                {
                    id: '9a2d88f461c5cc66b5aa5636c9020200',
                    type: 'variableAssign',
                    value: {
                        left: {
                            id: '342d13b91667ce19cc47c64d89ec2483',
                            type: 'variable',
                            value: {
                                groupCode: ['dingdan'],
                                groupLabel: '订单',
                                propCode: 'jiage',
                                propLabel: '价格'
                            }
                        },
                        right: {
                            id: 'a8f1f779db6bef6c24eccdd7381eb5f2',
                            type: 'input',
                            value: '100'
                        }
                    }
                },
                {
                    id: '854df4741690ad3f143c1fd7968bef82',
                    type: 'executeMethod',
                    value: {
                        id: '25293777d3c5188b566dbb3c8ea6e717',
                        type: 'func',
                        value: {
                            actionName: 'date.action',
                            methodName: 'format',
                            methodLabel: '格式化日期',
                            parameters: [
                                {
                                    name: '目标日期',
                                    type: 'Date',
                                    value: {
                                        id: 'd2ac1876603dac27e38b110589a392f7',
                                        type: 'func',
                                        value: {
                                            actionName: 'date.action',
                                            methodName: 'getDate',
                                            methodLabel: '当前日期',
                                            parameters: []
                                        }
                                    }
                                },
                                {
                                    name: '格式',
                                    type: 'String',
                                    value: {
                                        id: '83d177eb33f3f8aac7e263a2bf83e21c',
                                        type: 'input',
                                        value: 'YYYYMMDD'
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        }
    ]

});

export const [ApplicationStateProvider, useApplicationState] = createStoreContext(applicationStateInstance);

