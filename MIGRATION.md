# SNAM 项目重构说明

## 项目概述

本项目已从 **React + Ant Design + UMI** 架构重构为 **Vue 3 + Element Plus + Vite** 架构。

## 重构内容

### 1. 技术栈变更

#### 原技术栈 (React)
- React 17
- Ant Design 5.x
- UMI 3.x
- Zustand (状态管理)
- React Hooks

#### 新技术栈 (Vue 3)
- Vue 3.4+ (Composition API)
- Element Plus 2.5+
- Vite 5.x
- Pinia (状态管理)
- Vue Router 4

### 2. 保留的库

根据要求，以下库已保留：
- **axios** (0.27.2) - HTTP 请求库
- **rxjs** (7.5.5) - 响应式编程库
- **dayjs** - 日期处理库
- **lodash** - 工具函数库
- **ramda** - 函数式编程库
- **js-md5** - MD5 加密
- **lscache** - 本地缓存

### 3. 文件结构变更

#### 原始文件备份
所有原始的 React 文件已重命名为 `.tmp` 后缀：
- `.jsx` → `.jsx.tmp`
- `.js` → `.js.tmp`

#### 新文件结构
```
snam/
├── index.html                 # 入口 HTML
├── vite.config.js            # Vite 配置
├── package.json              # 依赖配置 (已更新)
├── src/
│   ├── main.js               # Vue 应用入口
│   ├── App.vue               # 根组件
│   ├── router/
│   │   └── index.js          # Vue Router 配置
│   ├── layouts/              # 布局组件
│   │   ├── MainLayout.vue    # 主布局
│   │   ├── UserLayout.vue    # 用户布局
│   │   └── WindowLayout.vue  # 窗口布局
│   ├── pages/                # 页面组件 (Vue)
│   │   ├── login/
│   │   │   └── index.vue
│   │   ├── user/
│   │   │   ├── index.vue
│   │   │   └── service.js
│   │   ├── role/
│   │   ├── menu/
│   │   ├── group/
│   │   └── ...
│   ├── common/               # 公共工具
│   │   ├── utils.js          # 工具函数 (已适配 Vue)
│   │   ├── request.js        # 请求封装
│   │   ├── iaxios.js         # Axios 封装
│   │   ├── constant.js       # 常量定义
│   │   ├── cache.js          # 缓存工具
│   │   └── service.js        # API 服务
│   └── assets/               # 静态资源
└── config/                   # 配置文件 (已备份)
```

## 主要变更说明

### 1. 路由配置

**原 UMI 路由** (`config/router.js.tmp`):
```javascript
export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [...]
  }
]
```

**新 Vue Router** (`src/router/index.js`):
```javascript
const routes = [
  {
    path: '/user',
    component: () => import('@/layouts/UserLayout.vue'),
    children: [...]
  }
]
```

### 2. 组件语法

**React 组件** (`.jsx.tmp`):
```jsx
import { useState, useEffect } from 'react';
import { Button } from 'antd';

export default (props) => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    // 逻辑
  }, []);
  
  return <Button>点击</Button>;
}
```

**Vue 组件** (`.vue`):
```vue
<template>
  <el-button @click="handleClick">点击</el-button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const data = ref([]);

onMounted(() => {
  // 逻辑
});
</script>
```

### 3. 状态管理

**原 Zustand**:
```javascript
import create from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

**新 Pinia** (可选使用):
```javascript
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
  },
});
```

### 4. UI 组件映射

| Ant Design | Element Plus |
|------------|--------------|
| Button | el-button |
| Input | el-input |
| Table | el-table |
| Form | el-form |
| Modal | el-dialog |
| Message | ElMessage |
| Notification | ElNotification |
| Select | el-select |
| DatePicker | el-date-picker |
| Upload | el-upload |

### 5. HTTP 请求

HTTP 请求方式保持不变，继续使用 RxJS + Axios：

```javascript
import { api } from '@/common/utils';

// 使用方式相同
api.user.searchUser(params).subscribe({
  next: (data) => {
    // 处理数据
  },
  error: (err) => {
    // 处理错误
  },
});
```

## 开发指南

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问: http://localhost:8000

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 预览生产构建

```bash
npm run preview
# 或
yarn preview
```

## 迁移进度

### 已完成
- ✅ 项目配置文件 (package.json, vite.config.js)
- ✅ 入口文件 (main.js, App.vue, index.html)
- ✅ 路由配置 (Vue Router)
- ✅ 布局组件 (MainLayout, UserLayout, WindowLayout)
- ✅ 公共工具函数 (utils.js, request.js, iaxios.js)
- ✅ 常量和缓存 (constant.js, cache.js)
- ✅ 服务层 (service.js 文件)
- ✅ 登录页面
- ✅ 404 页面
- ✅ 用户管理页面
- ✅ 角色管理页面
- ✅ 更新日志页面
- ✅ 所有页面的基础 Vue 模板

### 待完善
- ⏳ 各页面的详细业务逻辑实现
- ⏳ 组件库的完整迁移
- ⏳ 样式文件的适配
- ⏳ 权限控制的完善
- ⏳ 国际化配置

## 注意事项

1. **原始文件保留**: 所有原始 React 文件都保留为 `.tmp` 后缀，可以随时参考
2. **渐进式迁移**: 可以逐步完善各个页面的功能
3. **API 兼容**: 后端 API 接口保持不变
4. **样式调整**: 需要根据 Element Plus 的样式规范调整部分 CSS
5. **测试**: 建议对每个迁移的功能进行充分测试

## 常见问题

### Q: 如何查看原始 React 代码？
A: 所有原始代码都保存为 `.tmp` 文件，可以直接查看参考。

### Q: 如何添加新页面？
A: 在 `src/pages` 目录下创建 `.vue` 文件，并在 `src/router/index.js` 中添加路由配置。

### Q: Element Plus 组件如何使用？
A: 参考官方文档: https://element-plus.org/zh-CN/

### Q: 如何调试 RxJS 请求？
A: 在 subscribe 的 next/error 回调中添加 console.log 进行调试。

## 技术支持

如有问题，请参考：
- Vue 3 文档: https://cn.vuejs.org/
- Element Plus 文档: https://element-plus.org/zh-CN/
- Vite 文档: https://cn.vitejs.dev/
- Vue Router 文档: https://router.vuejs.org/zh/

## 版本信息

- 原版本: React 17 + Ant Design 5 + UMI 3
- 新版本: Vue 3.4 + Element Plus 2.5 + Vite 5
- 迁移日期: 2024-01-22
- 迁移版本: v3.3.0

