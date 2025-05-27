import {
    ApiOutlined,
    ClusterOutlined,
    DiffOutlined,
    GatewayOutlined,
    KeyOutlined,
    LockOutlined,
    LockTwoTone,
    RestOutlined,
    SunOutlined,
    TransactionOutlined,
    UnlockOutlined,
    UnlockTwoTone,
    ClockCircleOutlined,
    ForkOutlined,
    MergeOutlined,
    HistoryOutlined,
    RotateRightOutlined,
    CloseCircleOutlined,
    BugOutlined,
    VideoCameraOutlined,
    VideoCameraAddOutlined,
    FieldBinaryOutlined,
    StockOutlined,
    SketchOutlined,
    FunctionOutlined,
    InteractionOutlined,
    NodeExpandOutlined,
    NodeCollapseOutlined,
    ControlOutlined,
    SwapLeftOutlined,
    CloudOutlined,
    FileSearchOutlined,
    FileAddOutlined,
    FileSyncOutlined,
    JavaOutlined
} from '@ant-design/icons';
import { cond } from 'lodash';
import { T, type } from 'ramda';

const icons = {
    root: <ApiOutlined />,
    container: <ClusterOutlined />,
    item0: <DiffOutlined />,
    item1: <RestOutlined />,
    item2: <GatewayOutlined />,
    item3: <TransactionOutlined />,
    item4: <KeyOutlined />,
    item5: <LockOutlined />,
    inner0: <UnlockTwoTone />,
    inner1: <UnlockOutlined />,
    inner2: <LockTwoTone />,
    inner3: <SunOutlined />,
    item6: <UnlockOutlined />,
    item7: <SunOutlined />,
    condition:<ForkOutlined />,
    loop: <ClockCircleOutlined />,
}

export const menuIcon = {
    icon_root: <ApiOutlined />,
    icon_condition:<ForkOutlined />,
    icon_loop: <ClockCircleOutlined />,
    icon_if:<ClusterOutlined />,
    icon_elseif:<MergeOutlined />,
    icon_else:<MergeOutlined />,
    icon_for: <GatewayOutlined />,
    icon_while: <HistoryOutlined />,
    icon_continue: <RotateRightOutlined />,
    icon_break: <CloseCircleOutlined />,
    icon_return: <SwapLeftOutlined />,
    icon_error:<BugOutlined />,
    icon_try: <VideoCameraOutlined />,
    icon_catch:<VideoCameraAddOutlined />,
    icon_finally: <FieldBinaryOutlined />,
    icon_throw: <StockOutlined />,
    icon_data:<ControlOutlined />,
    icon_variable:<SketchOutlined />,
    icon_set_object:<FunctionOutlined />,
    icon_convert_data:<InteractionOutlined />,
    icon_json_parse: <NodeExpandOutlined />,
    icon_json_to_text: <NodeCollapseOutlined />,
    icon_db:  <CloudOutlined />,
    icon_db_select:<FileSearchOutlined />,
    icon_db_insert:<FileAddOutlined />,
    icon_db_update:<FileSyncOutlined />,
    icon_groovy:<JavaOutlined />,
}

const readTemplate = (template, data = { items: {} }) => {
  for (const [key, value] of Object.entries(template)) {
    data.items[key] = {
      index: key,
      canMove: true,
      isFolder: value !== null,
      children: value !== null ? Object.keys(value) : undefined,
      data: key,
      icon: icons[key],
      canRename: true,
      beMenu:true,
    };

    if (value !== null) {
      readTemplate(value, data);
    }
  }
  return data;
};

const shortTreeTemplate = {
  menu: {
    container: {
      item0: null,
      item1: null,
      item2: null,
      item3: {
        inner0: null,
        inner1: null,
        inner2: null,
        inner3: null
      },
      item4: null,
      item5: null
    }
  }
};

export const menu = {
  menu: {
    index:'menu',
    isFolder:true,
    canMove: false,
    canRename: false,
    beMenu:true,
    data: {
        title: '根节点',
        icon: menuIcon['icon_root'],
        desc: '根节点'
    },
    canRename: false,
    children:['MENU_DATA','MENU_CONDITION','MENU_LOOP','MENU_ERROR','MENU_DB']
  },
  MENU_DATA: {
    index: 'MENU_DATA',
    canMove: false,
    isFolder:true,
    beMenu:true,
    data: {
      title: '数据节点',
      icon: menuIcon['icon_data'],
      desc: '数据处理'
    },
    children:['MENU_VARIABLE','MENU_SET_OBJECT','MENU_CONVERT_DATA','MENU_JSON_PARSE','MENU_JSON_TO_TEXT','MENU_GROOVY'], 
  },
  MENU_CONDITION: {
    index: 'MENU_CONDITION',
    canMove: false,
    isFolder:true,
    canRename: false,
    beMenu:true,
    data: {
      title: '条件节点',
      icon: menuIcon['icon_condition'],
      desc: '条件节点'
    },
    children:['MENU_IF','MENU_ELSE_IF','MENU_ELSE'],
  },
  MENU_LOOP:  {
    index: 'MENU_LOOP',
    canMove: false,
    isFolder:true,
    beMenu:true,
    data: {
      title: '循环节点',
      icon: menuIcon['icon_loop'],
      desc: '循环节点'
    },
    children:['MENU_FOR','MENU_WHILE','MENU_CONTINUE','MENU_BREAK','MENU_RETURN']
  },
  MENU_ERROR: {
    index: 'MENU_ERROR',
    canMove: false,
    isFolder:true,
    beMenu:true,
    data: {
      title: '异常处理',
      icon: menuIcon['icon_error'],
      desc: '异常处理'
    },
    children:['MENU_TRY','MENU_CATCH','MENU_FINALLY','MENU_THROW']
  },
  MENU_DB: {
    index: 'MENU_DB',
    canMove: true,
    isFolder:true,
    beMenu:true,
    data: {
      title: '数据库节点',
      icon: menuIcon['icon_db'],
      desc: '数据库操作'
    },
    children:['MENU_DB_SELECT','MENU_DB_INSERT','MENU_DB_UPDATE']
  },
  MENU_VARIABLE: {
    index: 'MENU_VARIABLE',
    canMove: true,
    isFolder:false,
    beMenu:true,
    beFolder:false,
    type:'variable',
    data: {
      title: '定义变量',
      icon: menuIcon['icon_variable'],
      desc: '定义一个变量'
    },
    canRename: false,
    children:undefined
  },
  MENU_SET_OBJECT: {
    index: 'MENU_SET_OBJECT',
    canMove: true,
    isFolder:false,
    beMenu:true,
    beFolder:false,
    type:'set_object',
    data: {
      title: '对象赋值',
      icon: menuIcon['icon_set_object'],
      desc: '给对象属性或者变量赋值'
    },
    canRename: false,
    children:undefined
  },
  MENU_CONVERT_DATA:{
    index: 'MENU_CONVERT_DATA',
    canMove: true,
    isFolder:false,
    beMenu:true,
    beFolder:false,
    type:'convert_data',
    data: {
      title: '对象转换',
      icon: menuIcon['icon_convert_data'],
      desc: '将对象的属性进行复制转换'
    },
    canRename: false,
    children:undefined
  },
  MENU_JSON_PARSE: {
     index: 'MENU_JSON_PARSE',
    canMove: true,
    isFolder:false,
    beMenu:true,
    beFolder:false,
    type:'json_parse',
    data: {
      title: 'Json转换成对象',
      icon: menuIcon['icon_json_parse'],
      desc: '将Json字符串转换成对象'
    },
    canRename: false,
    children:undefined
  },
  MENU_JSON_TO_TEXT: {
    index: 'MENU_JSON_TO_TEXT',
    canMove: true,
    isFolder:false,
    beMenu:true,
    beFolder:false,
    type:'json_to_text',
    data: {
      title: '转换为Json文本',
      icon: menuIcon['icon_json_to_text'],
      desc: '将对象转换为Json字符串'
    },
    canRename: false,
    children:undefined
  },
  MENU_GROOVY: {  
    index: 'MENU_GROOVY',
    canMove: true,
    isFolder:false,
    beMenu:true,
    beFolder:false,
    type:'groovy',
    data: {
      title: '插入代码段(Groovy)',
      icon: menuIcon['icon_groovy'],
      desc: '插入一段GROOVY代码'
    },
    canRename: false,
    children:undefined
  },
  MENU_IF: {
        index: 'MENU_IF',
        canMove: true,
        isFolder:false,
        beMenu:true,
        beFolder:true,
        type:'if',
        data: {
            title: 'IF条件',
            icon: menuIcon['icon_if'],
            desc: '如果满足条件，则执行以下操作'
        },
        canRename: false,
        children:undefined
    },
    MENU_ELSE_IF: {
        index: 'MENU_ELSE_IF',
        canMove: true,
        isFolder:false,
        beMenu:true,
        beFolder:true,
        type:'elseif',
        data: {
            title: 'ELSE IF',
            icon: menuIcon['icon_elseif'],
            desc: '条件分支判断'
        },
        canRename: false,
        children:undefined
    },
    MENU_ELSE: {
        index: 'MENU_ELSE',
        canMove: true,
        isFolder:false,
        beMenu:true,
        beFolder:true,
        type:'else',
        data: {
            title: 'ELSE',
            icon: menuIcon['icon_else'],
            desc: '如果不满足前面所有的IF条件，则执行以下操作'
        },
        canRename: false,
        children:undefined
    },
    MENU_FOR: {
        index: 'MENU_FOR',
        canMove: true,
        isFolder:false,
        beMenu:true,
        beFolder:true,
        type:'for',
        data: {
            title: 'For次数循环',
            icon: menuIcon['icon_for'],
            desc: '对一组指令指定次数的循环操作'
        },
        canRename: false,
        children:undefined
    },
    MENU_WHILE: {
        index: 'MENU_WHILE',
        canMove: true,
        isFolder:false,
        beMenu:true,
        beFolder:true,
        type:'while',
        data: {
            title: 'While循环',
            icon: menuIcon['icon_while'],
            desc: '当条件为真时对一组指令进行循环操作'
        },
        canRename: false,
        children:undefined
    },
     MENU_CONTINUE: {
        index: 'MENU_CONTINUE',
        canMove: true,
        isFolder:false,
        beMenu:true,
        beFolder:false,
        type:'continue',
        data: {
            title: 'Continue 忽略本次循环',
            icon: menuIcon['icon_continue'],
            desc: '忽略本次循环，继续下一次循环'
        },
        canRename: false,
        children:undefined
    },
    MENU_BREAK: {
        index: 'MENU_BREAK',
        canMove: true,
        isFolder:false,
        beMenu:true,
        beFolder:false,
        type:'break',
        data: {
            title: 'Break 退出循环',
            icon: menuIcon['icon_break'],
            desc: '退出当前循环'
        },
        canRename: false,
        children:undefined
    },
    MENU_RETURN: {
        index: 'MENU_RETURN',
        canMove: true,
        isFolder:false,
        beMenu:true,
        beFolder:false,
        type:'return',
        data: {
            title: 'Return 返回',
            icon: menuIcon['icon_return'],
            desc: '返回数据或退出'
        },
        canRename: false,
        children:undefined
    },
    MENU_TRY: {
        index: 'MENU_TRY',
        canMove: true,
        isFolder:false,
        beMenu:true,
        beFolder:true,
        type:'try',
        data: {
            title: 'Try',
            icon: menuIcon['icon_try'],
            desc: '尝试执行开始标记'
        },
        canRename: false,
        children:undefined
    },
    MENU_CATCH: {
        index: 'MENU_CATCH',
        canMove: true,
        isFolder:false,
        beMenu:true,
        beFolder:true,
        type:'catch',
        data: {
            title: 'Catch',
            icon: menuIcon['icon_catch'],
            desc: '捕获异常时执行'
        },
        canRename: false,
        children:undefined
    },
    MENU_FINALLY: {
        index: 'MENU_FINALLY',
        canMove: true,
        isFolder:false,
        beMenu:true,
        beFolder:true,
        type:'finally',
        data: {
            title: 'Finally',
            icon: menuIcon['icon_finally'],
            desc: '无论是否发生异常，都会执行'
        },
        canRename: false,
        children:undefined
    },
    MENU_THROW: {
        index: 'MENU_THROW',
        canMove: true,
        isFolder:false,
        beMenu:true,
        beFolder:false,
        type:'throw',
        data: {
            title: 'Throw',
            icon: menuIcon['icon_throw'],
            desc: '抛出异常'
        },
        canRename: false,
        children:undefined
    },
    MENU_DB_SELECT: {
      index: 'MENU_DB_SELECT',
      canMove: true,
      isFolder:false,
      beMenu:true,
      beFolder:false,
      type:'db_select',
      data: {
          title: 'Select查询',
          icon: menuIcon['icon_db_select'],
          desc: '数据库查询'
      },
      canRename: false,
      children:undefined
    },
    MENU_DB_INSERT: {
      index: 'MENU_DB_INSERT',
      canMove: true,
      isFolder:false,
      beMenu:true,
      beFolder:false,
      type:'db_insert',
      data: {
          title: '保存对象',
          icon: menuIcon['icon_db_insert'],
          desc: '数据库保存一条新数据对象'
      },
      canRename: false,
      children:undefined
    },
    MENU_DB_UPDATE: {
      index: 'MENU_DB_UPDATE',
      canMove: true,
      isFolder:false,
      beMenu:true,
      beFolder:false,
      type:'db_update',
      data: {
          title: '更新对象',
          icon: menuIcon['icon_db_update'],
          desc: '数据库更新原有的对象'
      },
      canRename: false,
      children:undefined
    }
};

// const menu = readTemplate(shortTreeTemplate);
export const template = {
    ...menu,
    root: {
        index: 'root',
        canMove: true,
        isFolder:true,
        data: {
            title: '根节点',
            icon: icons['root'],
            desc: '根节点'
        },
        canRename: false,
        children:[]
    },
    //  MENU_VARIABLE: {
    //   index: 'MENU_VARIABLE',
    //   canMove: true,
    //   isFolder:false,
    //   beMenu:true,
    //   beFolder:false,
    //   data: {
    //     title: '定义变量',
    //     icon: menuIcon['icon_variable'],
    //     desc: '定义一个变量'
    //   },
    //   canRename: false,
    //   children:undefined
    // },
    // IF: {
    //     index: 'IF',
    //     canMove: true,
    //     isFolder:true,
    //     data: {
    //         title: 'IF条件',
    //         icon: icons['root'],
    //         desc: '如果满足条件，则执行以下操作'
    //     },
    //     canRename: false,
    //     children:undefined
    // },
    // FOR: {
    //     index: 'FOR',
    //     canMove: true,
    //     isFolder:true,
    //     data: {
    //         title: 'For次数循环',
    //         icon: icons['item0'],
    //         desc: '从1开始到10结束，递增值为1，将当前循环值保存到loop_index'
    //     },
    //     canRename: false,
    //     children:['LOOP_TRY','LOOP_TRY_CATCH','LOOP_TRY_END']
    // },
    // LOOP_TRY: {
    //     index: 'LOOP_TRY',
    //     canMove: true,
    //     isFolder:true,
    //     data: {
    //         title: 'Try',
    //         icon: menuIcon['icon_try'],
    //         desc: '尝试执行'
    //     },
    //     canRename: false,
    //     children:['TRY_EMAIL_SEND']
    // },
    // TRY_EMAIL_SEND: {
    //     index: 'TRY_EMAIL_SEND',
    //     canMove: true,
    //     isFolder:false,
    //     data: {
    //         title: '发送邮件',
    //         icon: icons['item5'],
    //         desc: '发送邮件到'
    //     },
    //     canRename: false,
    //     children:undefined
    // },
    // LOOP_TRY_CATCH: {
    //     index: 'LOOP_TRY_CATCH',
    //     canMove: true,
    //     isFolder:true,
    //     data: {
    //         title: 'Catch',
    //         icon: menuIcon['icon_catch'],
    //         desc: '尝试失败时执行，将错误信息保存到exception'
    //     },
    //     canRename: false,
    //     children:undefined
    // },
}






const longTreeTemplate = {
  root: {
    Fruit: {
      Apple: null,
      Orange: null,
      Lemon: null,
      Berries: {
        Strawberry: null,
        Blueberry: null
      },
      Banana: null
    },
    Meals: {
      America: {
        SmashBurger: null,
        Chowder: null,
        Ravioli: null,
        MacAndCheese: null,
        Brownies: null
      },
      Europe: {
        Risotto: null,
        Spaghetti: null,
        Pizza: null,
        Weisswurst: null,
        Spargel: null
      },
      Asia: {
        Curry: null,
        PadThai: null,
        Jiaozi: null,
        Sushi: null
      },
      Australia: {
        PotatoWedges: null,
        PokeBowl: null,
        LemonCurd: null,
        KumaraFries: null
      }
    },
    Desserts: {
      Cookies: null,
      IceCream: null
    },
    Drinks: {
      PinaColada: null,
      Cola: null,
      Juice: null
    }
  }
};

export const longTree = readTemplate(longTreeTemplate);
export const shortTree = readTemplate(shortTreeTemplate);