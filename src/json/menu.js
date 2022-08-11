export default [
    {
        "icon": "workplace",
        "name": "menu.workplace",
        "path": "/home"
    },
    {   //原料管理
        "icon": "material",
        "name": "menu.material",
        "path": "/material",
        "children": [
            {   // 原料档案        
                "name": "menu.material.information",
                "path": "/material/information"
            },
            {   // 原料库存   
                "name": "menu.material.stock",
                "path": "/material/stock"
            },
            {    // 原料入库        
                "name": "menu.material.in",
                "path": "/material/in"
            },
            {    // 原料出库        
                "name": "menu.material.out",
                "path": "/material/out"
            }
        ]
    },
    {   //配方管理     
        "icon": "recipe",
        "name": "menu.recipeManage",
        "path": "/recipeManage",
        "children": [
            {   // 配方清单
                "name": "menu.recipeManage.recipe",
                "path": "/recipeManage/recipe"
            }
        ]
    },
    {   //生产管理   
        "icon": "produce",
        "name": "menu.produce",
        "path": "/produce",
        "children": [
            {   // 生产计划
                "name": "menu.produce.plan",
                "path": "/produce/plan"
            }
        ]
    },
    {   //成品管理     
        "icon": "goods",
        "name": "menu.goods",
        "path": "/goods",
        "children": [
            {   // 成品档案
                "name": "menu.goods.information",
                "path": "/goods/information"
            },
            {   // 成品库存   
                "name": "menu.goods.stock",
                "path": "/goods/stock"
            },
            {    // 成品入库        
                "name": "menu.goods.in",
                "path": "/goods/in"
            },
            {    // 成品出库        
                "name": "menu.goods.out",
                "path": "/goods/out"
            }
        ]
    },
    { //审核审批
        "icon": "approval",
        "name": "menu.approval",
        "path": "/approval",
        "children": [
            {   // 采购审批
                "name": "menu.approval.purchase",
                "path": "/approval/purchase"
            },{   // 销售审批
                "name": "menu.approval.sale",
                "path": "/approval/sale"
            },{   // 补料审批
                "name": "menu.approval.refillOut",
                "path": "/approval/refillOut"
            }
        ]
    },
    { //供应商管理
        "icon": "supplier",
        "name": "menu.supplier",
        "path": "/supplier",
        "children": [
            {   // 供应商列表
                "name": "menu.supplier.information",
                "path": "/supplier/information"
            }
        ]
    },
    { //采购销售申请
        "icon": "apply",
        "name": "menu.apply",
        "path": "/apply",
        "children": [
            {   // 采购申请
                "name": "menu.apply.purchase",
                "path": "/apply/purchase"
            },{   // 销售申请
                "name": "menu.apply.sale",
                "path": "/apply/sale"
            }
        ]
    },
    {//基础数据
        "icon": "baseData",
        "name": "menu.baseData",
        "path": "/baseData",
        "children": [
            {   // 包装单位
                "name": "menu.baseData.unitType",
                "path": "/baseData/unitType"
            },
            {   // 出入库方式
                "name": "menu.baseData.outinType",
                "path": "/baseData/outinType"
            },
            {   // 成品分类         
                "name": "menu.baseData.productType",
                "path": "/baseData/productType"
            },
            {   // 仓库管理        
                "name": "menu.baseData.warehouse",
                "path": "/baseData/warehouse"
            },
        ]
    },
    {   //系统管理     
        "icon": "system",
        "name": "menu.system",
        "path": "/system",
        "children": [
            {   // 用户管理
                "name": "menu.system.user",
                "path": "/system/users"
            },
            {   // 角色管理
                "name": "menu.system.role",
                "path": "/system/roles"
            }
        ]
    }
];